import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';
import { getCurrentUser } from '../../login/login.js';


document.addEventListener("DOMContentLoaded", async () => {


    async function recoverCharacter() {
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        const affiliation = urlParams.get('affiliation');

        const docRef = doc(db, affiliation, characterId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const character = docSnap.data();
            document.getElementById("character").innerHTML = character.name;
        }

    }
    async function recoverStories() {
        // Recuperar la URL
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        const affiliation = urlParams.get('affiliation');


        //buscar en la ddbb de stories
        const collectionRef = collection(db, "story");

        const q = query(collectionRef, where("character", "==", characterId));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            noRelation();
        } else {
            //recorrer
            querySnapshot.forEach((doc) => {
                const story = doc.data();
                console.log(story);

                // Crear contenedor principal del story
                const storyElement = document.createElement("div");
                storyElement.classList.add("card", "mb-3");

                // Crear cabecera
                const header = document.createElement("div");
                header.classList.add("card-header");

                const title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = story.title;

                // Crear cuerpo
                const body = document.createElement("div");
                body.classList.add("card-body");

                const text = document.createElement("p");
                text.classList.add("card-text");
                text.textContent = story.text;

                // Crear pie de página con botón
                const footer = document.createElement("div");
                footer.classList.add("card-footer");


                const editButton = document.createElement("button");
                editButton.classList.add("btn", "btn-primary", 'me-2');
                editButton.textContent = "Edit";
                hideElement(footer);
                editButton.addEventListener("click", () => {
                    
                    console.log(doc.id);
                    window.location.href = redirection(`stories_character/story_edit.html?affiliation=${affiliation}&character=${characterId}&id=${doc.id}`);
                });

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("btn", "btn-danger");
                deleteButton.textContent = "Delete";
                hideElement(footer);

                // Añadir evento al botón
                deleteButton.addEventListener("click", () => {
                    deleteStory(doc.id);
                    // Aquí podrías llamar a otra función para borrar el elemento de Firestore
                });

                // Añadir elementos al DOM
                header.appendChild(title);
                body.appendChild(text);
                footer.appendChild(editButton);
                footer.appendChild(deleteButton);

                storyElement.appendChild(header);
                storyElement.appendChild(body);
                storyElement.appendChild(footer);

                // Añadir al contenedor principal
                const storiesContainer = document.getElementById("stories");
                storiesContainer.appendChild(storyElement);
            });

        }
    }

    function noRelation() {
        var doc = document.getElementById("relations");
        doc.innerHTML = "No relations found";
        doc.classList.add("d-flex", "flex-column", "justify-content-center", "mx-auto", "text-center");
        //crear boton
        var button = document.createElement("button");
        button.classList.add("btn", "btn-primary", "w-25", "mx-auto", "mt-3");
        button.textContent = "Add Relation";
        button.addEventListener("click", () => {
            window.location.href = redirection(`relations_character/create_relation.html?affiliation=${affiliation}&id=${characterId}`);;
        });
        doc.appendChild(button);
    }

    function addRelation() {
        //recuperar params

        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        const affiliation = urlParams.get('affiliation');

        hideElement(document.getElementById('add_story'));

        document.getElementById('add_story').addEventListener('click', () => {
            window.location.href = redirection(`stories_character/story_create.html?affiliation=${affiliation}&id=${characterId}`);
        });
    }

    async function hideElement(elemento) {
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        const affiliation = urlParams.get('affiliation');

        const userLoged = await getCurrentUser();
        if (userLoged == null) {
            elemento.classList.add('d-none');
            return;
        }

        //recuperar el oc
        const characterRef = doc(db, affiliation, characterId); // Suponiendo que los personajes están en la colección 'neutral'
        const docSnap = await getDoc(characterRef);



        // console.log("User data:", user);
        if (docSnap.exists()) {
            const data = docSnap.data();

            console.log(data);
            console.log(userLoged);

            // si es el mismo, sacar los botones
            if (data.owner !== userLoged.uid && userLoged.uid !== 'EQOEICzeFeRqiTafa4C2JtQals92') {
                elemento.classList.add('d-none');
            }

        }
    }

    // Función para borrar un documento de Firestore
    async function deleteStory(storyId) {
        try {
            const docRef = doc(db, "story", storyId);  // Referencia al documento
            await deleteDoc(docRef);  // Eliminar de Firestore
            console.log(`Documento ${storyId} eliminado con éxito.`);
            location.reload();  // Recargar la página para reflejar cambios
        } catch (error) {
            console.error("Error al eliminar el documento:", error);
            alert("No se pudo eliminar el documento.");
        }
    }

    addRelation();
    await recoverStories();
    await recoverCharacter();


});
