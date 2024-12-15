import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";

document.addEventListener("DOMContentLoaded", () => {

    // Recuperar el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    // Buscar en Firebase el documento con ese ID
    const docRef = doc(db, "consent", id);
    getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
            const consentData = docSnapshot.data();
            console.log("Document data:", consentData);

            // Aquí vamos a actualizar el formulario con los datos de Firebase


            // Iteramos sobre los grupos de checkboxes
            const checkboxGroups = consentData.checkbox_groups;

            // Para cada grupo de checkboxes (por ejemplo, "gore", "language", etc.)
            for (const group in checkboxGroups) {
                // Si el grupo existe y tiene checkboxes
                if (checkboxGroups[group]) {
                    // Iteramos sobre las claves dentro de ese grupo (por ejemplo: "small-scars", "blood", etc.)
                    for (const checkbox in checkboxGroups[group]) {
                        // Accedemos al checkbox correspondiente en el HTML
                        const checkboxElement = document.getElementById(checkbox);

                        if (checkboxElement) {
                            // Si existe el checkbox en el HTML, marcamos o desmarcamos según el valor
                            checkboxElement.checked = checkboxGroups[group][checkbox] || false;
                        }
                    }
                }
            }


            document.querySelector('textarea[name="gore-notes"]').value = consentData.gore_notes || '';
            document.querySelector('textarea[name="language-notes"]').value = consentData.language_notes || '';
            document.querySelector('textarea[name="mental-health-notes"]').value = consentData.mental_health_notes || '';
            document.querySelector('textarea[name="physical-trauma-notes"]').value = consentData.physical_trauma_notes || '';
            document.querySelector('textarea[name="relationship-notes"]').value = consentData.relationship_notes || '';
            document.querySelector('textarea[name="romance-notes"]').value = consentData.romance_notes || '';

            document.getElementById('username').innerHTML = consentData.username || 'NOOO';

        } else {
            console.log("No such document!");
        }
    }).catch((error) => {
        console.error("Error getting document:", error);
    });

});