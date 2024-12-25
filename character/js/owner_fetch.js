import { db } from "../../inicializarFB.js";
import { getCurrentUser } from "../../login/login.js";
import { getAllUsers } from "./../../users/user_recover.js";
import { addDoc, collection, query, where, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'

// document.addEventListener("DOMContentLoaded", () => {
//     const input = document.getElementById("owner");
//     const resultsContainer = document.getElementById("autocomplete-results");

//     input.addEventListener("input", async (event) => {
//         const query = event.target.value.toLowerCase();  // Obtén el texto escrito por el usuario
//         if (query) {
//             const users = await getAllUsers();  // Obtén todos los usuarios
//             const matchingUsers = getMatchingUsers(query, users);  // Filtra los usuarios que coinciden

//             // Si hay coincidencias, las mostramos
//             if (matchingUsers.length > 0) {
//                 displayResults(matchingUsers);
//             } else {
//                 // Si no hay coincidencias, mostrar "NULL"
//                 displayResults([]);
//             }
//         } else {
//             resultsContainer.style.display = "none";  // Si no hay texto, ocultamos los resultados
//         }
//     });

//     // Función para filtrar los usuarios que coinciden con la consulta
//     function getMatchingUsers(query, users) {
//         const matchingUsers = [];
//         // Buscar coincidencias en las iniciales o nombres de los usuarios
//         Object.values(users).forEach(userGroup => {
//             userGroup.forEach(user => {
//                 if (user.username.toLowerCase().includes(query)) {
//                     matchingUsers.push(user);
//                 }
//             });
//         });

//         return matchingUsers;
//     }

//     // Función para mostrar los resultados en la interfaz
//     function displayResults(users) {
//         resultsContainer.innerHTML = "";  // Limpiar los resultados anteriores
//         resultsContainer.style.display = "block";  // Mostrar la lista de resultados

//         // Crear los elementos de los usuarios para mostrar
//         users.forEach(user => {
//             const div = document.createElement("div");
//             div.textContent = user.username;
//             div.addEventListener("click", () => {

//                 input.value = user.username;  // Establecer el valor del input al nombre seleccionado
//                 document.getElementById('owner_hidden').value = user.id;
//                 resultsContainer.style.display = "none";  // Ocultar los resultados al seleccionar
//             });
//             resultsContainer.appendChild(div);
//         });
//     }
// });

document.addEventListener("DOMContentLoaded", async () => {

    //recuperar el owner
    const input = document.getElementById("owner");

    //recuperar el usuario logeado
    const userLog = await getCurrentUser();

    //recuperar de la tabla USERS donde user.id=userlog.uid
    const collectionRef = collection(db, 'users');

    const nameQuery = query(collectionRef, where("id", "==", userLog.uid));
    const querySnapshot = await getDocs(nameQuery);

    if (!querySnapshot.empty) {
        // Si existe, modificar el nombre del personaje para evitar duplicados
        console.log('yes');

        input.value = querySnapshot.docs[0].data().username;
    }
});