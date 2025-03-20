let listBebidas = [];
const IVA = 0.16;

fetch('http://localhost:8080/elzarape/api/bebidas/getAll')
        .then(response => response.json())
        .then(datos => {
            listBebidas = datos;
            console.log("Lista de bebidas:", listBebidas);
            cargarBebidas();
        });

function cargarBebidas() {
    let cuerpo = "";
    listBebidas.forEach(bebida => {
        if (bebida.producto.activo == 1) {
            cuerpo += `
                <div>
                    <h5>${bebida.producto.nombre}</h5>
                    <img alt="${bebida.producto.nombre}" src="data:image/jpeg;base64,${bebida.producto.foto}" data-foto="${bebida.producto.foto}" style="max-width: 150px;"/><br>
                    <p>Categoría: ${bebida.producto.categoria.nombre}</p>
                    <p>Precio: $${bebida.producto.precio.toFixed(2)}</p>
                    <button id="btnAnadir" onclick="sumar('${bebida.producto.nombre}', ${bebida.producto.precio}, ${bebida.producto.idProducto})"><strong>+</strong></button>
                    <button id="btnRestar" onclick="restar('${bebida.producto.nombre}', ${bebida.producto.idProducto})"><strong>-</strong></button>
                </div>
            `;
        }
    });
    document.getElementById('bebidasContainer').innerHTML = cuerpo;
}

function sumar(nombre, precio, idProducto) {
    let tabla = document.getElementById("renglonProducto");
    let filas = tabla.rows;
    let productoExistente = false;

    console.log(idProducto);

    for (let i = 0; i < filas.length; i++) {
        let celdaNombre = filas[i].cells[0].innerText;
        let celdaId = filas[i].cells[4].innerText;
        if (celdaNombre === nombre) {
            let celdaCantidad = filas[i].cells[2];
            let celdaImporte = filas[i].cells[3];

            let cantidadActual = parseInt(celdaCantidad.innerText);
            let nuevaCantidad = cantidadActual + 1;
            celdaCantidad.innerText = nuevaCantidad;

            let nuevoImporte = precio * nuevaCantidad;
            celdaImporte.innerText = `$${nuevoImporte.toFixed(2)}`;

            productoExistente = true;
            break;
        }
    }

    if (!productoExistente) {
        let nuevaFila = tabla.insertRow();
        let celdaNombre = nuevaFila.insertCell(0);
        let celdaPrecio = nuevaFila.insertCell(1);
        let celdaCantidad = nuevaFila.insertCell(2);
        let celdaImporte = nuevaFila.insertCell(3);
        let celdaId = nuevaFila.insertCell(4);

        celdaNombre.innerHTML = nombre;
        celdaPrecio.innerHTML = `$${precio.toFixed(2)}`;
        celdaCantidad.innerHTML = "1";
        celdaImporte.innerHTML = `$${precio.toFixed(2)}`;
        celdaId.innerHTML = idProducto;
        celdaId.style.display = 'none';
    }
    calcularTotales();
}

function restar(nombre, idProducto) {
    let tabla = document.getElementById("renglonProducto");
    let filas = tabla.rows;

    for (let i = 0; i < filas.length; i++) {
        let celdaNombre = filas[i].cells[0].innerText;
        let celdaId = filas[i].cells[4].innerText;
        if (celdaNombre === nombre && celdaId == idProducto) {
            let celdaCantidad = filas[i].cells[2];
            let celdaImporte = filas[i].cells[3];

            let cantidadActual = parseInt(celdaCantidad.innerText);
            if (cantidadActual > 1) {
                let nuevaCantidad = cantidadActual - 1;
                celdaCantidad.innerText = nuevaCantidad;

                let precio = parseFloat(filas[i].cells[1].innerText.replace('$', ''));
                let nuevoImporte = precio * nuevaCantidad;
                celdaImporte.innerText = `$${nuevoImporte.toFixed(2)}`;
            } else {
                tabla.deleteRow(i);
            }
            break;
        }
    }
    calcularTotales();
}

function calcularTotales() {
    let tabla = document.getElementById("renglonProducto");
    let filas = tabla.rows;
    let subtotal = 0;

    for (let i = 0; i < filas.length; i++) {
        let celdaImporte = filas[i].cells[3];
        let importe = parseFloat(celdaImporte.innerText.replace('$', ''));
        subtotal += importe;
    }

    let iva = subtotal * IVA;
    let total = subtotal + iva;

    document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById("iva").innerText = `$${iva.toFixed(2)}`;
    document.getElementById("total").innerText = `$${total.toFixed(2)}`;
}

function generarTicket() {
    let tabla = document.getElementById("renglonProducto");
    let filas = tabla.rows;
    let json = [];

    if (filas.length == 0) {
        alert("No has puesto ningún producto en el carrito");
    } else {
        for (var i = 0; i < filas.length; i++) {
            let id = parseInt(filas[i].cells[4].innerText);
            let v_cantidad = parseInt(filas[i].cells[2].innerText);
            json.push({idProducto: id, cantidad: v_cantidad});
        }

        // Convertimos el arreglo JSON a una cadena
        let jsonDetalles = JSON.stringify(json);

        let datos_servidor = {
            "idCliente": 1,
            "idSucursal": 1,
            "ticket": "S",
            "pagado": "S",
            "jsonDetalles": jsonDetalles
        };

        // Almacenamos los datos en localStorage como cadena JSON
        localStorage.setItem("ticket", JSON.stringify(datos_servidor));

        console.log("Datos guardados en localStorage:", localStorage.getItem("ticket"));
        pago();
    }
    
}


function clean(){
    // Seleccionar el párrafo por su ID
let v_subtotal = document.getElementById("subtotal");

// Cambiar el texto
v_subtotal.textContent = "$0.00";
}

let listAlimentos = [];

fetch('http://localhost:8080/elzarape/api/alimento/getAll')
        .then(response => response.json())
        .then(datos => {
            listAlimentos = datos;
            console.log("Lista de alimentos:", listAlimentos);
            cargarAlimentos();
        });

function cargarAlimentos() {
    let cuerpo = "";
    listAlimentos.forEach(alimento => {
        if (alimento.producto.activo == 1) {
            cuerpo += `
                <div>
                    <h5>${alimento.producto.nombre}</h5>
                    <img alt="${alimento.producto.nombre}" src="data:image/jpeg;base64,${alimento.producto.foto}" data-foto="${alimento.producto.foto}" style="max-width: 150px;"/><br>
                    <p>Categoría: ${alimento.producto.categoria.nombre}</p>
                    <p>Precio: $${alimento.producto.precio.toFixed(2)}</p>
                    <button id="btnAnadir" onclick="sumar('${alimento.producto.nombre}', ${alimento.producto.precio}, ${alimento.producto.idProducto})"><strong>+</strong></button>
                    <button id="btnRestar" onclick="restar('${alimento.producto.nombre}', ${alimento.producto.idProducto})"><strong>-</strong></button>
                </div>
            `;
        }
    });
    document.getElementById('alimentosContainer').innerHTML = cuerpo;
}


function pago(){
    window.location.href = "pago.html";
}

function volver(){
    window.location.href = "../pedido.html";
}

function cancelarPedido() {
    // Limpiar la tabla de productos
    let tabla = document.getElementById("renglonProducto");
    tabla.innerHTML = "";

    // Restablecer los valores de subtotal, IVA y total
    document.getElementById("subtotal").innerText = "$0.00";
    document.getElementById("iva").innerText = "$0.00";
    document.getElementById("total").innerText = "$0.00";
}


// Función para cargar el ticket desde localStorage
function cargarTicketDesdeLocalStorage() {
    // Obtener los datos del localStorage
    const ticketGuardado = localStorage.getItem("ticket");

    if (ticketGuardado) {
        try {
            // Parsear los datos JSON
            const ticket = JSON.parse(ticketGuardado);

            // Verificar si hay detalles en el ticket
            if (ticket.jsonDetalles && ticket.jsonDetalles.length > 0) {
                const detalles = JSON.parse(ticket.jsonDetalles);

                // Limpiar la tabla antes de cargar los datos
                let tabla = document.getElementById("renglonProducto");
                tabla.innerHTML = "";

                // Recorrer los detalles del ticket y agregarlos a la tabla
                detalles.forEach(detalle => {
                    // Simular la adición de productos a la tabla
                    sumarProductoDesdeLocalStorage(detalle.idProducto, detalle.cantidad);
                });

                // Calcular los totales después de cargar los productos
                calcularTotales();
            }
        } catch (error) {
            console.error("Error al cargar el ticket desde localStorage:", error);
        }
    }
}

// Función auxiliar para simular la adición de productos desde localStorage
function sumarProductoDesdeLocalStorage(idProducto, cantidad) {
    // Buscar el producto en las listas de alimentos o bebidas
    const producto = [...listAlimentos, ...listBebidas]
        .find(item => item.producto.id === idProducto);

    if (producto) {
        const nombre = producto.producto.nombre;
        const precio = parseFloat(producto.producto.precio);

        // Agregar el producto a la tabla con la cantidad especificada
        for (let i = 0; i < cantidad; i++) {
            sumar(nombre, precio, idProducto);
        }
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarTicketDesdeLocalStorage();
});