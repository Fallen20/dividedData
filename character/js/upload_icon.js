import { dbImg } from "../../inicializarFB.js";
import { addDoc, collection, serverTimestamp, query, where, getDocs, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { redirection } from './../../redirect.js';

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');

    document.getElementById('upload').addEventListener('click', async () => {
        // Recuperar el input file
        const fileInput = document.getElementById('icon_file');

        // Verificar si está lleno
        if (fileInput.files.length === 0) {
            alert('Please select an image file.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        //ercuperar el id de la url
        const characterId = urlParams.get('id');
        //recuperar affiliation
        const affiliation = urlParams.get('affiliation');
        // Archivo seleccionado
        const file = fileInput.files[0];

        try {

            const q = query(collection(dbImg, 'profile'),
                where('affiliation', '==', characterAff),
                where('character_id', '==', characterName));

            // Ejecutar la consulta
            const querySnapshot = await getDocs(q);

            //si ya existe una img
            if (!querySnapshot.empty) {
                //borrarla
                const docSnapshot = querySnapshot.docs[0]; // Tomamos el primer documento que coincide
                await deleteDoc(docSnapshot.ref); // Borramos el documento de la imagen anterior
                console.log('Imagen anterior borrada.');
            }
            //y entonces subir la nueva
            // Convertir a Base64
            const base64String = await fileToBase64(file);

            // Guardar en Firestore
            await addDoc(collection(dbImg, 'profile'), {
                character_id: characterId,
                affiliation: affiliation,
                base64: base64String,
            });

            window.location.href = redirection(`character/character_view.html?affiliation=${affiliation}&id=${characterId}`);
        } catch (error) {
            console.error("Error uploading the image:", error);
            alert('An error occurred while uploading the image.');
        }
    });



    recoverImage();
});

//recuperar el icono antiguo
async function recoverImage() {
    //recuperar params
    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');


    try {
        // Realizamos la consulta con los filtros de 'affiliation' y 'character_id'
        const q = query(collection(dbImg, 'profile'),
            where('affiliation', '==', characterAff),
            where('character_id', '==', characterName));

        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Si hay documentos que coinciden, tomar el primero
            const docSnapshot = querySnapshot.docs[0];
            const { base64, character_id, affiliation } = docSnapshot.data();

            // Seleccionamos el <img> con id="imagen-pokemon"
            const imageElement = document.getElementById('old-icon');

            if (imageElement) {
                imageElement.src = base64;  // Asigna la cadena Base64 como la fuente de la imagen
                imageElement.alt = `Character ID: ${character_id}, Affiliation: ${affiliation}`;  // Información adicional
            }
        } else {
             document.getElementById('old-icon').src='https://via.placeholder.com/180';
            console.log("No se encontró el documento con los parámetros proporcionados.");
        }
    } catch (error) {
        console.log("Error al recuperar la imagen:", error.message);
    }
}

// Función para convertir archivo a Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
