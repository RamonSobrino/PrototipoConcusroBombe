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
        addMarker(new google.maps.LatLng(...element.coordenadas));
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


function addMarker(location) {

    let marker = new google.maps.Marker({
        position: location,
        map: map
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        markerSelected = marker;
        var request = {
            location: markerSelected.position,
            radius: '5',
            type: ['restaurant', 'cafe', 'bar']
        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, callback);
    });
    this.markers.push(marker);
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            let place = results[i];
            let types = place.types;
            if (types.indexOf('restaurant') !== -1 ||
                types.indexOf('cafe') !== -1 ||
                types.indexOf('bar') !== -1) {
                new google.maps.InfoWindow({
                    content: `<div id="content"><div id="siteNotice"></div>
                        <h5>${place.name} (${place.rating})</h5>
                        <div id="bodyContent">
                            <p>${place.vicinity}</p>
                        </div></div>`
                }).open(map, markerSelected);
            }
        }
    }
}
