import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';
import { recoverProfileFromCharacterId } from '../../common.js';



document.addEventListener("DOMContentLoaded", async () => {
    // Recuperar la URL
    const urlParams = new URLSearchParams(window.location.search);
    const relationId = urlParams.get('relation_id');

    const docRef = doc(db, 'relations', relationId);
    let info = null;

    // Recuperar documento relation
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            info = docSnap;
        } else {
            console.error("No se encontró el documento");
            return; // Si no se encuentra la relación, detendremos el flujo
        }
    } catch (error) {
        console.error("Error al obtener el documento:", error);
        return;
    }

    // Recuperar personajes de las colecciones
    const neutralDoc = collection(db, 'neutral');
    const protDoc = collection(db, 'protector');
    const rebDoc = collection(db, 'rebel');

    // Obtener todos los documentos de las colecciones
    const neutralSnapshot = await getDocs(neutralDoc);
    const protSnapshot = await getDocs(protDoc);
    const rebSnapshot = await getDocs(rebDoc);

    // Inicializar variables para los personajes
    let char1 = null;
    let char2 = null;

    // Función que buscará a los personajes en las colecciones
    const findCharacter = (snapshot, characterId) => {
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (doc.id === characterId) {
                return data;
            }
        }
        return null;
    };

    // Buscar en cada colección (neutral, protector, rebel)
    char1 = findCharacter(neutralSnapshot, info.data().character_1) ||
        findCharacter(protSnapshot, info.data().character_1) ||
        findCharacter(rebSnapshot, info.data().character_1);

    char2 = findCharacter(neutralSnapshot, info.data().character_2) ||
        findCharacter(protSnapshot, info.data().character_2) ||
        findCharacter(rebSnapshot, info.data().character_2);

    // Verificar si ambos personajes fueron encontrados y asignar los valores
    if (char1 && char2) {
        document.getElementById("character").innerHTML = char1.name;
        let img1=await recoverProfileFromCharacterId(info.data().character_1);
        document.getElementById('character_image').src = img1 ? img1.base64 : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s';

        document.getElementById("character_2").innerHTML = char2.name;
        let img2=await recoverProfileFromCharacterId(info.data().character_2);
        document.getElementById('character_image2').src = img2 ? img2.base64 : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNNLEL-qmmLeFR1nxJuepFOgPYfnwHR56vcw&s';

        document.getElementById("relation").value = info.data().relation;
    }


    //ACTUALIZAR
    document.getElementById('update').addEventListener('click', async function () {
        //recuperar campo textarea
        const textarea = document.getElementById('relation').value;

        //crear objeto
        const data = {
            relation: textarea,
            character_1: info.data().character_1,
            character_2: info.data().character_2
        };
        //actualizar en la base de datos
        await updateDoc(doc(db, "relations", relationId), data);
        //redireccionar a la pagina principal
        window.location.href = redirection(`relations_character/see_relations.html?affiliation=${char1.affiliation}&id=${info.data().character_1}`);
    });


    //eliminar
    document.getElementById('delete').addEventListener('click', async function () {
        await deleteDoc(doc(db, "relations", relationId));
        window.location.href = redirection(`relations_character/see_relations.html?affiliation=${char1.affiliation}&id=${info.data().character_1}`);
    });
});
