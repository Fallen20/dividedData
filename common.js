import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db, dbImg } from "./inicializarFB.js";
import { redirection } from './redirect.js';
import { getCurrentUser } from './login/login.js';




export async function hideCharacterElement(elemento) {
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


export async function recoverProfileFromCharacterId(id) {
    const q = query(
        collection(dbImg, 'profile'),
        where("character_id", "==", id)
    );

    // Ejecutar la consulta
    const docSnap = await getDocs(q);

    if (!docSnap.empty) {
        console.log('recoverProfileFromCharacterId');
        console.log(docSnap.docs[0].data());

        return docSnap.docs[0].data();
    }
    else {
        console.log('recoverProfileFromCharacterId NULL');
        return null;
    }


}