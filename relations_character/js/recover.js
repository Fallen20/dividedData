import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';

document.addEventListener("DOMContentLoaded", () => {
    // Recuperar la URL
    const urlParams = new URLSearchParams(window.location.search);
    const characterId = urlParams.get('id');
    const affiliation = urlParams.get('affiliation');

    // Recuperar el documento directamente usando el ID
    const docRef = doc(db, affiliation, characterId);
    let characterData = null;
    getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            characterData = docSnap.data();
            document.getElementById("character").innerHTML = characterData.name;
        } else {
            console.error("No se encontró el documento");
        }
    }).catch((error) => {
        console.error("Error al obtener el documento:", error);
    });

    //recuperar de la coleccion 'relations' donde el id sea igual a character_main
    const collectionRef = collection(db, "relations");

    const q = query(collectionRef, where("character_1", "==", characterId));

    //si no tiene, sacar console-log de 'no tiene'
    getDocs(q).then(async (querySnapshot) => {
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            console.log(doc.data());

            // Ahora hay que buscar el documento donde el id sea igual a doc.data().character_2
            const char2 = await findCharacterInCollections(doc.data().character_2);
            console.log(char2.name);


            const container = document.createElement('div');
            container.classList.add('d-flex', 'row');

            // Crear la primera columna (imagen y nombre del personaje)
            const col1 = document.createElement('div');
            col1.classList.add('col-3');

            const img1 = document.createElement('img');
            img1.src = "https://f2.toyhou.se/file/f2-toyhou-se/images/86355128_RwkZ5uwi4Ta1NDG.png";
            img1.alt = "";
            img1.style.width = '200px';
            img1.classList.add('img-fluid');

            const characterName1 = document.createElement('div');
            const characterSpan = document.createElement('span');
            characterSpan.innerHTML = characterData.name;
            characterName1.appendChild(characterSpan);

            col1.appendChild(img1);
            col1.appendChild(characterName1);

            // Crear la segunda columna (relación y textarea)
            const col2 = document.createElement('div');
            col2.classList.add('col-6', 'd-flex', 'flex-column');

            const relationTitle = document.createElement('div');
            relationTitle.innerHTML = "What " + characterData.name + " thinks of " + char2.name + "?";

            const textarea = document.createElement('div');
            textarea.classList.add('border', 'p-2');
            textarea.style.borderRadius = '20px';
            textarea.innerHTML = doc.data().relation;
            textarea.style.height = '150px';

            var button = document.createElement("a");
            button.classList.add("btn", "btn-primary", "w-50", "mx-auto", "mt-3");
            button.innerHTML = "Update Relation";
            button.href =redirection(`relations_character/edit_relation.html?relation_id=${doc.id}`);


            col2.appendChild(relationTitle);
            col2.appendChild(textarea);
            col2.appendChild(button);

            // Crear la tercera columna (imagen y select)
            const col3 = document.createElement('div');
            col3.classList.add('col-3');

            const img2 = document.createElement('img');
            img2.src = "https://f2.toyhou.se/file/f2-toyhou-se/images/92350266_b7mRNpOsCxFaK9K.png";
            img2.alt = "";
            img2.style.width = '200px';
            img2.classList.add('img-fluid');


            const characterName2 = document.createElement('div');
            const characterSpan2 = document.createElement('span');
            characterSpan2.innerHTML = char2.name;
            characterName2.appendChild(characterSpan2);
            

            col3.appendChild(img2);
            col3.appendChild(characterName2);

            // Agregar todas las columnas al contenedor principal
            container.appendChild(col1);
            container.appendChild(col2);
            container.appendChild(col3);

            // Agregar el contenedor principal al cuerpo del documento
            document.getElementById('relations').appendChild(container);


        }
        else {
            noRelation();
        }
    });




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

    // Definir las colecciones que vas a buscar
    const collections = ['neutral', 'protector', 'rebel'];

    // Función para buscar en las colecciones
    const findCharacterInCollections = async (characterId) => {
        for (let collectionName of collections) {
            const collectionRef = collection(db, collectionName); // Referencia a la colección
            const querySnapshot = await getDocs(collectionRef); // Obtener todos los documentos de la colección

            for (let doc of querySnapshot.docs) {
                if (doc.id === characterId) { // Compara el ID del documento con character_2
                    const data = doc.data();
                    return data; // Retorna los datos del personaje
                }
            }
        }
        return null; // Si no se encuentra el personaje, retorna null
    };


});
