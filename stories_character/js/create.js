import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';
import { getCurrentUser } from '../../login/login.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('create').addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');
        const affiliation = urlParams.get('affiliation');

        const userLoged = await getCurrentUser();
        
        //si has llegado aqui es eres el creador del personaje

        //crear el obj de subida
        const data = {
          'character': characterId,
          'text': document.getElementById('story').value,
          'title': document.getElementById('title').value
        };

        //subirlo
        const docRef = await addDoc(collection(db, "story"), data);

        //cuando se ha subido, redirigir al use
        window.location.href = redirection(`stories_character/stories_view.html?affiliation=${affiliation}&id=${characterId}`);
    });
});