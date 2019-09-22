var map;
var markerSelected;

var markers = [];
const tiposComida = new Set();

function initMap() {

    var gastroMateo = new google.maps.LatLng(43.361365, -5.851818);
    var misOpciones = {
        center: gastroMateo,
        zoom: 10,
        streetViewControl: false,
        disableDefaultUI: true,
        minZoom: 10,
        maxZoom: 19,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById("map"),
        misOpciones);

    agregarMarcadores(sitios)

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
