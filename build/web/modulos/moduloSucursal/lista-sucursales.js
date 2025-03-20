let listSucursal = [];

export async function cargarSucursales() {
    try {
        const response = await fetch('http://localhost:8080/elzarape/api/sucursal/getAll');
        listSucursal = await response.json();

        const selectSucursal = document.getElementById("sucursales");

        listSucursal.forEach(sucursal => {
            const option = document.createElement("option");
            option.value = sucursal.idSucursal;
            option.text = sucursal.nombre;
            selectSucursal.appendChild(option);
        });
        console.log("Sucursales cargadas: ", listSucursal);
    } catch (error) {
        console.error("Error al cargar estados:", error);
    }
}

