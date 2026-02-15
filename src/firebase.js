import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBzBscG7LtPDhwZowI-AhqvgS0LIFUnm4s",
    authDomain: "robman-3d-cb6a2.firebaseapp.com",
    projectId: "robman-3d-cb6a2",
    storageBucket: "robman-3d-cb6a2.firebasestorage.app",
    messagingSenderId: "653759941380",
    appId: "1:653759941380:web:d59a2064b60d7a7fbf1e51",
    measurementId: "G-W585CFQB3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
