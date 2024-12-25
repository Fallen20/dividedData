import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";
import { redirection } from './../../redirect.js';

document.addEventListener("DOMContentLoaded", async () => {

    async function recoverStories() {
        // Recuperar la URL
        const urlParams = new URLSearchParams(window.location.search);
        const characterId = urlParams.get('id');

        //buscar en la ddbb de stories
        const collectionRef = collection(db, "stories");

        const q = query(collectionRef, where("character", "==", characterId));

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            noRelation();
        } else {
            console.log('siii');
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




});
