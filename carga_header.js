import { getCurrentUser, logout } from './login/login.js';
// document.addEventListener('DOMContentLoaded', () => {
    fetch('/header.html')
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
            userLink.innerHTML = '<a href="./login/login.html">Login</a>';
        }
    });
// });
