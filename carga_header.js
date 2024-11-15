import { getCurrentUser, logout } from './login/login.js';
import {redirection} from './redirect.js';

document.addEventListener('DOMContentLoaded', () => {
    //recuperar url de la pagina

    // const isGitHubPages = window.location.hostname === 'fallen20.github.io';
    // var fetchURL="header.html";
    // // Cambiar la redirección de acuerdo con el entorno
    // if (isGitHubPages) {
    //     // Si estamos en GitHub Pages, usamos la ruta absoluta
    //     fetchURL = "/dividedData/header.html";
    // } 

    fetch(redirection('header.html'))
        .then(response => {
            if (!response.ok) {
                console.log("Error al cargar el header");
                throw new Error("No se pudo cargar el header");
            }
            return response.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const headerContent = doc.querySelector('#header');

            if (headerContent) {
                document.getElementById('header-container').appendChild(headerContent);
            } else {
                console.error("No se encontró el elemento con id 'header' en header.html");
            }
        })
        .catch(error => console.error("Catch header:", error));

    getCurrentUser().then(user => {
        const userLink = document.getElementById('user-link');

        if (user) {
            userLink.innerHTML = `Hola, ${user.displayName || user.email} `;

            // Crear el enlace para cerrar sesión
            const logoutLink = document.createElement('a');
            logoutLink.href = "#";
            logoutLink.textContent = "Cerrar sesión";
            logoutLink.style.marginLeft = '10px'; // estilo opcional para separación
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();  // Evitar que haga scroll a la parte superior
                logout(); // Llamar a la función logout
            });
            userLink.appendChild(logoutLink);
        } else {
            var link=redirection('login/login.html');
            userLink.innerHTML = '<a href="' + link + '">Login</a>';
        }
    });
});