// Importar Firebase y Firestore
import { db, auth } from '../../inicializarFB.js'; // Asegúrate de tener la configuración inicializada en 'inicializarFB.js'
import { doc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { recoverUserWithId } from "./../../users/user_recover.js";

document.addEventListener("DOMContentLoaded", () => {
    const deleteButton = document.getElementById('delete-button');
    if (!deleteButton) {
        console.error("Delete button not found in the DOM.");
        return;
    }
    
    deleteButton.addEventListener('click', async () => {
         // Verificar el estado de autenticación
         onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Redirigir al login si no está autenticado
                window.location.href = "/login/login.html";
            }
        });

        document.getElementById('delete-button').disabled = true;
        document.getElementById('edit-button').disabled = true;

        
        // console.log("Borrando personaje...");
        try {
            // Recuperar los parámetros de la URL
            const urlParams = new URLSearchParams(window.location.search);
            const characterId = urlParams.get('id');
            const characterAffiliation = urlParams.get('affiliation');

            // Verificar que se tengan ambos parámetros
            if (!characterId || !characterAffiliation) {
                console.error("Character ID or affiliation is missing.");
                alert("Unable to delete: missing character information.");
                return;
            }

            // Crear la referencia al documento específico
            const characterRef = doc(db, characterAffiliation, characterId);


            // Borrar el documento
            await deleteDoc(characterRef);
            console.log("Character deleted successfully.");

            // Redirigir al listado de personajes o alguna otra vista
            window.location.href = `/home.html`;
        } catch (error) {
            console.error("Error deleting character:", error);
            alert("Failed to delete the character. Please try again.");
        }
    });
});
// Función para cargar los datos del personaje
async function loadCharacterData() {
    //recuperar params
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');

    if (!characterName || !characterAff) {
        console.error("No character name or aff provided in the URL.");
        return;
    }

    try {
        const characterRef = doc(db, characterAff, characterName); // Suponiendo que los personajes están en la colección 'neutral'
        const docSnap = await getDoc(characterRef);

        const user=await recoverUserWithId(docSnap.data().owner);
        // console.log("User data:", user);
        if (docSnap.exists()) {
            const data = docSnap.data();

            console.log("Character data:", data);
            // Actualizar los campos en la página con los datos de Firestore
            document.getElementById('character-name').textContent = data.name || 'Unknown Name';
            document.getElementById('character-owner').textContent = user.username || 'Unknown owner';
            document.getElementById('affiliation').textContent = data.affiliation || 'Unknown';
            document.getElementById('age').textContent = data.age || 'Unknown';
            document.getElementById('gender').textContent = data.gender || 'Unknown';
            document.getElementById('description').textContent = data.description || 'No description available';
            document.getElementById('story').textContent = data.story || 'No story available';
            document.getElementById('personality').textContent = data.personality || 'No personality available';
            document.getElementById('special-traits').textContent = data.specialTraits || 'No special traits available';
            document.getElementById('extra').textContent = data.extra || 'No extra information available';
            document.getElementById('edit-button').onclick = () => {
                window.location.href = `./character_edit.html?affiliation=${characterAff}&id=${characterName}`;
            };
            
            // Llenar la lista de movimientos
            const movesList = document.getElementById('moves-list');
            data.moves.forEach(move => {
                const moveItem = document.createElement('li');
                moveItem.textContent = move;
                movesList.appendChild(moveItem);
            });

            // Llenar la galería de imágenes
            if (!data.gallery) {
                console.log("No gallery data found for this character.");
                return;
            }
            const galleryImages = document.getElementById('gallery-images');
            data.gallery.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image;
                imgElement.alt = 'Gallery image';
                galleryImages.appendChild(imgElement);
            });
        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}

// Llamamos a la función para cargar los datos al cargar la página
loadCharacterData();


