export let categoriasB = [];


fetch('http://localhost:8080/elzarape/api/categoria/getAllB')
        .then(response => response.json())
        .then(datos => {
            categoriasB = datos;
            console.log(categoriasB);
            loadCategoriasB();
        });


function loadCategoriasB() {
    let categorias = document.getElementById("categoriasB");
    categorias.innerHTML = "";
    categoriasB.forEach(categoria => {
        let v_option = document.createElement("option");
        v_option.value = categoria.idCategoria;
        v_option.text = categoria.nombre;
        categorias.appendChild(v_option);
    });
}
