let listEstado = [];

export async function cargarEstado() {
    try {
        const response = await fetch('http://localhost:8080/elzarape/api/estado/getAll');
        listEstado = await response.json();

        const selectEstado = document.getElementById("estados");

        listEstado.forEach(estado => {
            const option = document.createElement("option");
            option.value = estado.idEstado;
            option.text = estado.nombre;
            selectEstado.appendChild(option);
        });
        console.log("Estados cargados: ", listEstado);
    } catch (error) {
        console.error("Error al cargar estados:", error);
    }
}
//