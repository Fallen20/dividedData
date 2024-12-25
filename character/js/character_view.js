// Importar Firebase y Firestore
import { db, auth, dbImg, authImg } from '../../inicializarFB.js'; // Asegúrate de tener la configuración inicializada en 'inicializarFB.js'
import { doc, getDoc, deleteDoc, getDocs, query, collection, where, addDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

import { recoverUserWithId, recoverUserWithLogId } from "./../../users/js/user_recover.js";
import { redirection } from './../../redirect.js';
import { getCurrentUser } from './../../login/login.js';



let imagesArray = []; // Array para almacenar las imágenes
let imagesArrayId = []; // Array para almacenar las imágenes
let currentIndex = 0; // Índice actual de la imagen mostrada
const imagesPerPage = 4; // Número de imágenes que se mostrarán por página

document.addEventListener("DOMContentLoaded", async () => {

    // const deleteButton = document.getElementById('delete-button');
    // if (!deleteButton) {
    //     console.error("Delete button not found in the DOM.");
    //     return;
    // }

    const fileButton = document.getElementById('file');
    if (!fileButton) {
        console.error("fileButton not found in the DOM.");
        return;
    }



    fileButton.addEventListener('click', async (event) => {
        //recuperar file-input
        const fileInput = document.getElementById('file-input');
        //recuperar el archivo de fileInput
        const file = fileInput.files[0];

        //miramos si esta vacio
        if (!file) {
            alert("No file selected.");
            return;
        }

        //si lo está, subimos el archivo
        await uploadFile(file);
    });

    // Agregar eventos a los botones de navegación
    document.getElementById('prev-button').addEventListener('click', prevImage);
    document.getElementById('next-button').addEventListener('click', nextImage);

    // Llamamos a la función para cargar los datos al cargar la página
    await loadCharacterData();
    await recoverImage();
    await recoverGallery();
    await isUserCreator();


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

        const user = await recoverUserWithLogId(docSnap.data().owner);
        // console.log("User data:", user);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // console.log("Character data:", data);
            document.getElementById('character-image').href = redirection(`character/character_profile.html?affiliation=${characterAff}&id=${characterName}`);
            // Actualizar los campos en la página con los datos de Firestore
            document.getElementById('character-name').textContent = data.name || 'Unknown Name';

            let linkUser = document.createElement('a');

            //buscar el usuario donde el campo ID del documento sea igual al ID dado
            const q = query(collection(db, 'users'), where('id', '==', data.owner));


            // Ejecutar la consulta
            const querySnapshot = await getDocs(q);

            const userDoc = querySnapshot.docs[0];  // Primer documento
            const documentId = userDoc.id;  // ID del documento en Firestore

            linkUser.href = redirection(`users/user_view.html?id=${documentId}`);

            linkUser.textContent = user.username || 'Unknown owner';
            document.getElementById('character-owner').appendChild(linkUser);

            document.getElementById('affiliation').textContent = data.affiliation || 'Unknown';
            document.getElementById('age').textContent = data.age || 'Unknown';
            document.getElementById('gender').textContent = data.gender || 'Unknown';
            document.getElementById('description').textContent = data.description || 'No description available';
            document.getElementById('story').textContent = data.story || 'No story available';
            document.getElementById('personality').textContent = data.personality || 'No personality available';
            document.getElementById('special-traits').textContent = data.specialTraits || 'No special traits available';
            document.getElementById('extra').textContent = data.extra || 'No extra information available';

            document.getElementById('relations').href = redirection(`relations_character/see_relations.html?affiliation=${characterAff}&id=${characterName}`);
            document.getElementById('stories').href = redirection(`stories/stories_view.html?affiliation=${characterAff}&id=${characterName}`);

            // Llenar la lista de movimientos
            const movesList = document.getElementById('moves-list');
            data.moves.forEach(move => {
                const moveItem = document.createElement('li');
                moveItem.textContent = move;
                movesList.appendChild(moveItem);
            });

        } else {
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document: ", error);
    }
}

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
            const imageElement = document.getElementById('imagen-pokemon');

            if (imageElement) {
                imageElement.src = base64;  // Asigna la cadena Base64 como la fuente de la imagen
                imageElement.alt = `Character ID: ${character_id}, Affiliation: ${affiliation}`;  // Información adicional
            }
        } else {
            console.log("No se encontró el documento con los parámetros proporcionados.");
        }
    } catch (error) {
        console.log("Error al recuperar la imagen:", error.message);
    }
}

async function recoverGallery() {
    //recuperar params

    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');


    try {
        // Realizamos la consulta con los filtros de 'affiliation' y 'character_id'
        const q = query(collection(dbImg, 'gallery'),
            where('affiliation', '==', characterAff),
            where('character_id', '==', characterName));

        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Si se encuentran imágenes, almacenar las imágenes en el array
            querySnapshot.forEach((doc) => {
                const { base64 } = doc.data();
                imagesArray.push(base64);
                imagesArrayId.push(doc.id);

            });
            console.log("Images found for this character:", imagesArray);

            // Mostrar la primera imagen en el carrusel
            showImage(currentIndex);
        } else {
            console.log("No images found for this character.");
            //elimina load
            const loadDiv = document.getElementById('load');
            if (loadDiv) {
                loadDiv.remove();
            }

            //crea un div con 'no results'
            const noResultsDiv = document.createElement('div');
            noResultsDiv.setAttribute('id', 'no-results');
            noResultsDiv.textContent = 'No results';

            document.getElementById('gallery-images').appendChild(noResultsDiv);

            //deshabilitar las flechas de prev y next
            const prevButton = document.getElementById('prev-button');
            const nextButton = document.getElementById('next-button');

            prevButton.disabled = true;
            nextButton.disabled = true;

            prevButton.style.cursor = 'not-allowed';
            nextButton.style.cursor = 'not-allowed';

            prevButton.style.opacity = '0.5';
            nextButton.style.opacity = '0.5';
        }
    } catch (error) {
        console.log("Error al recuperar la imagen:", error.message);
    }
}

async function uploadFile(file) {
    // Deshabilitar elementos de entrada durante la carga
    const fileInput = document.getElementById('file');
    const fileContainer = document.getElementById('file-input');
    fileInput.disabled = true;
    fileInput.style.pointerEvents = 'none';
    fileContainer.disabled = true;

    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');
    let base64String = null;

    try {
        // Intentar convertir a Base64
        base64String = await fileToBase64(file);

        // Intentar guardar en Firestore
        const docRef = await addDoc(collection(dbImg, 'gallery'), {
            character_id: characterName,
            affiliation: characterAff,
            base64: base64String,
        });

        if (docRef) {
            // Redireccionar en caso de éxito
            window.location.href = redirection(
                `character/character_view.html?affiliation=${characterAff}&id=${characterName}`
            );
        } else {
            throw new Error('Unknown error while uploading the image.');
        }
    } catch (error) {
        // Capturar y manejar errores
        alert(`Error uploading the image: ${error.message}`);
        console.error('Upload error:', error);
    } finally {
        // Rehabilitar los elementos, independientemente del resultado
        fileInput.disabled = false;
        fileInput.style.pointerEvents = 'all';
        fileContainer.removeAttribute('disabled');
    }
}

//si salen los botones o no
async function isUserCreator() {
    let editButton = document.getElementById('edit-button');
    let deleteButton = document.getElementById('delete-button');
    let file = document.getElementById('file');
    let file_input = document.getElementById('file-input');


    //recuperar el usuario
    const userLoged = await getCurrentUser();
    if (userLoged == null) {
        editButton.classList.add('d-none');
        deleteButton.classList.add('d-none');
        file.classList.add('d-none');
        file_input.classList.add('d-none');
        return;
    }

    //recuperar el oc
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



        // console.log("User data:", user);
        if (docSnap.exists()) {
            const data = docSnap.data();

            // si es el mismo, sacar los botones
            if ((data.owner == userLoged.uid || userLoged.uid == 'EQOEICzeFeRqiTafa4C2JtQals92') && userLoged != null) {
                document.getElementById('edit-button').onclick = () => {
                    window.location.href = redirection(`character/character_edit.html?affiliation=${characterAff}&id=${characterName}`);
                    // window.location.href = `./character_edit.html?affiliation=${characterAff}&id=${characterName}`;
                };


                deleteButton.addEventListener('click', async () => {
                    // Verificar el estado de autenticación

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

                        window.location.href = redirection('home.html');

                        // window.location.href = `/home.html`;
                    } catch (error) {
                        console.error("Error deleting character:", error);
                        alert("Failed to delete the character. Please try again.");
                    }
                });



            }
            else {
                console.log('no');
                editButton.classList.add('d-none');
                deleteButton.classList.add('d-none');
                file.classList.add('d-none');
                file_input.classList.add('d-none');
            }



        }
    } catch (error) {
        console.log('user not logged');
        editButton.classList.add('d-none');
        deleteButton.classList.add('d-none');
    }


}

//CARRUSEL
async function showImage(index) {

    const urlParams = new URLSearchParams(window.location.search);
    const characterName = urlParams.get('id');
    const characterAff = urlParams.get('affiliation');


    const userLoged = await getCurrentUser();

    const characterRef = doc(db, characterAff, characterName); // Suponiendo que los personajes están en la colección 'neutral'
    const docSnap = await getDoc(characterRef);




    const galleryContainer = document.getElementById('gallery-images');
    galleryContainer.innerHTML = ''; // Limpiar el contenedor de imágenes

    if (imagesArray.length > 0) {
        // Mostrar 4 imágenes a la vez
        for (let i = index; i < index + 4 && i < imagesArray.length; i++) {
            // Crear el contenedor para la imagen y los botones
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('gallery-item');  // Añadimos la clase para el estilo

            // Crear el elemento de imagen
            const imgElement = document.createElement('img');
            imgElement.src = imagesArray[i];
            imgElement.alt = `Image ${i + 1}`;

            // Ajustar el tamaño de cada imagen para que quepan 4 imágenes por fila

            // Crear el overlay con los botones
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');  // Clase para el fondo oscuro y la superposición de los botones

            // Crear el botón "See" (ver)
            const seeButton = document.createElement('button');
            seeButton.classList.add('see-button');
            seeButton.textContent = 'See';  // Botón "Ver"
            seeButton.onclick = () => showModal(imgElement.src);  // Mostrar imagen en la modal

            // Crear el botón "Delete" (eliminar)
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.textContent = 'Delete';  // Botón "Eliminar"

            // console.log("User data:", user);
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                if (userLoged == null) {
                    deleteButton.classList.add('d-none');
                }
                else if (data.owner == userLoged.uid || userLoged.uid == 'EQOEICzeFeRqiTafa4C2JtQals92') {
                    deleteButton.onclick = () => deleteImage(i);  // Eliminar la imagen (lógica por implementar)
                }
                else{
                    deleteButton.classList.add('d-none');
                }
            }


            // Añadir los botones al contenedor overlay
            overlay.appendChild(seeButton);
            overlay.appendChild(deleteButton);

            // Agregar la imagen y el overlay al contenedor principal
            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(overlay);

            // Añadir la imagen a la galería
            galleryContainer.appendChild(imageContainer);
        }

        // Eliminar el div 'load' si existe
        const loadDiv = document.getElementById('load');
        if (loadDiv) {
            loadDiv.remove();
        }

        // Actualizar los botones de navegación
        updateNavigationButtons();
    }
}


// Actualizar los botones de navegación para habilitar/deshabilitar
function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    const maxIndex = Math.ceil(imagesArray.length / imagesPerPage) - 1; // Número máximo de páginas (índices de lotes)

    prevButton.disabled = currentIndex === 0; // Deshabilitar el botón 'Previous' si estamos en la primera página
    nextButton.disabled = currentIndex >= maxIndex; // Deshabilitar el botón 'Next' si estamos en la última página
}

// Función para navegar hacia atrás en el carrusel
function prevImage() {
    if (currentIndex > 0) {
        currentIndex--; // Retrocedemos una "página" de imágenes
        showImage(currentIndex * imagesPerPage); // Mostramos el conjunto correspondiente
    }
}

// Función para navegar hacia adelante en el carrusel
function nextImage() {
    const maxIndex = Math.ceil(imagesArray.length / imagesPerPage) - 1; // Número máximo de páginas (índices de lotes)

    if (currentIndex < maxIndex) {
        currentIndex++; // Avanzamos una "página" de imágenes
        showImage(currentIndex * imagesPerPage); // Mostramos el conjunto correspondiente
    }
}

// Función para mostrar la imagen en la modal
// Función para mostrar la imagen en la modal
function showModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    modal.style.display = 'block';
    modalImage.src = imageSrc;

    // Cerrar la modal al hacer clic en la 'X'
    const closeModal = document.querySelector('.close');
    closeModal.onclick = () => {
        modal.style.display = 'none';
    };
}

// Función para eliminar la imagen
async function deleteImage(index) {

    //recuperamos el id de la array
    const id = imagesArrayId[index];

    //eliminar de la ddbb
    await deleteDoc(doc(dbImg, "gallery", id));

    //recargar la web
    window.location.reload();
}


// AUXILIARES
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}




