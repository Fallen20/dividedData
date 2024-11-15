import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js'

// // Add Firebase products that you want to use
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js'
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js'


const firebaseConfig = {
    apiKey: "AIzaSyCpfrz0pcvtaWEUOW4E5lrVcxgmIU8wtek",
    authDomain: "information-side-84e3d.firebaseapp.com",
    databaseURL: "https://information-side-84e3d-default-rtdb.firebaseio.com",
    projectId: "information-side-84e3d",
    storageBucket: "information-side-84e3d.firebasestorage.app",
    messagingSenderId: "21470524553",
    appId: "1:21470524553:web:b404b21155bb5d2cb44258"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//acceder a la base de datos
export const db = getFirestore(app);

//auth para users
export const auth = getAuth(app);

// const response = await fetch('/data.json');
// const config = await response.json();

// // Inicializar Firebase
// export const app = initializeApp(config);

// // Obtener la referencia de Firestore
// export const db = getFirestore(app);
// export const auth = getAuth(app);

// // return { app, db };

