let listSucursal = []; // Lista de sucursales para manejar los datos.

// Función para cargar las sucursales en la tabla
const loadSucursal = () => {
    let renglonActivos = "";  // Filas para las sucursales activas.
    let renglonInactivos = ""; // Filas para las sucursales inactivas.
    const tablaActiva = document.getElementById("detalleSucursal");
    const tablaInactiva = document.getElementById("detalleSucursalInactivo");

    // Revisa si hay sucursales para mostrar.
    if (listSucursal.length === 0) {
        tablaActiva.innerHTML = "<tr><td colspan='9'>No hay datos disponibles.</td></tr>"; 
        tablaInactiva.innerHTML = "<tr><td colspan='9'>No hay datos disponibles.</td></tr>"; 
        return;
    }

    // Recorre la lista de sucursales y genera las filas de la tabla correspondiente.
    listSucursal.forEach(sucursal => {
        const row = `
            <tr data-id="${sucursal.idSucursal}">
                <td>${sucursal.idSucursal}</td> <!-- Agrega la columna para mostrar el idSucursal -->
                <td>${sucursal.nombre}</td>
                <td>${sucursal.latitud}</td>
                <td>${sucursal.longitud}</td>
                <td><img src="data:image/jpeg;base64,${sucursal.foto}" alt="Foto" style="max-width: 100px;"></td>
                <td><a href="${sucursal.urlWeb}" target="_blank">${sucursal.urlWeb}</a></td>
                <td>${sucursal.horarios}</td>
                <td>${sucursal.numCalle}</td>
                <td>${sucursal.colonia}</td>
            </tr>`;

        // Verifica el estado de la sucursal (activo o inactivo)
        if (sucursal.activo === 0) {
            renglonInactivos += row; // Si está inactiva, agrégala a la tabla de inactivos
        } else {
            renglonActivos += row; // Si está activa, agrégala a la tabla de activas
        }
    });

    // Inserta las filas generadas en las tablas correspondientes
    tablaActiva.innerHTML = renglonActivos || "<tr><td colspan='9'>No hay sucursales activas.</td></tr>";
    tablaInactiva.innerHTML = renglonInactivos || "<tr><td colspan='9'>No hay sucursales inactivas.</td></tr>";

    // Ahora asignamos el evento de clic a cada fila de la tabla
    // Agregar eventos de clic para cada fila de ambas tablas
    const filasActivas = tablaActiva.querySelectorAll('tr[data-id]');
    const filasInactivas = tablaInactiva.querySelectorAll('tr[data-id]');

    filasActivas.forEach(fila => {
        fila.addEventListener('click', () => seleccionarSucursal(fila));
    });

    filasInactivas.forEach(fila => {
        fila.addEventListener('click', () => seleccionarSucursal(fila));
    });
};


// Función para obtener las sucursales desde la API
const obtenerSucursal = () => {
    fetch("http://localhost:8080/elzarape/api/sucursal/getAll")
            .then(response => response.json())
            .then(registros => {
                listSucursal = registros; // Asigna las sucursales obtenidas.
                console.log(listSucursal);
                loadSucursal(); // Llama a la función para cargar las sucursales en la tabla.
            })
            .catch(error => console.error("Error al obtener las sucursales:", error));
};

// Función para seleccionar una sucursal y mostrar sus datos en el formulario
function seleccionarSucursal(fila) {
    const idSucursal = fila.getAttribute('data-id'); // Obtiene el id de la fila seleccionada
    const sucursalSeleccionada = listSucursal.find(sucursal => sucursal.idSucursal === parseInt(idSucursal));

    // Muestra los datos en los campos del formulario
    if (sucursalSeleccionada) {
        document.getElementById('idSucursal').value = sucursalSeleccionada.idSucursal; // Muestra el id
        document.getElementById('nombre').value = sucursalSeleccionada.nombre;
        document.getElementById('latitud').value = sucursalSeleccionada.latitud;
        document.getElementById('longitud').value = sucursalSeleccionada.longitud;
        document.getElementById('txaFoto').value = sucursalSeleccionada.foto;
        document.getElementById('urlWeb').value = sucursalSeleccionada.urlWeb;
        document.getElementById('horarios').value = sucursalSeleccionada.horarios;
        document.getElementById('calle').value = sucursalSeleccionada.calle;
        document.getElementById('numCalle').value = sucursalSeleccionada.numCalle;
        document.getElementById('colonia').value = sucursalSeleccionada.colonia;

        // Verificamos si la propiedad 'ciudad' existe y es un objeto con 'idCiudad'
        if (sucursalSeleccionada.ciudad && typeof sucursalSeleccionada.ciudad === 'object' && 'idCiudad' in sucursalSeleccionada.ciudad) {
            document.getElementById('ciudades').value = sucursalSeleccionada.ciudad.idCiudad;
        } else {
            console.warn("Ciudad no disponible o mal formada.");
            document.getElementById('ciudades').value = ''; // O establece un valor predeterminado si es necesario
        }

        // Si es necesario, también puedes mostrar la foto en una vista previa
        const imgPreview = document.getElementById("imgFoto");
        imgPreview.src = "data:image/jpeg;base64," + sucursalSeleccionada.foto;
    }
}

// Función para cargar la fotografía de la sucursal
function cargarFotografia(evt) {
    const inputFileFotoSucursal = evt.target;
    const imgPreview = document.getElementById("imgFoto");
    const txaFoto = document.getElementById("txaFoto");

    if (inputFileFotoSucursal.files && inputFileFotoSucursal.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const fotoB64 = e.target.result;
            imgPreview.src = fotoB64; // Muestra la imagen en la etiqueta <img>
            txaFoto.value = fotoB64.split(",")[1]; // Asigna el texto en base64 sin el prefijo
        };
        reader.readAsDataURL(inputFileFotoSucursal.files[0]);
    }
}

// Configura el evento para cargar la foto cuando se selecciona un archivo
document.getElementById("inputFileFotoSucursal").addEventListener("change", cargarFotografia);

// Botón para abrir el selector de archivos
document.getElementById("btnCargarFoto").addEventListener("click", () => {
    document.getElementById("inputFileFotoSucursal").click();
});

// Función para eliminar una sucursal (eliminación lógica)
function eliminarSucursal() {
    const idSucursal = document.getElementById('idSucursal').value; // Obtiene el id de la sucursal

    fetch('http://localhost:8080/elzarape/api/sucursal/eliminar', {
        method: 'POST', // Usamos POST para la eliminación lógica
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            idSucursal: idSucursal, // Enviamos el id de la sucursal
            activo: '0' // Establecemos el campo 'activo' a 0 (inactivo)
        })
    })
            .then(response => {
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(res => {
                console.log("Sucursal eliminada (lógicamente):", res);
                obtenerSucursal(); // Vuelve a cargar las sucursales después de la eliminación lógica.
            })
            .catch(err => console.error("Error al eliminar la sucursal:", err));
}
// Función para agregar una nueva sucursal
function agregarSucursal() {
    const nuevaSucursal = {
        nombre: document.getElementById('nombre').value,
        latitud: document.getElementById('latitud').value,
        longitud: document.getElementById('longitud').value,
        foto: document.getElementById('txaFoto').value,
        urlWeb: document.getElementById('urlWeb').value,
        horarios: document.getElementById('horarios').value,
        calle: document.getElementById('calle').value,
        numCalle: document.getElementById('numCalle').value,
        colonia: document.getElementById('colonia').value,
        activo: 1,
        ciudad: {
            idCiudad: document.getElementById('ciudades').value
        }
    };

    fetch("http://localhost:8080/elzarape/api/sucursal/agregar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(nuevaSucursal)
    })
            .then(response => {
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(res => {
                console.log("Sucursal agregada exitosamente:", res);
                obtenerSucursal(); // Recarga la lista de sucursales.
                limpiarFormulario(); // Limpia el formulario.
            })
            .catch(err => console.error("Error al agregar la sucursal:", err));
}

// Función para actualizar una sucursal existente
function actualizarSucursal() {
    const idSucursal = document.getElementById('idSucursal').value;
    const sucursalActualizada = {
        idSucursal: idSucursal,
        nombre: document.getElementById('nombre').value,
        latitud: document.getElementById('latitud').value,
        longitud: document.getElementById('longitud').value,
        foto: document.getElementById('txaFoto').value,
        urlWeb: document.getElementById('urlWeb').value,
        horarios: document.getElementById('horarios').value,
        calle: document.getElementById('calle').value,
        numCalle: document.getElementById('numCalle').value,
        colonia: document.getElementById('colonia').value,
        activo: 1,
        ciudad: {
            idCiudad: document.getElementById('ciudades').value
        }
    };

    fetch("http://localhost:8080/elzarape/api/sucursal/actualizar", {
        method: "POST", // Usamos POST en lugar de PUT
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(sucursalActualizada)
    })
            .then(response => {
                if (!response.ok)
                    throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(res => {
                console.log("Sucursal actualizada exitosamente:", res);
                obtenerSucursal(); // Recarga la lista de sucursales.
                limpiarFormulario(); // Limpia el formulario.
            })
            .catch(err => console.error("Error al actualizar la sucursal:", err));
}

// Función para limpiar el formulario después de agregar o actualizar
function limpiarFormulario() {
    document.getElementById('idSucursal').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('latitud').value = '';
    document.getElementById('longitud').value = '';
    document.getElementById('txaFoto').value = '';
    document.getElementById('urlWeb').value = '';
    document.getElementById('horarios').value = '';
    document.getElementById('calle').value = '';
    document.getElementById('numCalle').value = '';
    document.getElementById('colonia').value = '';
    document.getElementById('ciudades').value = '';
    const imgPreview = document.getElementById("imgFoto");
    imgPreview.src = '';
}

obtenerSucursal();
cargarCiudad();
cargarEstado();

function avisarAlerta(){
    console.log("prueba");
}