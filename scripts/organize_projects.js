import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc, query, where, addDoc, serverTimestamp } from "firebase/firestore";

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

async function organizeProjects() {
    console.log("Starting organization...");

    try {
        // 1. Ensure 'Semana Santa' folder exists in 'project_folders'
        const foldersRef = collection(db, 'project_folders');
        const qFolder = query(foldersRef, where("name", "==", "Semana Santa"));
        const folderSnap = await getDocs(qFolder);

        if (folderSnap.empty) {
            console.log("Folder 'Semana Santa' not found. Creating...");
            await addDoc(foldersRef, {
                name: "Semana Santa",
                createdAt: serverTimestamp()
            });
            console.log("Folder created.");
        } else {
            console.log("Folder 'Semana Santa' already exists.");
        }

        // 2. Find products to move
        // Keyword: "Semana Santa" or "Velez" or "Jerez" or "Llavero" (broad search to review)
        // User specifically mentioned "llaveros semana santa velez" and "semana santa jerez"
        const productsRef = collection(db, 'product_specs');
        const snapshot = await getDocs(productsRef);

        let movedCount = 0;

        for (const docSnap of snapshot.docs) {
            const product = docSnap.data();
            const lowerName = product.name.toLowerCase();

            // Logic to identify target projects
            // Matches "semana santa", "vélez", "jerez"
            if (lowerName.includes("semana santa") || lowerName.includes("vélez") || lowerName.includes("jerez")) {

                if (product.category === "Semana Santa") {
                    console.log(`Skipping "${product.name}" (already in folder)`);
                    continue;
                }

                console.log(`Moving "${product.name}" to 'Semana Santa'...`);
                await updateDoc(doc(db, 'product_specs', docSnap.id), {
                    category: "Semana Santa",
                    updatedAt: serverTimestamp()
                });
                movedCount++;
            }
        }

        console.log(`Done! Moved ${movedCount} projects to 'Semana Santa'.`);
        process.exit(0);

    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

organizeProjects();
