import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'
import { db } from "../../inicializarFB.js";

document.addEventListener("DOMContentLoaded", () => {
    //recuperar todas los docs de la coleccion 'consent'
    const collectionRef = collection(db, "consent");
    getDocs(collectionRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            //crear un div
            const div = document.createElement("div");

            //estilo
            div.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mb-2');
            //otro div
            const div2 = document.createElement("div");
            div2.textContent = data.username;
            div2.style.width = '400px';
            div2.classList.add('py-2', 'fw-bold');
            //un boton
            const button = document.createElement("button");
            button.textContent = "Delete";
            //añadir  data-bs-toggle="modal" y  data-bs-target="#exampleModal"
            button.setAttribute("data-bs-toggle", "modal");
            button.setAttribute("data-bs-target", "#exampleModal");

            button.addEventListener("click", async () => {

                document.getElementById('consent_name').innerHTML = data.username;

                const deleteButton = document.getElementById("delete_button");  // Botón de eliminar
                deleteButton.setAttribute("data-doc-id", doc.id);
                //borrar doc
                // await deleteDoc(doc.ref);
                //refrescar pag
                // location.reload();
            });


            button.classList.add('btn', 'btn-danger');

            //darle al div padre los hijis
            div.appendChild(div2);
            div.appendChild(button);
            //darle al div del docuhtml
            document.getElementById('consent').appendChild(div);

        });
    });

    document.getElementById("delete_button").addEventListener("click", async function () {
        try {
            // Obtén el ID del documento desde el atributo `data-doc-id`
            const docId = document.getElementById("delete_button").getAttribute("data-doc-id");

            // Asegúrate de que `docId` tiene un valor válido
            if (!docId) {
                console.error("Error: docId no está definido o es inválido");
                return;
            }

            // Crea una referencia al documento en la colección "consent"
            const docRef = doc(db, "consent", docId); // Esto genera la referencia correcta.

            // Borra el documento usando la referencia
            await deleteDoc(docRef);

            // Recarga la página para reflejar los cambios
            console.log(`Documento con ID ${docId} eliminado correctamente.`);
            location.reload();
        } catch (error) {
            // Manejo de errores
            console.error("Error al eliminar el documento:", error);
        }
    });


});