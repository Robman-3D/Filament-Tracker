import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCiiZT-inx1Euhl7CKgUuiz1CcDY9j6vls",
    authDomain: "robman-3d.firebaseapp.com",
    projectId: "robman-3d",
    storageBucket: "robman-3d.firebasestorage.app",
    messagingSenderId: "1042718222091",
    appId: "1:1042718222091:web:0855ca0c62a09b143d640e",
    measurementId: "G-G5W81DE2CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
