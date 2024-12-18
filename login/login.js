// Importar los módulos de Firebase necesarios
import { app, db, auth } from "./../inicializarFB.js";
import { appImg, dbImg, authImg } from "./../inicializarFB.js";
import {
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { redirection } from './../redirect.js';

// Configurar persistencia para mantener al usuario autenticado
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        //si no existe el elemtno login no hagas nada
        if (!document.getElementById('login')) {
            return;
        }
        document.getElementById('login').addEventListener('click', async () => {
            const email = document.getElementById('name').value;
            const password = document.getElementById('password').value;
            await logIn(email, password);
        });
    })
    .catch((error) => {
        console.error("Error setting persistence:", error);
    });

// Función para iniciar sesión
async function logIn(email, password) {
    // console.log("Intentando iniciar sesión con:", email, password);
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Usuario autenticado:", user);

        //si es el admin, hacer login en el firebase2 con las mismas credenciales
        if (user.uid == 'EQOEICzeFeRqiTafa4C2JtQals92') {
            await signInWithEmailAndPassword(authImg, email, password);
            window.location.href = redirection(`character/character_creation.html`);
        }
        else {
            window.location.href = redirection(`character/character_creation.html`);
        }
        // Redirigir a crear.html después del login exitoso

        // window.location.href = "./../character/character_creation.html";
    } catch (error) {
        console.log("Error al iniciar sesión:", error.code, error.message);
    }
}

// Función para cerrar sesión
export function logout() {
    signOut(auth)
        .then(() => {
            console.log("Usuario ha cerrado sesión");
            // window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });

        signOut(authImg)
        .then(() => {
            console.log("Usuario ha cerrado sesión");
            window.location.href = redirection('login/login.html');
            // window.location.href = "login.html";
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
        });
}

// Obtener el usuario autenticado actual
export function getCurrentUser() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            resolve(user || null);  // Devolver el usuario o null si no está autenticado
        });
    });
}
