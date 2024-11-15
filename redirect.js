export function redirection(url){
    // var returnURL=url;
    if (window.location.href.includes('github')) {
        url = "/dividedData/"+url;
    }
    else{
        url = "/"+url;
    }
    return url;
}


import { auth } from "./inicializarFB.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Obtener la ruta actual
        const currentPath = window.location.pathname;

        const exemptPaths = ["/home.html", "/login/login.html"];
        console.log(currentPath);
        if(currentPath.includes('home.html')){
            console.log('a');
        }
        else{
            console.log('b');
        }
        if (!exemptPaths.includes(currentPath)) {
            // Redirigir al login si no está autenticado
            // window.location.href = redirection('login/login.html');
        }
    }
});