import { getCurrentUser, logout } from './login/login.js';
import { redirection } from './redirect.js';

document.addEventListener('DOMContentLoaded', () => {
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

            
            headerContent.querySelector('#create-users').href = redirection('users/user_creation.html');
            headerContent.querySelector('#create-chars').href = redirection('character/character_creation.html');
        headerContent.querySelector('#login').href = redirection('home.html');

            if (headerContent) {
                document.getElementById('header-container').appendChild(headerContent);
            } else {
                console.error("No se encontró el elemento con id 'header' en header.html");
            }
        })
        .catch(error => console.error("Catch header:", error));

    getCurrentUser().then(user => {
        const userLink = document.getElementById('user-link');

        if (user && userLink) {
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
            var link = redirection('login/login.html');
            userLink.innerHTML = '<a href="' + link + '">Login</a>';
        }
    });

});