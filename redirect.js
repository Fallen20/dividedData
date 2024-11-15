export function redirection(url) {
    // var returnURL=url;
    if (window.location.href.includes('github')) {
        url = "/dividedData/" + url;
    }
    else {
        url = "/" + url;
    }
    return url;
}


import { auth } from "./inicializarFB.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Obtener la ruta actual
        const currentPath = window.location.pathname;

        // Excluir ciertas páginas de la verificación, si es necesario (opcional)
        const exemptPaths = ["/home.html", "/login/login.html"];
        if (!exemptPaths.includes(currentPath)) {
            // Redirigir al login si no está autenticado
            window.location.href = redirection('login/login.html');
        }
    }
});