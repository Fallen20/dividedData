import { collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { recoverUserWithId } from "./user_recover.js";

import { db } from "./../inicializarFB.js"; // Asegúrate de importar correctamente tu inicialización de Firebase
import { redirection } from './../redirect.js';

//recuperar param id
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const user = await recoverUserWithId(id);


const username = document.getElementById('username');
username.innerHTML = user.username;

const userDiscord = document.getElementById('discord_name');
userDiscord.innerHTML = user.user_discord;

const pronouns = document.getElementById('pronouns');
pronouns.innerHTML = user.pronouns;

const timezone = document.getElementById('timezones');
timezone.innerHTML = user.timezone;

// Función para recuperar los personajes cuyo owner sea el id dado
async function getCharactersByOwner() {
    const collections = ['neutral', 'protector', 'rebel']; // Nombre de las colecciones a consultar
    let characters = [];

    try {
        // Recorrer cada colección
        for (let collectionName of collections) {
            // Crear la referencia a la colección
            const charactersRef = collection(db, collectionName);

            // Crear la consulta con la condición donde 'owner' sea igual a ownerId
            const q = query(charactersRef, where("owner", "==", id));

            // Ejecutar la consulta y obtener los documentos
            const querySnapshot = await getDocs(q);

            // Recorrer los documentos recuperados
            querySnapshot.forEach(doc => {
                // Obtener los datos del documento
                const data = doc.data();

                // Agregar el personaje encontrado al array de resultados
                characters.push({ id: doc.id, ...data });  // Agrega también el ID del documento
            });
        }

        // Devolver los personajes encontrados
        return characters;
    } catch (error) {
        console.error("Error al recuperar los personajes:", error);
        return []; // Retornar un arreglo vacío en caso de error
    }
}

async function fillCharacters(characters) {
    const charactersContainer = document.getElementById('characters');

    characters.forEach(character => {
        // Crear el contenedor de la tarjeta
        const characterCard = document.createElement('div');
        characterCard.classList.add('card', 'p-1', 'me-2', 'text-center', 'align-items-center');
        characterCard.style.width = '18rem';  // Establecer el ancho de la tarjeta
        var link = redirection(`character/character_view.html?affiliation=${character.affiliation}&id=${character.id}`);
        characterCard.innerHTML = `
        <a href="${link}">
    <img class="img-fluid" src="https://f2.toyhou.se/file/f2-toyhou-se/images/79782662_FN0Q9Jy8nqm6Fdg.png" alt="${character.name}" style="max-width: 100px;">
    </a>
    <div class="card-body">
        <h4 class="card-title">${character.name}</h4>
        <p>${character.affiliation}</p>
    </div>
`;

        // Agregar la tarjeta al contenedor
        charactersContainer.appendChild(characterCard);
    });
}
fillCharacters(await getCharactersByOwner());