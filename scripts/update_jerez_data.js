import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const NEW_JEREZ_DATA = [
    { dia: "DOM", cofradia: "Borriquita", seccion: "Cristo", tunica: "Blanca", capirote: "Azul Rey Seda", capa: "Blanca", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Blanco Seda", capa: "Blanca", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "Transporte", seccion: "Ambas", tunica: "Blanca", capirote: "Negro Seda", capa: "Blanca", cordon: "Blanco", botones: "Sin botones" },
    { dia: "", cofradia: "Coronación", seccion: "Ambas", tunica: "Blanca", capirote: "Negro Seda", capa: "Negro Seda", cordon: "Blanco", botones: "Sin botones" },
    { dia: "LUN", cofradia: "Candelaria", seccion: "Ambas", tunica: "Blanca", capirote: "Azul Marino Seda", capa: "Blanca", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "La Cena", seccion: "Ambas", tunica: "Blanca", capirote: "Rojo Granate Seda", capa: "Blanca", cordon: "Granate", botones: "Sin botones" },
    { dia: "", cofradia: "Paz de Fátima", seccion: "Cristo", tunica: "Blanca", capirote: "Blanco Seda", capa: "Rojo Carmín", cordon: "Rojo", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Blanco Seda", capa: "Azul Marino", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "La Sed", seccion: "Cristo", tunica: "Blanca", capirote: "Azul Turquesa Seda", capa: "Blanca", cordon: "Turquesa", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Blanco Seda", capa: "Blanca", cordon: "Turquesa", botones: "Sin botones" },
    { dia: "", cofradia: "Amor y Sacrificio", seccion: "Ambas", tunica: "Negro Mate", capirote: "Faraona Negra", capa: "Sin capa", cordon: "Sisal", botones: "No lleva" },
    { dia: "MAR", cofradia: "Defensión", seccion: "Ambas", tunica: "Morado Nazareno", capirote: "Morado Nazareno", capa: "Sin capa", cordon: "Esparto", botones: "Sin botones" },
    { dia: "", cofradia: "El Amor", seccion: "Ambas", tunica: "Blanco Roto", capirote: "Blanco Roto", capa: "Sin capa", cordon: "Blanco", botones: "Sin botones" },
    { dia: "", cofradia: "Desconsuelo", seccion: "Ambas", tunica: "Granate Seda", capirote: "Granate Seda", capa: "Blanca", cordon: "Granate", botones: "Sin botones" },
    { dia: "MIÉ", cofradia: "Soberano Poder", seccion: "Cristo", tunica: "Blanca", capirote: "Rojo Carmín Seda", capa: "Blanca", cordon: "Rojo", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Blanco Seda", capa: "Blanca", cordon: "Rojo", botones: "Sin botones" },
    { dia: "", cofradia: "Consuelo", seccion: "Cristo", tunica: "Blanca", capirote: "Rojo Granate Seda", capa: "Blanca", cordon: "Granate", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Azul Marino Seda", capa: "Blanca", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "Prendimiento", seccion: "Ambas", tunica: "Blanca", capirote: "Rojo Carmín Seda", capa: "Blanca", cordon: "Rojo", botones: "Sin botones" },
    { dia: "", cofradia: "Amargura", seccion: "Cristo", tunica: "Blanca", capirote: "Azul Marino Seda", capa: "Azul Marino Seda", cordon: "Blanco", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Blanco Seda", capa: "Azul Marino Seda", cordon: "Blanco", botones: "Sin botones" },
    { dia: "JUE", cofradia: "Redención", seccion: "Cristo", tunica: "Blanca", capirote: "Azul Marino Seda", capa: "Blanca", cordon: "Azul", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanca", capirote: "Rojo Granate Seda", capa: "Blanca", cordon: "Granate", botones: "Sin botones" },
    { dia: "", cofradia: "Vera Cruz", seccion: "Ambas", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Esparto", botones: "Sin botones" },
    { dia: "", cofradia: "Oración Huerto", seccion: "Ambas", tunica: "Negro Seda", capirote: "Negro Seda", capa: "Blanca", cordon: "Blanco", botones: "Sin botones" },
    { dia: "MAD", cofradia: "Santo Crucifijo", seccion: "Ambas", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Esparto", botones: "Sin botones" },
    { dia: "", cofradia: "El Nazareno", seccion: "Ambas", tunica: "Morado Nazareno", capirote: "Morado Nazareno", capa: "Sin capa", cordon: "Esparto", botones: "Sin botones" },
    { dia: "", cofradia: "La Yedra", seccion: "Ambas", tunica: "Blanca", capirote: "Verde Esmeralda Seda", capa: "Blanca", cordon: "Verde", botones: "Sin botones" },
    { dia: "VIE", cofradia: "Expiración", seccion: "Ambas", tunica: "Negro Mate", capirote: "Morado Seda", capa: "Sin capa", cordon: "Morado", botones: "Sin botones" },
    { dia: "", cofradia: "Soledad", seccion: "Ambas", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Negro Mate", cordon: "Negro", botones: "Sin botones" },
    { dia: "SÁB", cofradia: "Piedad", seccion: "Ambas", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Negro Seda", cordon: "Negro", botones: "Sin botones" },
    { dia: "SÁB", cofradia: "Santa Marta", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" }

];

async function updateJerezData() {
    console.log("Searching for products with 'Jerez' data...");

    try {
        const productsRef = collection(db, 'product_specs');
        const snapshot = await getDocs(productsRef);

        let count = 0;

        for (const docSnap of snapshot.docs) {
            const product = docSnap.data();

            // Check if this product has a color table that looks like the old Jerez one
            // or explicitly has tableName 'Jerez'
            if (product.tableName === 'Jerez' || (product.colorTable && product.colorTable.length > 0 && product.colorTable[0].cofradia === "Borriquita")) {

                console.log(`Updating product: ${product.name}`);

                await updateDoc(doc(db, 'product_specs', docSnap.id), {
                    colorTable: NEW_JEREZ_DATA,
                    tableName: 'Jerez',
                    notes: (product.notes || '') + '\n\n[Sistema] Tabla Jerez actualizada automáticamente.'
                });

                count++;
            }
        }

        console.log(`Updated ${count} products.`);

    } catch (error) {
        console.error("Error updating projects:", error);
    }
}

updateJerezData();
