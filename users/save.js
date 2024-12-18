// Importar módulos necesarios de Firebase
import { db } from "../inicializarFB.js";
import { addDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

// Continuar con el resto del código
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const characterData = {
            username: document.getElementById("username").value.trim(),
            user_discord: document.getElementById("user_discord").value.trim(),
            pronouns: document.getElementById("pronouns").value.trim(),
            timezone: document.getElementById("timezone").options[document.getElementById("timezone").selectedIndex].textContent,
        };

        try {
            // Crear referencia a la colección "users"
            const collectionRef = collection(db, "users");

            // Guardar los datos en Firestore, dejando que Firestore genere un ID único
            const docRef = await addDoc(collectionRef, characterData);

            console.log("Usuario guardado con éxito con ID:", docRef.id);
            window.location.href = redirection(`users/user_view.html?id=${docRef.id}`);
            // alert("Usuario guardado con éxito!");
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
        }
    });
});
