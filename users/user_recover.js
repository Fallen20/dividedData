// Importar módulos necesarios de Firebase Firestore
import { db } from "../inicializarFB.js";
import { collection, getDocs, query, orderBy, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Función para recuperar todos los usuarios
export async function getAllUsers() {

    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("username")); // Ordenar por 'username'
    const users = {};

    try {
        const querySnapshot = await getDocs(q);

        // Agrupar los usuarios por inicial
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const initial = data.username[0].toUpperCase();

            if (!users[initial]) {
                users[initial] = [];
            }
            users[initial].push({ username: data.username, id: doc.id });
        });

        return users;  // Devolver los usuarios organizados por inicial

    } catch (error) {
        console.error("Error recuperando usuarios:", error);
    }
}

// Función para recuperar y renderizar usuarios
async function fetchAndRenderUsers() {
    const users = await getAllUsers();  // Usamos 'await' para esperar la promesa y obtener los usuarios

    if (!users) return;  // Si no hay usuarios, no renderizamos nada

    document.getElementById('results').innerHTML = ''; // Limpiar los resultados antes de cargar nuevos datos

    const container = document.createElement("div");
    container.classList.add("user-list");

    // Ordenar las claves alfabéticamente (por letra)
    Object.keys(users).sort().forEach(letter => {
        const letterHeader = document.createElement("h2");
        letterHeader.textContent = letter;
        container.appendChild(letterHeader);

        const divider = document.createElement("div");
        divider.style.borderBottom = "1px solid #ddd";
        divider.style.marginBottom = "1rem";
        container.appendChild(divider);

        // Agregar los usuarios debajo de cada letra
        users[letter].forEach(user => {
            const userItem = document.createElement("div");
            userItem.textContent = `- ${user.username}`;
            //hacerlo clikable
            userItem.style.cursor = 'pointer';

            userItem.addEventListener('click', async () => {
                //   const idUser= await recoverUserWithId(user.id);
                // Redirigir al usuario a la vista del usuario
                window.location.href = `/users/user_view.html?id=${user.id}`;  // Pasar el ID del documento
            });

            container.appendChild(userItem);
        });
    });

    document.getElementById("results").appendChild(container);  // Agregar el contenido al contenedor de resultados
}

// Listener para el evento click en botones con data-action="load-users"
document.addEventListener("click", (event) => {
    const action = event.target.getAttribute("data-action");
    if (action === "load-users") {
        fetchAndRenderUsers();  // Llama a la función de recuperación y renderizado
    }
});

export async function recoverUserWithId(id) {
    try {
        // Ahora usamos el ID del documento en lugar del username
        const userRef = doc(db, "users", id);  // Buscar por el ID del documento
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            // console.log("Usuario completo:", userData); // Aquí tienes toda la información del usuario
            return userData;

        } else {
            console.error("No se encontró el usuario.");
        }
    } catch (error) {
        console.error("Error recuperando los datos del usuario:", error);
    }
}