let listAlimento = [];

init();

function init() {
    fetch('http://localhost:8080/elzarape/api/alimento/getAll')
        .then(response => response.json())
        .then(datos => {
            listAlimento = datos;
            console.log("Lista de" + listAlimento);
            cargarBebidasActivas();
            cargarBebidasInactivas();
        });
}

function cargarBebidasActivas() {
    let table = document.getElementById("registrosA");
    let renglonA = "";
    listAlimento.forEach(alimento => {
        if (alimento.producto.activo == 1) {
            renglonA += `<tr onclick="selectDeBebida(this)"><td>` 
                + alimento.producto.nombre + "</td><td>"
                + alimento.producto.descripcion + "</td><td>"
                + `<img alt="${alimento.producto.nombre}" src="data:image/jpeg;base64,${alimento.producto.foto}" data-foto="${alimento.producto.foto}" style="max-width: 150px;"/>` 
                + "</td><td>" + alimento.producto.precio + "</td><td>"
                + alimento.producto.categoria.nombre + "</td><td style='display:none;'>"
                + alimento.idAlimento + "</td><td style='display:none;'>"
                + alimento.producto.categoria.idAlimento + "</td></tr>";
        }
    });
    table.innerHTML = renglonA;
}

function cargarBebidasInactivas() {
    let table = document.getElementById("registrosI");
    let renglonI = "";
    listAlimento.forEach(alimento => {
        if (alimento.producto.activo == 0) {
            renglonI += `<tr><td>` + alimento.producto.nombre + "</td><td>"
                + alimento.producto.descripcion + "</td><td>"
                + `<img alt="${alimento.producto.nombre}" src="data:image/jpeg;base64,${alimento.producto.foto}" style="max-width: 150px;"/>` + "</td><td>"
                + alimento.producto.precio + "</td><td>"
                + alimento.producto.categoria.nombre + "</td></tr>";
        }
    });
    table.innerHTML = renglonI;
}

export function agregarAlimento() {
    let v_id = document.getElementById("id").value;
    let v_nombre = document.getElementById("nombre").value;
    let v_descripcion = document.getElementById("descripcion").value;
    let v_foto = document.getElementById("fotoAlimento").value;
    let v_precio = document.getElementById("precio").value;
    let v_categoria = document.getElementById("categoriasA").value;

    if (!v_nombre || !v_descripcion || !v_precio || !v_categoria) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    let alimento = {
        producto: {
            nombre: v_nombre,
            descripcion: v_descripcion,
            foto: v_foto,
            precio: parseFloat(v_precio),
            categoria: { idCategoria: v_categoria }
        }
    };

    if (v_id) {
        alimento.idAlimento = parseInt(v_id);
    }

    let datos_servidor = { "datosAlimento": JSON.stringify(alimento) };
    let parametro = new URLSearchParams(datos_servidor);

    let registro = {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: parametro
    };

    fetch('http://localhost:8080/elzarape/api/alimento/add', registro)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            init();
            clean();
        });
}

export function eliminarAlimento() {
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
    document.getElementById('imgAlimento').src = "imagenes/camera.png";
    document.getElementById('precio').value = "";
    document.getElementById('categorias').value = 0;
    document.getElementById('inputFotoBebida').value = "";
}

export function cargarFotografiaAlimento(input) {
    // Revisamos si el usuario ha seleccionado un archivo
    if (input.files && input.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            // Muestra la imagen en el <img>
            document.getElementById("imgFoto").src = e.target.result;

            // Guarda la cadena Base64 sin el encabezado en el <textarea>
            document.getElementById("fotoAlimento").value = e.target.result.split(",")[1];
        };

        // Leer el archivo seleccionado como Base64
        reader.readAsDataURL(input.files[0]);
    }
}
