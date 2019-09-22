var map;
var markerSelected;

var markers = [];
const tiposComida = new Set();

var auxProporcion = 256;
var capaMostrada = true;
	
var WMS_URL = 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?';
var WMS_Layers = 'Catastro';
var map;
var markersArray = [];
var overlayWMS
var TileWMS = function(coord,zoom) {
  var proj = map.getProjection(); 
  var zfactor = Math.pow(2, zoom); 
  var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * auxProporcion / zfactor, coord.y * auxProporcion / zfactor) ); 
  var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * auxProporcion / zfactor, (coord.y + 1) * auxProporcion / zfactor)); 
  var bbox = top.lng() + "," + bot.lat() + "," + bot.lng() + "," + top.lat();
  
  var myURL= WMS_URL + "service=wms&srs=epsg:4326&request=getmap&width="+auxProporcion+"&height="+auxProporcion+"&format=image/png&TRANSPARENT=TRUE";
  myURL+="&layers="+WMS_Layers;
  myURL+="&bbox="+bbox;
  
  return myURL;

  
}



function initMap() {

    var gastroMateo = new google.maps.LatLng(43.361365, -5.851818);
    var misOpciones = {
        center: gastroMateo,
        zoom: 15,
        streetViewControl: false,
        disableDefaultUI: true,
        minZoom: 10,
        maxZoom: 19,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById("map"),
        misOpciones);

    agregarMarcadores(sitios)

    var overlayOptions =
    {
        getTileUrl: TileWMS,
        tileSize: new google.maps.Size(auxProporcion, auxProporcion)
    };
      overlayWMS = new google.maps.ImageMapType(overlayOptions);
      map.overlayMapTypes.push(overlayWMS);

    tiposComida.forEach(element => {
        var x = document.getElementById("comboxBox");
        var option = document.createElement("option");
        option.text = element;
        x.add(option);
    });
}


function agregarMarcadores(sitiosFiltrados) {
    sitiosFiltrados.forEach(element => {
        addMarker(element);
        element.tipo.forEach(element => {
            tiposComida.add(element);
        });
    });
}

function eliminarCapa(){
    if(capaMostrada){
     map.overlayMapTypes.pop();
     capaMostrada=false
    }else{
        map.overlayMapTypes.push(overlayWMS);
        capaMostrada=true
    }
}

function filtrarSitios(tipoComida) {

    this.markers.forEach(element => {
        element.setMap(null);
    })

    var sitiosFiltrados = sitios.filter(element => {
        return tipoComida == 'Todas' || element.tipo.includes(tipoComida)
    })
    agregarMarcadores(sitiosFiltrados);
}


function addMarker(element) {

    let marker = new google.maps.Marker({
        position: new google.maps.LatLng(...element.coordenadas),
        map: map,
        label: {
            text: element.nombre,
            color: '#FFFFFF',
            fontWeight: 'bold',
        },
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        markerSelected = marker;
        var request = {
            location: markerSelected.position,
            radius: '5',
            type: ['restaurant', 'cafe', 'bar']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
            callback(results, status, element.url)
        });
    });
    this.markers.push(marker);
}

function callback(results, status, url) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);

        for (var i = 0; i < results.length; i++) {
            let place = results[i];
            let types = place.types;
            if (types.includes('restaurant') ||
                types.includes('cafe') ||
                types.includes('bar')) {
                new google.maps.InfoWindow({
                    content: `<div id="content">
                            <h5>${place.name} (${place.rating})</h5>
                            <div class="text-center">
                                <img src="${place.photos && place.photos.length > 0 ? place.photos[0].getUrl() : ''}"width="300" height="150"></img>
                            </div>
                            <div class="row justify-content-between py-2">
                                <p class="m-0">${place.vicinity}</p>
                                <span class=" badge ${place.opening_hours && place.opening_hours.open_now ? 'badge-success' : 'badge-danger'}">${place.opening_hours && place.opening_hours.open_now ? 'Abierto' : 'Cerrado'}</span>
                            </div>
                            <p><a href="${url}" target="_blank">Más información...</a></p>
                        </div>`
                }).open(map, markerSelected);
            }
        }
    }
}
