import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create");


    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        //recuperar datos
        const username = document.getElementById('username').value;
        //checkbox
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        const checkboxGroups = {
            gore: {},
            physicalTrauma: {},
            relationship: {},
            romance: {},
            language: {},
            mentalHealth: {}
        };


        checkboxes.forEach(checkbox => {
            // Verificar si el checkbox está marcado
            if (checkbox.checked) {
                // Dependiendo del grupo al que pertenece el checkbox, se agrega al grupo correspondiente
                if (checkbox.name === "gore") {
                    checkboxGroups.gore[checkbox.id] = true;
                }
                if (checkbox.name === "physical-trauma") {
                    checkboxGroups.physicalTrauma[checkbox.id] = true;
                }
                if (checkbox.name === "relationship") {
                    checkboxGroups.relationship[checkbox.id] = true;
                }
                if (checkbox.name === "romance") {
                    checkboxGroups.romance[checkbox.id] = true;
                }
                if (checkbox.name === "language") {
                    checkboxGroups.language[checkbox.id] = true;
                }
                if (checkbox.name === "mental-health") {
                    checkboxGroups.mentalHealth[checkbox.id] = true;
                }
            }
        });
        //textarea
        const goreNotes = document.querySelector('[name="gore-notes"]').value;
        const physicalTraumaNotes = document.querySelector('[name="physical-trauma-notes"]').value;
        const romanceNotes = document.querySelector('[name="romance-notes"]').value;
        const languageNotes = document.querySelector('[name="language-notes"]').value;
        const mentalHealthNotes = document.querySelector('[name="mental-health-notes"]').value;

        //crear un objeto con los datos
        const consentData = {
            username: username,
            gore_notes: goreNotes,
            physical_trauma_notes: physicalTraumaNotes,
            romance_notes: romanceNotes,
            language_notes: languageNotes,
            mental_health_notes: mentalHealthNotes,
            checkbox_groups: checkboxGroups
        };
        //recuperamos o creamos la coleccion
        const collectionRef = collection(db, 'consent');

        //query para recuperar de la coleccion si hay alguno con el nombre
        const nameQuery = query(collectionRef, where("username", "==", consentData.username));

        //miramos si hay el usuario ya ha metido la info
        const querySnapshot = await getDocs(nameQuery);

        //si ya existe hay que actualizar, si no existe hay que crear
        if (!querySnapshot.empty) {
            //recuperamos el doc
            const docRef = doc(db, "consent", querySnapshot.docs[0].id);
            //lo actualizamos
            await updateDoc(docRef, consentData);
            alert("Consent updated successfully!");
        } else {
            //lo creamos
            await addDoc(collectionRef, consentData);
            alert("Consent created successfully!");
        }

    });


});