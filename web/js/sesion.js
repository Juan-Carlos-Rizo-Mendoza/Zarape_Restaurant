// Función para verificar si existe un token y tomar decisiones
function verificarToken() {
    // Verificar si existe un token en el localStorage
    const token = localStorage.getItem("token");

    if (token !== null) {
        // Si existe un token, el usuario está autenticado
        console.log("Token encontrado. Usuario autenticado.");
        window.location.href = "bienvenida.html"; // Redirigir a la página de bienvenida
    }
}

// Llamar a la función cuando se carga la página
document.addEventListener("DOMContentLoaded", function () {
    verificarToken();
});