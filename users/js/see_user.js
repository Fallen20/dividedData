import { collection, query, where, getDocs, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { recoverUserWithId } from "./user_recover.js";

import { db, dbImg } from "../../inicializarFB.js"; // Asegúrate de importar correctamente tu inicialización de Firebase
import { redirection } from '../../redirect.js';


document.addEventListener('DOMContentLoaded', async () => {
    await fillUser();
    await fillCharacters(await getCharactersByOwner());
    await searchConsent();
});


async function recoverUser() {
    //recuperar param id
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const user = await recoverUserWithId(id);
    return user;
}
async function fillUser() {

    const user = await recoverUser();

    const username = document.getElementById('username');
    username.innerHTML = user.username;

    const userDiscord = document.getElementById('discord_name');
    userDiscord.innerHTML = user.user_discord;

    const pronouns = document.getElementById('pronouns');
    pronouns.innerHTML = user.pronouns;

    const timezone = document.getElementById('timezones');
    timezone.innerHTML = user.timezone;
}


// Función para recuperar los personajes cuyo owner sea el id dado
async function getCharactersByOwner() {
    const collections = ['neutral', 'protector', 'rebel']; // Nombre de las colecciones a consultar
    let characters = [];


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    //el id es el id del documento, hay que recuperar el interior
    const userRef = doc(db, 'users', id);  // Referencia al documento
    const userSnap = await getDoc(userRef);    // Obtener el documento

    const userData = userSnap.data();  // Obtener los datos


    try {
        // Recorrer cada colección
        for (let collectionName of collections) {
            // Crear la referencia a la colección
            const charactersRef = collection(db, collectionName);

            // Crear la consulta con la condición donde 'owner' sea igual a ownerId
            const q = query(charactersRef, where("owner", "==", userData.id));

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

    for (const character of characters) {

        //buscar si tiene img
        const imgSearch = query(
            collection(dbImg, 'profile'),
            where("character_id", "==", character.id)
        );
        const querySnapshot = await getDocs(imgSearch);
        let img = null;
        if (!querySnapshot.empty) {
            img = querySnapshot.docs[0].data();
        }
        else {
            img.base64 = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg';
        }



        // Crear el contenedor de la tarjeta
        const characterCard = document.createElement('div');
        characterCard.classList.add('card', 'p-1', 'me-2', 'text-center', 'align-items-center');
        characterCard.style.width = '18rem';  // Establecer el ancho de la tarjeta
        var link = redirection(`character/character_view.html?affiliation=${character.affiliation}&id=${character.id}`);
        characterCard.innerHTML = `
        <a href="${link}">
    <img class="img-fluid" src="${img.base64}" alt="${character.name}" style="max-width: 100px;">
    </a>
    <div class="card-body">
        <h4 class="card-title">${character.name}</h4>
        <p>${character.affiliation}</p>
    </div>
`;

        // Agregar la tarjeta al contenedor
        charactersContainer.appendChild(characterCard);
    }
}


//buscar el consent de este user
async function searchConsent() {
    const user = await recoverUser();

    // Convierte el username a minúsculas para la comparación insensible a mayúsculas
    const usernameLowerCase = user.user_discord.toLowerCase();

    // Referencia a la colección 'consent'
    const consentCollection = collection(db, 'consent');

    // Crea una consulta que busque los documentos donde el username sea igual al valor ingresado
    const q = query(consentCollection, where("username", "==", usernameLowerCase));

    try {
        const querySnapshot = await getDocs(q);

        // Si se encuentra un documento
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0]; // Tomamos el primer resultado
            console.log(doc);
            const docId = doc.id; // ID del documento encontrado
            document.getElementById('consent_link').href = redirection(`consent/visualize.html?id=${docId}`);

        } else {
            document.getElementById('consent').innerHTML = "No consent found";
        }
    } catch (error) {
        console.error("Error searching user: ", error);
        alert('An error occurred while searching.');
    }
}


