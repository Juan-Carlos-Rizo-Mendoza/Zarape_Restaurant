let listCiudades = [];


export async function cargarCiudad() {
    try {
        const response = await fetch('http://localhost:8080/elzarape/api/ciudad/getAll')
        listCiudades = await response.json();
        console.log("Ciudades cargadas:", listCiudades);
        document.getElementById('estados').addEventListener('change', loadCiudades);
        loadCiudades();

    } catch (e) {
        console.error("Error al cargar ciudades:", e);
    }

}

function loadCiudades() {
    const v_estado = document.getElementById('estados').value;
    const listCiudad = document.getElementById('ciudades')

    listCiudad.innerHTML = "";

    listCiudades.forEach(ciudad => {
        if (ciudad.estado.idEstado == v_estado) {
            let option = document.createElement("option");
            option.value = ciudad.idCiudad;
            option.text = ciudad.nombre;
            listCiudad.appendChild(option);
        }
    });
}
cargarCiudad();


