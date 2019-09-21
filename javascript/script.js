var map;
var poly;
var markerPosReal;
var circulos = [];
var Markers = [];
var puntuacionTotal = 0;
var contadorSitios = 0;
const tiposComida = new Set();


function initMap() {

    var gastroMateo = new google.maps.LatLng(43.361365, -5.851818);
    var misOpciones = {
        center: gastroMateo,
        zoom: 12,
        streetViewControl: false,
        disableDefaultUI: true,
        minZoom: 6,
        maxZoom: 19,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    };
    map = new google.maps.Map(document.getElementById("map"),
        misOpciones);

    sitios.forEach((element, index) => {
        addMarker(new google.maps.LatLng(element.coordenadas[0], element.coordenadas[1]), index);
        element.tipo.forEach(element => {
            tiposComida.add(element);
        });
    });

    tiposComida.forEach(element => {
        var x = document.getElementById("comboxBox");
        var option = document.createElement("option");
        option.text = element;
        x.add(option);
    });




}

function filtrarSitios(selectedIndex){
    var 
}


function addMarker(location, index) {

    let marker = new google.maps.Marker({
        position: location,
        map: map
    });

    google.maps.event.addListener(marker, 'click', function (event) {
        var info = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + sitios[index].nombre + '</h1>' +
            '<div id="bodyContent">' +
                        '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: info
        });

        infowindow.open(this.map, marker);
    });

    makers.add(marker);

}


function clearCirclesPath() {
    for (var i = 0; i < circulos.length; i++) {
        circulos[i].setMap(null);
    }
    circulos = [];
}

function confirmar() {

    this.llenarCirculos();

    document.getElementById('confirmarButton').setAttribute('disabled', true);
    document.getElementById('okButton').removeAttribute('disabled');
    google.maps.event.removeListener(this.listenerMarker);
}

function quitarCirculosMarkersyLineas() {
    this.clearCirclesPath();
    this.marker.setMap(null);
    this.markerPosReal.setMap(null);
    this.poly.setMap(null);
}

function okPuntuacion() {
    this.quitarCirculosMarkersyLineas();
    this.listenerMarker = google.maps.event.addListener(map, 'click', function (event) {
        situarMarcador(event.latLng);
    });
    document.getElementById('confirmarButton').removeAttribute('disabled');
    document.getElementById('okButton').setAttribute('disabled', true);

    this.contadorSitios = this.contadorSitios + 1

    if (this.contadorSitios == this.sitios.length) {
        alert("Juego acabado. Puntuacion: " + this.puntuacionTotal)
        this.initMap();
    } else {
        this.agregarFoto();

    }

}

function agregarFoto() {
    document.getElementById('area2').innerHTML = "0 Puntos Parciales";

    document.getElementById('imagen').innerHTML =
        "<h4> Imagen número " + (this.contadorSitios + 1) + "</h4>" +
        "<img src=\"img/" + this.sitios[this.contadorSitios].img + "\" >";
}


