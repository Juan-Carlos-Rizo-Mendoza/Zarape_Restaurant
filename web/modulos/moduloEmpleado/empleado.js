let datos = {};
let datosA = {};
let empleado = [];
let ciudades = [];
let estado = [];
let sucursales = [];

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Cargar elementos para la tabla y crear la tabla de empleados

async function cargarElementos() {
    if(localStorage.getItem("token") !== null){
    const v_ciudades = await fetch('http://localhost:8080/elzarape/api/ciudad/getAll');
    const v_sucursales = await fetch('http://localhost:8080/elzarape/api/sucursal/getAll');
    const v_estado = await fetch('http://localhost:8080/elzarape/api/estado/getAll');

    estado = await v_estado.json();
    ciudades = await v_ciudades.json();
    sucursales = await v_sucursales.json();


    fetch('http://localhost:8080/elzarape/api/empleado/getAllEmpleado')
            .then(response => response.json())
            .then(datos => {
                console.log(datos);
                empleado = datos;
                loadTable();
            });
    }else{
        window.alert("Error no hay un usuario activo");
    }
}
cargarElementos();

function buscarEstado(v_idEstado) {
    for (let i = 0; i < estado.length; i++) {
        if (estado[i].idEstado === v_idEstado) {
            return estado[i].nombre;
        }
    }
}

function buscarCiudad(v_idCiudad) {
    for (let i = 0; i < ciudades.length; i++) {
        if (ciudades[i].idCiudad === v_idCiudad) {
            return ciudades[i].nombre;
        }
    }
}

function buscarSucursal(v_idSucursal) {
    for (let i = 0; i < sucursales.length; i++) {
        if (sucursales[i].idSucursal === v_idSucursal) {
            return sucursales[i].nombre;
        }
    }
}

function loadTable() {
    let tablaActivos = document.getElementById("tablaEmpleadoActivos");
    let tablaInactivos = document.getElementById("tablaEmpleadoInactivos");
    let renglonActivos = "";
    let renglonInactivos = "";

    empleado.forEach((registro, index) => {
        let ciudad = buscarCiudad(registro.persona.ciudad.idCiudad);
        let sucursal = buscarSucursal(registro.sucursal.idSucursal);

        let renglon = `<tr>
            <td>${registro.persona.nombre}</td>
            <td>${registro.persona.apellidos}</td>
            <td>${registro.persona.telefono}</td>
            <td>${ciudad}</td>
            <td>${sucursal}</td>
            <td>${registro.usuario.nombre}</td>
            <td>${registro.usuario.contrasenia}</td>
        </tr>`;

        let tr = document.createElement('tr');
        tr.innerHTML = renglon;

        // Añadir un event listener para manejar el clic en la fila
        tr.addEventListener('click', function () {
            selectRegistro(index);  // Llama a selectRegistro pasando el índice
        });

        // Agregar la fila a la tabla dependiendo del estado del empleado
        if (registro.activo === 1) {
            tablaActivos.appendChild(tr);
        } else if (registro.activo === 0) {
            tablaInactivos.appendChild(tr);
        }
    });
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Funcionalidad de agregar empleado

export function agregarEmpleados() {
    if(localStorage.getItem("token") !== null){
        
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudades = document.getElementById("ciudades").value;
    let v_usuario = document.getElementById("usuario").value;
    let v_contrasenia = document.getElementById("contrasenia").value;
    let v_sucursal = document.getElementById("sucursales").value;

    // Verificar si alguno de los valores es nulo
    if (!v_nombre || !v_apellidos || !v_telefono || !v_ciudades || !v_usuario || !v_contrasenia || !v_sucursal) {
        alert("El formulario no está completo. Por favor, rellena todos los campos.");
        return; // Salir de la función si falta algún campo
    }

    datos = {
        empleado: {
            idEmpleado: v_id
        },
        persona: {
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: parseInt(v_ciudades)
            }
        },
        usuario: {
            nombre: v_usuario,
            contrasenia: v_contrasenia
        },
        sucursal: {
            idSucursal: parseInt(v_sucursal)
        }
    };

    // Enviar los datos al servidor
    enviarDatos().then(() => {
        limpiarInputs(); // Limpiar los campos del formulario después de agregar
        cargarElementos(); // Recargar la tabla automáticamente
    });
    }else{
        window.alert("Error no hay un usuario activo");
    }
}

// Función para enviar los datos al servidor para agregar un empleado
function enviarDatos() {
    let datos_servidor = {datosEmpleado: JSON.stringify(datos)};
    let parametro = new URLSearchParams(datos_servidor);
    let registro = {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body: parametro
    };

    return fetch('http://localhost:8080/elzarape/api/empleado/agregarEmpleado', registro)
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.error("Error en la solicitud: ", error));
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------

export function actualizarEmpleados() {    
    if(localStorage.getItem("token") !== null){
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudades = document.getElementById("ciudades").value;
    let v_usuario = document.getElementById("usuario").value;
    let v_contrasenia = document.getElementById("contrasenia").value;
    let v_sucursal = document.getElementById("sucursales").value;

    // Verificar si alguno de los valores es nulo
    if (!v_nombre || !v_apellidos || !v_telefono || !v_ciudades || !v_usuario || !v_contrasenia || !v_sucursal) {
        alert("El formulario no está completo. Por favor, rellena todos los campos.");
        return; // Salir de la función si falta algún campo
    }

    datosA = {
        idEmpleado: parseInt(v_id),
        persona: {
            idPersona: parseInt(v_id),
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: parseInt(v_ciudades)
            }
        },
        usuario: {
            nombre: v_usuario,
            contrasenia: v_contrasenia,
            idUsuario: parseInt(v_id)
        },
        sucursal: {
            idSucursal: parseInt(v_sucursal)
        }
    };

    // Enviar los datos al servidor
    actualizarDatos().then(() => {
        limpiarInputs(); // Limpiar los campos del formulario después de actualizar
        cargarElementos(); // Recargar la tabla automáticamente
    });
    }else{
        window.alert("Error no hay un usuario activo");
    }
}

// Función para actualizar los datos en el servidor
function actualizarDatos() {
    let datos_servidor = {datosEmpleado: JSON.stringify(datosA)};
    let parametro = new URLSearchParams(datos_servidor);
    let registro = {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body: parametro
    };

    return fetch('http://localhost:8080/elzarape/api/empleado/actualizarEmpleado', registro)
        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.error("Error en la solicitud: ", error));
}


//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Función para seleccionar un registro de la tabla

function selectRegistro(indice) {
    if (indice >= 0 && indice < empleado.length) {
        // Asignar valores a los inputs
        document.getElementById("nombre").value = empleado[indice].persona.nombre;
        document.getElementById("apellidos").value = empleado[indice].persona.apellidos;
        document.getElementById("telefono").value = empleado[indice].persona.telefono;
        document.getElementById("usuario").value = empleado[indice].usuario.nombre;
        document.getElementById("contrasenia").value = empleado[indice].usuario.contrasenia;
        document.getElementById("id").value = empleado[indice].idEmpleado;
    }
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Funcionalidad para eliminar un empleado
export function eliminarEmpleado() {
    if(localStorage.getItem("token") !== null || localStorage.getItem("usuario") !== null){
    let v_id = document.getElementById("id").value;
    datosE = {
        idEmpleado: v_id
    };

    // Enviar los datos al servidor para eliminar el empleado
    enviarDatosEliminar().then(() => {
        limpiarInputs(); // Limpiar los campos del formulario después de eliminar
        cargarElementos(); // Recargar la tabla automáticamente
    });
    }else{
        window.alert("Error no hay un usuario activo");
    }
}

function enviarDatosEliminar() {
    let v_id = document.getElementById("id").value;

    // Crear un objeto URLSearchParams con el ID del empleado
    let datos_servidor = new URLSearchParams({
        idEmpleado: v_id
    });

    // Configurar la solicitud
    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: datos_servidor.toString()
    };

    return fetch('http://localhost:8080/elzarape/api/empleado/eliminar', registro)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(json => console.log(json))
        .catch(error => console.error("Error en la solicitud: ", error));
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------
// Función para limpiar los inputs del formulario

export function limpiarInputs() {
    // Limpiar todos los inputs
    const inputs = document.querySelectorAll("#nombre, #apellidos, #telefono, #ciudades, #estados, #usuario, #contrasenia, #sucursal, #id");
    inputs.forEach(input => {
        input.value = ''; // Asigna un valor vacío a cada input
    });
}

function probarScript() {
    alert("prueba");
}