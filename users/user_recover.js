// Importar módulos necesarios de Firebase Firestore
import { db } from "../inicializarFB.js";
import { where, collection, getDocs, query, orderBy, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";
import { redirection } from './../redirect.js';

// Función para recuperar todos los usuarios
export async function getAllUsers() {

    console.log('allUser');
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("username")); // Ordenar por 'username'
    const users = {};

    try {
        const querySnapshot = await getDocs(q);

        if(querySnapshot.empty){
            return null;
        }

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
        console.log('bbbb');

        console.error("Error recuperando usuarios:", error);
    }
}

// Función para recuperar y renderizar usuarios
async function fetchAndRenderUsers() {
    console.log('fetchAndRenderUsers');
    const users = await getAllUsers();  // Usamos 'await' para esperar la promesa y obtener los usuarios

    if (!users) {
        document.getElementById('results').innerHTML = 'No users found.';
        return;
    }  // Si no hay usuarios, no renderizamos nada

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
                window.location.href = redirection(`users/user_view.html?id=${user.id}`);
                // window.location.href = `/users/user_view.html?id=${user.id}`;  // Pasar el ID del documento
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
    console.log('recoverUserWithId');

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


export async function recoverUserWithLogId(id) {
    console.log('recoverUserWithLogId ->', id);

    try {
        //buscar donde el campo ID del documento sea igual al ID dado

        const q = query(collection(db, 'users'), where('id', '==', id));

        
        // Ejecutar la consulta
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].data();
        } else {
            console.log("No se encontró el documento con los parámetros proporcionados.");
        }



        // const userSnap = await getDoc(userRef);

        // if (userSnap.exists()) {
        //     const userData = userSnap.data();
        //     // console.log("Usuario completo:", userData); // Aquí tienes toda la información del usuario
        //     return userData;

        // } else {
        //     console.error("No se encontró el usuario.");
        // }
    } catch (error) {
        console.error("Error recuperando los datos del usuario:", error);
    }
}