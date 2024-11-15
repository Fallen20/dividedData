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

        window.location.href = redirection('login/login.html');

    }
});