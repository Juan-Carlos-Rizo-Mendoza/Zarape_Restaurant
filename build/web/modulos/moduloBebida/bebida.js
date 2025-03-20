let listBebidas = [];

init();

function init() {
    fetch('http://localhost:8080/elzarape/api/bebidas/getAll')
        .then(response => response.json())
        .then(datos => {
            listBebidas = datos;
            console.log("Lista de" + listBebidas);
            cargarBebidasActivas();
            cargarBebidasInactivas();
        });
}

function cargarBebidasActivas() {
    let table = document.getElementById("registrosA");
    let renglonA = "";
    listBebidas.forEach(bebida => {
        if (bebida.producto.activo == 1) {
            renglonA += `<tr onclick="selectDeBebida(this)"><td>` 
                + bebida.producto.nombre + "</td><td>"
                + bebida.producto.descripcion + "</td><td>"
                + `<img alt="${bebida.producto.nombre}" src="data:image/jpeg;base64,${bebida.producto.foto}" data-foto="${bebida.producto.foto}" style="max-width: 150px;"/>` 
                + "</td><td>" + bebida.producto.precio + "</td><td>"
                + bebida.producto.categoria.nombre + "</td><td style='display:none;'>"
                + bebida.idBebida + "</td><td style='display:none;'>"
                + bebida.producto.categoria.idCategoria + "</td></tr>";
        }
    });
    table.innerHTML = renglonA;
}

function cargarBebidasInactivas() {
    let table = document.getElementById("registrosI");
    let renglonI = "";
    listBebidas.forEach(bebida => {
        if (bebida.producto.activo == 0) {
            renglonI += `<tr><td>` + bebida.producto.nombre + "</td><td>"
                + bebida.producto.descripcion + "</td><td>"
                + `<img alt="${bebida.producto.nombre}" src="data:image/jpeg;base64,${bebida.producto.foto}" style="max-width: 150px;"/>` + "</td><td>"
                + bebida.producto.precio + "</td><td>"
                + bebida.producto.categoria.nombre + "</td></tr>";
        }
    });
    table.innerHTML = renglonI;
}

export function agregarBebidas() {
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_descripcion = document.getElementById("descripcion").value;
    let v_foto = document.getElementById("fotoBebida").value;
    let v_precio = document.getElementById("precio").value;
    let v_categoria = document.getElementById("categoriasB").value;

    if (!v_nombre || !v_descripcion || !v_precio || !v_categoria) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    let bebida = {
        producto: {
            nombre: v_nombre,
            descripcion: v_descripcion,
            foto: v_foto,
            precio: parseFloat(v_precio),
            categoria: { idCategoria: v_categoria }
        }
    };

    if (v_id) {
        bebida.idBebida = parseInt(v_id);
    }

    let datos_servidor = { "datosBebida": JSON.stringify(bebida) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/elzarape/api/bebidas/agregar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            init();
            clean();
        });
}

export function eliminarBebida() {
    let id = document.getElementById('id').value;

    let datos_servidor = { "idBebida": id };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8081/Zarape-Web-V1/api/bebidas/eliminar', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            init();
            clean();
        });
}

function clean() {
    document.getElementById('id').value = "";
    document.getElementById('nombre').value = "";
    document.getElementById('descripcion').value = "";
    document.getElementById('fotoBebida').value = "";
    document.getElementById('imgFoto').src = "imagenes/camera.png";
    document.getElementById('precio').value = "";
    document.getElementById('categorias').value = 0;
    document.getElementById('inputFotoBebida').value = "";
}

export function cargarFotografiaBebida(input) {
    // Revisamos si el usuario ha seleccionado un archivo
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            // Muestra la imagen en el <img>
            document.getElementById("imgFoto").src = e.target.result;

            // Guarda la cadena Base64 sin el encabezado en el <textarea>
            document.getElementById("fotoBebida").value = e.target.result.split(",")[1];
        };

        // Leer el archivo seleccionado como Base64
        reader.readAsDataURL(input.files[0]);
    }
}
