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


// import { auth } from "./../inicializarFB.js";
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// // Verificar el estado de autenticación
// onAuthStateChanged(auth, (user) => {
//     if (!user) {
//         // Redirigir al login si no está autenticado
//         // Verificar si estamos en GitHub Pages

//         window.location.href = redirection('login/login.html');

//         // window.location.href = "./../login/login.html";
//     }
// });