// // Importar Firebase y Firestore
// import { db } from '../../inicializarFB.js'; // Asegúrate de tener la configuración inicializada en 'inicializarFB.js'
// import { collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// // Función para mostrar los personajes
// async function displayCharacters() {
//     const collections = ['neutral', 'protector', 'rebel'];

//     // Recorremos las colecciones
//     for (const collectionName of collections) {
//         try {
//             // Referencia a la colección
//             const querySnapshot = await getDocs(collection(db, collectionName));

//             // Creamos una lista para cada colección
//             const listElement = document.getElementById(`${collectionName}-list`);
//             listElement.innerHTML = '';  // Limpiamos la lista antes de agregar

//             // Si hay personajes, los agregamos a la lista
//             querySnapshot.forEach(doc => {
//                 const characterData = doc.data();
//                 const listItem = document.createElement('li');
//                 listItem.textContent = characterData.name;
//                 listItem.style.cursor = 'pointer';

//                 // Redirigir a la vista de personaje al hacer clic
//                 listItem.addEventListener('click', () => {
//                     window.location.href = `character_view.html?name=${encodeURIComponent(characterData.name)}`;
//                 });

//                 listElement.appendChild(listItem);
//             });

//             // Si no hay personajes, mostramos un mensaje
//             if (querySnapshot.empty) {
//                 const noDataMessage = document.createElement('li');
//                 noDataMessage.textContent = 'No characters found in this collection.';
//                 listElement.appendChild(noDataMessage);
//             }
//         } catch (error) {
//             console.error("Error getting documents: ", error);
//         }
//     }
// }

// // Llamar a la función para mostrar los personajes al cargar la página
// displayCharacters();


// Importar Firebase y Firestore
import { db } from '../../inicializarFB.js'; // Asegúrate de tener la configuración inicializada en 'inicializarFB.js'
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

import {redirection} from '/redirect.js';


document.getElementById('filter-affiliation').addEventListener('click', () => {
    loadCharacterCollection();
});

document.getElementById("filter-characters").addEventListener("click", (event) => {
    fetchAndRenderCharacters();  // Llama a la función de recuperación y renderizado
});


// Función para cargar la estructura de personajes
function loadCharacterCollection() {
    // Crear el contenido dinámicamente
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = ''; // Limpiar cualquier contenido anterior

    const characterContainerHTML = `
        <div class="character-container">
            <div id="neutral-collection" >
                <h2>Neutral</h2>
                <ul id="neutral-list" style="columns: 3;"></ul>
            </div>

            <div id="protector-collection">
                <h2>Protector</h2>
                <ul id="protector-list" style="columns: 3;"></ul>
            </div>

            <div id="rebel-collection">
                <h2>Rebel</h2>
                <ul id="rebel-list" style="columns: 3;"></ul>
            </div>
        </div>
    `;


    // Insertar la estructura en el contenedor de resultados
    resultsContainer.innerHTML = characterContainerHTML;

    // Ahora recuperamos los datos de Firebase y los insertamos en sus listas
    displayCharacters();
}

// Función para mostrar los personajes
async function displayCharacters() {

    const collections = ['neutral', 'protector', 'rebel'];

    // Recorremos las colecciones
    for (const collectionName of collections) {
        try {
            // Referencia a la colección, ordenado por 'username'
            const querySnapshot = await getDocs(collection(db, collectionName));

            // Accedemos a la lista correspondiente
            const listElement = document.getElementById(`${collectionName}-list`);
            listElement.innerHTML = '';  // Limpiamos la lista antes de agregar


            // Si hay personajes, los agregamos a la lista
            let hasCharacters = false;  // Bandera para saber si hay personajes en la colección

            querySnapshot.forEach(doc => {
                const characterData = doc.data();
                const listItem = document.createElement('li');
                listItem.textContent = characterData.name;
                listItem.style.cursor = 'pointer';
                listItem.style.marginBottom = '10px';

                // Aquí puedes agregar un click event si deseas redirigir a una página de detalle del personaje
                listItem.addEventListener('click', () => {
                    // Verifica si estamos en GitHub Pages
                    window.location.href = redirection(`character/character_view.html?affiliation=${characterData.affiliation}&id=${doc.id}`);

                    // window.location.href = `/character/character_view.html?affiliation=${characterData.affiliation}&id=${doc.id}`;
                });

                listElement.appendChild(listItem);
                hasCharacters = true;
            });


            // Si no hay personajes, se deja el título vacío
            if (!hasCharacters) {
                const noDataMessage = document.createElement('div');
                noDataMessage.textContent = 'No characters found in this collection.';
                listElement.appendChild(noDataMessage);
            }
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }
}

async function fetchAndRenderCharacters() {
    document.getElementById('results').innerHTML = '';  // Limpiar los resultados previos

    const collections = ['neutral', 'protector', 'rebel'];  // Las colecciones de personajes
    const characters = {};  // Objeto para almacenar los personajes agrupados por inicial

    try {
        // Recorremos las colecciones
        for (const collectionName of collections) {
            const charactersRef = collection(db, collectionName);
            const q = query(charactersRef, orderBy("name"));  // Ordenar por 'name' (campo que deseas)
            const querySnapshot = await getDocs(q);

            // Agrupar los personajes por inicial
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const initial = data.name[0].toUpperCase();  // Usamos la primera letra del nombre

                // Si no existe la clave inicial, la creamos
                if (!characters[initial]) {
                    characters[initial] = [];
                }

                // console.log("Personaje recuperado:", data, "ID del documento:", doc.id);

                characters[initial].push({
                    id: doc.id,
                    name: data.name,
                    pokemonName: data.pokemonName,
                    affiliation: data.affiliation,
                    age: data.age,
                    gender: data.gender
                });
            });

        }

        renderCharacters(characters);  // Renderizamos los personajes
    } catch (error) {
        console.error("Error recuperando personajes:", error);
    }
}

// Función para renderizar personajes en el DOM
function renderCharacters(characters) {
    const container = document.createElement("div");
    container.classList.add("character-list");

    // Recorremos las iniciales y ordenamos alfabéticamente
    Object.keys(characters).sort().forEach(letter => {
        const letterHeader = document.createElement("h2");
        letterHeader.textContent = letter;
        container.appendChild(letterHeader);

        const divider = document.createElement("div");
        divider.style.borderBottom = "1px solid #ddd";
        divider.style.marginBottom = "1rem";
        container.appendChild(divider);

        // Recorremos los personajes que comienzan con esa letra
        characters[letter].forEach(character => {
            const characterItem = document.createElement("div");
            characterItem.textContent = `- ${character.name}`;  // Mostramos los detalles

            characterItem.style.cursor = 'pointer';
            characterItem.style.marginBottom = '10px';

            // Aquí puedes agregar un click event si deseas redirigir a una página de detalle del personaje
            characterItem.addEventListener('click', () => {
                // console.log(character);

                window.location.href = redirection(`character/character_view.html?affiliation=${character.affiliation}&id=${character.id}`);


                // window.location.href = `/character/character_view.html?affiliation=${character.affiliation}&id=${character.id}`;
                // window.location.href = `/character/character_view.html?id=${character.id}`;
            });

            container.appendChild(characterItem);
        });
    });

    // Insertamos el contenedor con los personajes en el DOM
    document.getElementById("results").appendChild(container);
}

