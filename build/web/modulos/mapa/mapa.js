let map;
let marker;

function initMap() {
    // Crear el mapa con una vista inicial en Guadalajara, por ejemplo
    map = L.map('map').setView([20.659698, -103.349609], 13); // Coordenadas iniciales

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Crear un marcador en la ubicación inicial
    marker = L.marker([20.659698, -103.349609], { draggable: true }).addTo(map);

    // Evento para capturar las coordenadas al hacer clic en el mapa
    map.on('click', function (e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        // Mover el marcador a la posición seleccionada
        marker.setLatLng([lat, lng]);

        // Actualizar los campos de latitud y longitud
        document.getElementById('latitud').value = lat.toFixed(6);
        document.getElementById('longitud').value = lng.toFixed(6);
    });

    // Evento para actualizar los campos al mover el marcador
    marker.on('move', function (e) {
        const lat = marker.getLatLng().lat;
        const lng = marker.getLatLng().lng;

        // Actualizar los campos de latitud y longitud
        document.getElementById('latitud').value = lat.toFixed(6);
        document.getElementById('longitud').value = lng.toFixed(6);
    });
}

// Inicializar el mapa cuando la página cargue
window.onload = function() {
    initMap();
};
