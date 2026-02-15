// Basic test script using v8 SDK or simplified approach if possible, but v9 is modular.
// Node environment might need "type": "module" in package.json to run imports.
// package.json already has "type": "module".

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCiiZT-inx1Euhl7CKgUuiz1CcDY9j6vls",
    authDomain: "robman-3d.firebaseapp.com",
    projectId: "robman-3d",
    storageBucket: "robman-3d.firebasestorage.app",
    messagingSenderId: "1042718222091",
    appId: "1:1042718222091:web:0855ca0c62a09b143d640e",
    measurementId: "G-G5W81DE2CQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Starting test...");

addDoc(collection(db, "test_connectivity"), {
    test: true,
    timestamp: new Date()
}).then(() => {
    console.log("SUCCESS");
    process.exit(0);
}).catch((error) => {
    console.log("ERROR");
    console.log(error.code);
    console.log(error.message);
    process.exit(1);
});
