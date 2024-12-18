import { getCurrentUser, logout } from './login/login.js';
import { redirection } from './redirect.js';

//firebase
import { db } from "./inicializarFB.js";
import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

document.addEventListener('DOMContentLoaded', function () {
    //buscar user consent

    const searchUserConsent = async (username) => {
        // Convierte el username a minúsculas para la comparación insensible a mayúsculas
        const usernameLowerCase = username.toLowerCase();

        // Referencia a la colección 'consent'
        const consentCollection = collection(db, 'consent');

        // Crea una consulta que busque los documentos donde el username sea igual al valor ingresado
        const q = query(consentCollection, where("username", "==", usernameLowerCase));

        try {
            const querySnapshot = await getDocs(q);

            // Si se encuentra un documento
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0]; // Tomamos el primer resultado
                const docId = doc.id; // ID del documento encontrado
                // Redirigir a la página visualize con el id como parámetro en la URL
                window.location.href = redirection(`consent/visualize.html?id=${docId}`);
            } else {
                alert('No user found with that username!');
            }
        } catch (error) {
            console.error("Error searching user: ", error);
            alert('An error occurred while searching.');
        }
    };

    const intervalId = setInterval(function () {
        const searchInput = document.getElementById("search-user-consent");

        if (searchInput) {
            searchInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    const username = event.target.value.trim(); // Obtener el valor del input
                    if (username) {
                        searchUserConsent(username);
                    }
                }
            });

            clearInterval(intervalId); // Detener la comprobación cuando lo encontramos
        }
    }, 100); // Comprobar cada 100 milisegundos

    console.log("Cargando header...");
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
            headerContent.querySelector('#create-consent').href = redirection('consent/create.html');
            headerContent.querySelector('#delete-consent').href = redirection('consent/delete.html');
            headerContent.querySelector('#home').href = redirection('home.html');
            headerContent.querySelector('#login').href = redirection('login/login.html');

            if (headerContent) {
                document.getElementById('header-container').appendChild(headerContent);
            } else {
                console.error("No se encontró el elemento con id 'header' en header.html");
            }
        })
        .catch(error => console.error("Catch header:", error));

    getCurrentUser().then(user => {
        const userLink = document.getElementById('login');

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