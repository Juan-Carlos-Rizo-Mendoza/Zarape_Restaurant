// Función para regresar a la página anterior
function regresar() {
    window.location.href = "menu.html";
}

// Declaración de variables
let nip;

// Función para obtener la información del alumno desde el backend
function obtenerTarjeta() {
    fetch('http://localhost:8080/elzarape/api/mc522/getAll')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                console.log("Correcto");
                return response.json();  // Parseamos el JSON que nos devuelve el backend
            })
            .then(datos => {
                if (datos.error) {
                    alert(datos.error);  // Si hay error, mostramos el mensaje
                } else {
                    nip = datos;  // Almacenamos la información del alumno
                    mostrarNIP();  // Llamamos a la función que muestra los datos
                }
            })
            .catch(error => {
                console.error('Error:', error);
                console.log("Hubo un problema al cargar la información de la tarjeta. Intente nuevamente.");
            });
}

// Función para mostrar la información del alumno en la página web
function mostrarNIP() {
    console.log(nip);
    // Puedes agregar el código aquí para mostrar los datos en la página si es necesario
}

// Función que inicia el proceso de escanear el RFID
async function iniciarEscaneo() {
    try {
        // Solicitar conexión con el puerto serial
        const port = await navigator.serial.requestPort();
        await port.open({baudRate: 9600});

        // Crear un lector de flujo para leer datos del puerto serial
        const reader = port.readable.getReader();

        console.log('Esperando datos RFID...');
        let v_titulo = document.getElementById("titulo");
        v_titulo.textContent = "Escanea tu tarjeta";
        let decoder = new TextDecoder();

        // Leer datos del puerto serial
        while (true) {
            const {value, done} = await reader.read();
            if (done) {
                break;
            }

            // Convertir los bytes leídos en un string
            const rfidData = decoder.decode(value).trim();

            // Mostrar el UID de la tarjeta RFID en la consola
            console.log('Datos RFID:', rfidData);

            // Aquí puedes agregar el proceso adicional que necesites, por ejemplo:
            // Llamar a una función que envíe el NIP o información a tu servidor
            nip = rfidData;  // Asignar el UID a la variable nip
            mostrarNIP();  // Mostrarlo en la página (si es necesario)

            break;  // Terminar la lectura después de obtener el primer UID
        }

        // Cerrar el puerto después de terminar la lectura
        await reader.releaseLock();
        await port.close();

    } catch (err) {
        console.error('Error al conectar o leer el puerto serial:', err);
    }
    modificarTitulo();
}

function modificarTitulo() {
    if (nip !== null) {
        let v_titulo = document.getElementById("titulo");
        v_titulo.textContent = "Ingresa tu NIP";
    }

}

function comprobar(){
    let v_nip = document.getElementById("nip").value;   
    if(nip !== v_nip){
        window.alert("NIP incorrecto, vuelva a intentar");
        v_nip.textContent = "";
    }else{
        window.alert("Gracias por su compra, reciba su pedido en el mostrador");
        window.location.href = "../pedido.html";
        enviarTicket();
    }
}

function enviarTicket() {
    // Recuperamos los datos del localStorage
    let datos_servidor = JSON.parse(localStorage.getItem("ticket"));

    if (!datos_servidor) {
        alert("No hay datos guardados en el localStorage.");
        return;
    }

    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: parametro
    };

    // Realizamos la solicitud al servicio
    fetch('http://localhost:8080/elzarape/api/tickets/agregar', registro)
        .then(response => response.json())
        .then(json => {
            console.log("Respuesta del servicio:", json);

            // Limpiar el carrito (tabla)
            let tabla = document.getElementById("renglonProducto");
            tabla.innerHTML = "";
        })
        .catch(error => {
            console.error('Error al enviar los datos:', error);
        });
}


function cancelarTarjeta(){
    window.location.href = "../pedido.html";
}
