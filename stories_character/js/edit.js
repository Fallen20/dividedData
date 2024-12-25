import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';
import { getCurrentUser } from '../../login/login.js';

document.addEventListener('DOMContentLoaded', async () => {
    console.log('aaaa');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const characterId = urlParams.get('characterId');
    const affiliation = urlParams.get('affiliation');

    document.getElementById('edit').addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const characterId = urlParams.get('character');
        const affiliation = urlParams.get('affiliation');

        //si has llegado aqui es eres el creador del personaje

        //crear el obj de subida
        const data = {
            'character': characterId,
            'text': document.getElementById('story').value,
            'title': document.getElementById('title').value
        };

        //mirar si existe con ese id, si lo es actualizarlo, si no crearlo  
        const docRef = doc(db, "story", id);
        await updateDoc(docRef, data);

        //cuando se ha subido, redirigir al use
        window.location.href = redirection(`stories_character/stories_view.html?affiliation=${affiliation}&id=${characterId}`);
    });
    await recover(id);
});
async function recover(id) {
    const docRef = doc(db, "story", id);

    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        document.getElementById('title').value = data.title;
        document.getElementById('story').value = data.text;
    }


}