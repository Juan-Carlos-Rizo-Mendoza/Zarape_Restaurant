let listCliente = [];

fetch('http://localhost:8080/elzarape/api/cliente/getAllClientes')//Ruta de donde se van a sacar los datos
        .then(response => response.json())//La respuesta te la de en json
        .then(datos => {
            console.log(datos);
            listCliente = datos;
            cargarTablaClientes();
        });

function cargarTablaClientes() {
    let tablaActivos = document.getElementById("tablaClientesActivos");
    let tablaInactivos = document.getElementById("tablaClientesInactivos");

    // Limpiar tablas antes de cargar los nuevos datos
    tablaActivos.innerHTML = '';
    tablaInactivos.innerHTML = '';

    // Iterar sobre la lista de clientes y crear las filas dinámicamente
    listCliente.forEach((cliente, index) => {
        // Crear una nueva fila
        let fila = document.createElement('tr');
        
        // Asignar un atributo data-idCliente para facilitar el acceso desde la función seleccionarCliente
        fila.dataset.idCliente = cliente.idCliente; 

        // Crear celdas para cada dato y añadirlas a la fila
        let celdaNombre = document.createElement('td');
        celdaNombre.textContent = cliente.persona.nombre;
        let celdaApellidos = document.createElement('td');
        celdaApellidos.textContent = cliente.persona.apellidos;
        let celdaTelefono = document.createElement('td');
        celdaTelefono.textContent = cliente.persona.telefono;
        let celdaCiudad = document.createElement('td');
        celdaCiudad.textContent = cliente.persona.ciudad.nombre;
        let celdaUsuario = document.createElement('td');
        celdaUsuario.textContent = cliente.usuario.nombre;
        let celdaContrasenia = document.createElement('td');
        celdaContrasenia.textContent = cliente.usuario.contrasenia;

        // Añadir las celdas a la fila
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaApellidos);
        fila.appendChild(celdaTelefono);
        fila.appendChild(celdaCiudad);
        fila.appendChild(celdaUsuario);
        fila.appendChild(celdaContrasenia);

        // Asignar un evento de clic a la fila para seleccionar el cliente
        fila.addEventListener('click', () => selectCliente(index));

        // Añadir la fila a la tabla correspondiente (activa o inactiva)
        if (cliente.activo === 1) {
            tablaActivos.appendChild(fila);
        } else if (cliente.activo === 0) {
            tablaInactivos.appendChild(fila);
        }
    });
}


function selectCliente(indice) {
    if (indice >= 0 && indice < listCliente.length) {
        // Asignar valores a los inputs correspondientes con los datos del cliente
        document.getElementById("nombre").value = listCliente[indice].persona.nombre;
        document.getElementById("apellidos").value = listCliente[indice].persona.apellidos;
        document.getElementById("telefono").value = listCliente[indice].persona.telefono;
        document.getElementById("ciudades").value = listCliente[indice].persona.ciudad.nombre;
        document.getElementById("nombreUsu").value = listCliente[indice].usuario.nombre;
        document.getElementById("contrasenia").value = listCliente[indice].usuario.contrasenia;
        document.getElementById("idCliente").value = listCliente[indice].idCliente;  // Asignamos el idCliente
    }
}


export function agregar() {
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_nombreUsu = document.getElementById("nombreUsu").value;
    let v_contrasenia = document.getElementById("contrasenia").value;

    let cliente = {
        persona: {
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad
            }
        },
        usuario: {
            nombre: v_nombreUsu,
            contrasenia: v_contrasenia
        }
    };

    let datos_servidor = {"datosCliente": JSON.stringify(cliente)};
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: parametro
    };

    fetch('http://localhost:8080/el-zarape/api/cliente/agregar', registro)
            .then(response => response.json())
            .then(json => console.log(json));
}

export function actualizar() {
    let v_idCliente = document.getElementById("idCliente").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_apellidos = document.getElementById("apellidos").value;
    let v_telefono = document.getElementById("telefono").value;
    let v_ciudad = document.getElementById("ciudades").value;
    let v_nombreUsu = document.getElementById("nombreUsu").value;
    let v_contrasenia = document.getElementById("contrasenia").value;

    let cliente = {
        idCliente: v_idCliente,
        persona: {
            nombre: v_nombre,
            apellidos: v_apellidos,
            telefono: v_telefono,
            ciudad: {
                idCiudad: v_ciudad
            }
        },
        usuario: {
            nombre: v_nombreUsu,
            contrasenia: v_contrasenia
        }
    };

    let datos_servidor = {"datosCliente": JSON.stringify(cliente)};
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: parametro
    };

    fetch('http://localhost:8080/el-zarape/api/cliente/actualizar', registro)
            .then(response => response.json())
            .then(json => console.log(json));
}

async function eliminar() {
    try {
        const v_idCliente = parseInt(document.getElementById("idCliente").value);

        const parametros = new URLSearchParams();
        parametros.append('idCliente', v_idCliente);

        const registro = {
            method: "POST",
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: parametros.toString()
        };

        const response = await fetch('http://localhost:8080/el-zarape/api/cliente/eliminar', registro);

        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        cargarCliente();
    } catch (error) {
        console.error('Error:', error);
        alert(`Hubo un problema al eliminar el cliente. Error: ${error.message}`);
    }
}

export function limpiar() {
    let v_nombre = document.getElementById("nombre");
    v_nombre.value = "";
    let v_apellidos = document.getElementById("apellidos");
    v_apellidos.value = "";
    let v_telefono = document.getElementById("telefono");
    v_telefono.value = "";
    let v_ciudades = document.getElementById("ciudades");
    v_ciudades.value = "";
    let v_estados = document.getElementById("estados");
    v_estados.value = "";
    let v_usuario = document.getElementById("nombreUsu");
    v_usuario.value = "";
    let v_contrasenia = document.getElementById("contrasenia");
    v_contrasenia.value = "";
    let v_sucursal = document.getElementById("sucursal");
    v_sucursal.value = "";
    let v_id = document.getElementById("idCliente");
    v_id.value = "";
}