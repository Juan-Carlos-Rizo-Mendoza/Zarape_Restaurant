let datos = {};

export async function logIn() {
    // Obtener los valores de usuario y contraseña
    let v_nombre = document.getElementById("usuario").value;
    let v_contrasenia = document.getElementById("contrasenia").value;

    // Validar que los campos no estén vacíos
    if (!v_nombre || !v_contrasenia) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Crear el objeto de datos
    const datos = {
        nombre: v_nombre,
        contrasenia: v_contrasenia
    };

    try {
        // Paso 1: Crear el token y guardarlo en localStorage
        await crearToken(datos.nombre);

        // Paso 2: Enviar los datos de inicio de sesión al servidor
        await enviarDatos(datos);

        if (v_nombre == "Ventas" && v_contrasenia == "mostrador") {
            window.location.href = "modulos/moduloPedido/pedido.html";
        } else {
            window.location.href = 'bienvenida.html';
            window.alert("Bienvenido " + localStorage.getItem("usuario"));
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error.message);
        alert("Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.");
    }
}

// Función para crear el token
async function crearToken(nombreUsuario) {
    // Validar que el campo de usuario no esté vacío
    if (!nombreUsuario) {
        throw new Error('El campo de usuario está vacío.');
    }

    // URL del servicio REST
    const url = `http://localhost:8080/elzarape/api/login/checkingUser?nombre=${encodeURIComponent(nombreUsuario)}`;

    // Realizar la solicitud GET al servicio REST
    const response = await fetch(url, {method: 'GET'});
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    const token = await response.json();

    // Guardar el token y el nombre de usuario en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', nombreUsuario);

    console.log('Token recibido:', token);
    console.log('Usuario guardado:', nombreUsuario);
}

// Función para enviar los datos de inicio de sesión
async function enviarDatos(datos) {
    const datos_servidor = {datosUsuario: JSON.stringify(datos)};
    const parametro = new URLSearchParams(datos_servidor);

    const registro = {
        method: "POST",
        headers: {"content-type": "application/x-www-form-urlencoded"},
        body: parametro.toString()
    };

    const response = await fetch("http://localhost:8080/elzarape/api/usuario/login", registro);
    const json = await response.json();

    if (json.message !== "Usuario autenticado") {
        throw new Error("Usuario o contraseña incorrectos");
    }

    console.log("Usuario autenticado correctamente.");
}