export let categoriasA = [];


fetch('http://localhost:8080/elzarape/api/categoria/getAllA')
        .then(response => response.json())
        .then(datos => {
            categoriasA = datos;
            console.log(categoriasA);
            loadCategoriasA();
        });


function loadCategoriasA() {
    let categorias = document.getElementById("categoriasA");
    categorias.innerHTML = "";
    categoriasA.forEach(categoria => {
        let v_option = document.createElement("option");
        v_option.value = categoria.idCategoria;
        v_option.text = categoria.nombre;
        categorias.appendChild(v_option);
    });
}
