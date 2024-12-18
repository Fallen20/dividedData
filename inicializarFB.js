import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js';

// Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js';

// Configuración de Firebase para la base de datos de información
const firebaseConfig = {
    apiKey: "AIzaSyCpfrz0pcvtaWEUOW4E5lrVcxgmIU8wtek",
    authDomain: "information-side-84e3d.firebaseapp.com",
    databaseURL: "https://information-side-84e3d-default-rtdb.firebaseio.com",
    projectId: "information-side-84e3d",
    storageBucket: "information-side-84e3d.firebasestorage.app",
    messagingSenderId: "21470524553",
    appId: "1:21470524553:web:b404b21155bb5d2cb44258"
};

// Configuración de Firebase para la base de datos de imágenes
const firebaseConfigImg = {
    apiKey: "AIzaSyBGo28VOkGnITIppAm_E8SCFepuzMFoOd4",
    authDomain: "image-side.firebaseapp.com",
    projectId: "image-side",
    storageBucket: "image-side.firebasestorage.app",
    messagingSenderId: "546313084693",
    appId: "1:546313084693:web:104c00bd27be63967d531c"
};

// Inicializar ambas aplicaciones con nombres personalizados
export const app = initializeApp(firebaseConfig, "informationApp"); // Asignando nombre personalizado
export const appImg = initializeApp(firebaseConfigImg, "imageApp"); // Asignando nombre personalizado

// Acceder a las bases de datos correspondientes
export const db = getFirestore(app);
export const dbImg = getFirestore(appImg);

// Auth para ambas aplicaciones
export const auth = getAuth(app);
export const authImg = getAuth(appImg);
