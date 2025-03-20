function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

let controladorGral;
let controladorEmpleado;
let controladorAlimento;
let controladorCategoriaA;
let bebida;
let controladorLogIn;

//------------------------------------------------------------------------------------------------------------------

function cargarInicio() {
    fetch('modulos/moduloBienvenida/contenido.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;
            });

    console.log(localStorage.getItem("token"));

    console.log(localStorage.getItem("usuario"));
}

function getLastElementFromLocalStorage() {
    // Obtener la última clave guardada
    const lastKey = localStorage.getItem('lastKey');

    if (lastKey) {
        // Obtener el valor asociado a la última clave
        const lastValue = localStorage.getItem(lastKey);
        console.log(`Última clave: ${lastKey}, Valor: ${lastValue}`);
        return lastValue;
    } else {
        console.log('No hay elementos guardados en localStorage.');
        return null;
    }
}

//------------------------------------------------------------------------------------------------------------------

function servicioLogIn() {
    import('../modulos/moduloLogIn/login.js')
            .then(function (controller) {
                controladorLogIn = controller;
            });
}

//------------------------------------------------------------------------------------------------------------------

function cargarEstado() {
    if (localStorage.getItem("token") !== null || localStorage.getItem("usuario") !== null) {
        import("../modulos/moduloEstado/estado.js")
                .then(controller => {
                    controladorGral = controller;
                    controladorGral.cargarEstado(); // Llama la función para cargar estados
                })
                .catch(error => console.error("Error al cargar el módulo de estados:", error));
    }else{
        
    }
}

//------------------------------------------------------------------------------------------------------------------

function cargarCiudad() {
    import("../modulos/moduloCiudad/ciudad.js")
            .then(module => {
                controladorGral = module;
                // Ahora que el módulo está cargado, llamamos la función cargarEstados
                if (controladorGral.cargarEstados) {
                    controladorGral.cargarEstados(); // Invocar la función cargarEstados
                } else {
                    console.error("La función cargarEstados no está definida");
                }
            });
}

//------------------------------------------------------------------------------------------------------------------

function cargarSucursal() {
    fetch('modulos/moduloSucursal/sucursal.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                import('../modulos/moduloSucursal/sucursal.js')
                        .then(function (controller) {
                            controladorGral = controller;
                            cargarEstado();
                            cargarCiudad();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------

function listaSucursales() {
    import("../modulos/moduloSucursal/lista-sucursales.js")
            .then(controller => {
                controladorGral = controller;
                controladorGral.cargarSucursales(); // Llama la función para cargar estados
            })
            .catch(error => console.error("Error al cargar el módulo de estados:", error));
}

//------------------------------------------------------------------------------------------------------------------

function cargarEmpleados() {
    fetch('modulos/moduloEmpleado/empleado.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                // Cargar el archivo CSS dinámicamente
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'modulos/moduloEmpleado/empleado.css';
                document.head.appendChild(link); // Añadir el <link> al <head>

                import('../modulos/moduloEmpleado/empleado.js')
                        .then(function (controller) {
                            controladorEmpleado = controller;
                            cargarEstado();
                            cargarCiudad();
                            listaSucursales();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------

function listaCategoria() {
    import("../modulos/moduloCategoria/categoria.js")
            .then(controller => {
                controladorCategoriaA = controller;
                controladorCategoriaA.loadCategoriasA();
            })
            .catch(error => console.error("Error al cargar el módulo de estados:", error));
}

function listaCategoriaB() {
    import("../modulos/moduloCategoriaB/categoriaB.js")
            .then(controller => {
                controladorGral = controller;
                controladorGral.loadCategoriasB();
            })
            .catch(error => console.error("Error al cargar el módulo de estados:", error));
}


//------------------------------------------------------------------------------------------------------------------

function cargarAlimento() {
    fetch('modulos/moduloAlimento/alimento.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                import('../modulos/moduloAlimento/alimento.js')
                        .then(function (controller) {
                            controladorAlimento = controller;
                            listaCategoria();
                            vistaPrevia();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------

function cargarBebida() {
    fetch('modulos/moduloBebida/bebida.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                import('../modulos/moduloBebida/bebida.js')
                        .then(function (controller) {
                            bebida = controller;
                            listaCategoriaB();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------


function cargarCliente() {
    fetch('modulos/moduloCliente/cliente.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                import('../modulos/moduloCliente/cliente.js')
                        .then(function (controller) {
                            controladorGral = controller;
                            cargarEstado();
                            cargarCiudad();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------

function cargarPrueba() {
    fetch('modulos/modulo-prueba/prueba.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById("maincontent").innerHTML = html;

                import('../modulos/modulo-prueba/prueba.js')
                        .then(function (controller) {
                            controladorGral = controller;
                            cargarEstado();
                            cargarCiudad();
                            listaSucursales();
                        });
            });
}

//------------------------------------------------------------------------------------------------------------------

function salir() {
    // Eliminar el token del servidor y del Local Storage
    borrarToken()
            .then(() => {
                // Redirigir al usuario después de eliminar el token
                cerrarPestana();
            })
            .catch((error) => {
                console.error("Error al cerrar sesión:", error);
                alert("Ocurrió un error al cerrar sesión. Por favor, intenta nuevamente.");
            });

}

function cerrarPestana() {
    window.location.href = 'index.html';
}

function borrarToken() {
    // Obtener el nombre de usuario del Local Storage
    const nombreUsuario = localStorage.getItem("usuario");
    if (!nombreUsuario) {
        console.error("No hay un usuario almacenado.");
        alert("No hay un usuario almacenado. Por favor, inicia sesión primero.");
        return Promise.reject("No hay un usuario almacenado.");
    }

    // Construir la URL con el nombre de usuario
    const url = `http://localhost:8080/elzarape/api/login/borrarToken?nombre=${encodeURIComponent(nombreUsuario)}`;

    // Realizar la solicitud GET al servicio REST
    return fetch(url, {method: 'GET'})
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Mostrar la respuesta del servidor
                console.log("Respuesta del servidor:", data);

                // Limpiar el Local Storage
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
            })
            .catch(error => {
                // Manejar errores
                console.error("Error al borrar el token:", error.message);
                alert("Ocurrió un error al borrar el token. Por favor, intenta nuevamente.");
                throw error;
            });
}