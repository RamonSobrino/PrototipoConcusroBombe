var map;
var poly;
var markerPosReal;
var circulos = [];
var listenerMarker;
var puntuacionTotal = 0;
var contadorSitios = 0;


function initMap() {

    this.puntuacionTotal = 0;
    this.contadorSitios = 0;





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
    });

    // this.listenerMarker = google.maps.event.addListener(map, 'click', function(event) {
    //     situarMarcador(event.latLng);
    // });

    // this.agregarFoto();

}

function situarMarcador(localizacion) {
    var clickedLocation = new google.maps.LatLng(localizacion);
    addMarker(localizacion);
    map.panTo(localizacion);
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


}




function puntuacion(distancia) {
    if (distancia < 10000) {
        return 100;
    } else if (distancia < 20000) {
        return 50;
    } else if (distancia < 30000) {
        return 25;
    } else {
        return 0;
    }
}
function llenarCirculos() {
    var i;
    for (i = 0; i <= 30000; i += 10000) {
        var circuloOptions = {
            strokeColor: '#DCAAAC',
            strokeOpacity: 0.4,
            strokeWeight: 2,
            fillColor: '#00FFFF',
            fillOpacity: 0.10,
            map: map,
            center: marker.position,
            radius: i
        };
        circulos.push(new google.maps.Circle(circuloOptions));
    }

    this.markerPosReal = new google.maps.Marker({
        position: sitios[this.contadorSitios].coordenadas,
        map: map,
        draggable: false,
        title: sitios[this.contadorSitios].titulo,
        icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
    });

    var dist = Math.round(google.maps.geometry.spherical.computeDistanceBetween(sitios[this.contadorSitios].coordenadas, marker.position));


    var info = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">' + this.sitios[this.contadorSitios].titulo + '</h1>' +
        '<div id="bodyContent">' +
        "<p> " + this.sitios[this.contadorSitios].desc + "</p>" +
        "<p> Distancia: " + dist + " metros</p>" +
        "<p> Puntuacion: " + this.puntuacion(dist) + "</p>" +
        '</div>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: info
    });

    infowindow.open(this.map, this.markerPosReal);

    this.puntuacionTotal = this.puntuacionTotal + this.puntuacion(dist);
    document.getElementById('area1').innerHTML = this.puntuacionTotal + " Puntos Totales";

    document.getElementById('area2').innerHTML = this.puntuacion(dist) + " Puntos Parciales";

    var polyOptions = {
        strokeColor: '#FFFF00',
        strokeOpacity: 1.0,
        strokeWeight: 10
    };

    this.poly = new google.maps.Polyline(polyOptions);
    this.poly.setMap(map);
    path = poly.getPath();
    path.push(sitios[this.contadorSitios].coordenadas);
    path.push(marker.position);

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


