import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Package, Plus, Trash2, Edit2, X, Tag, Palette, Euro, FileText, Search, Table, Upload, Paperclip, File, Image as ImageIcon } from 'lucide-react';

const VELEZ_MALAGA_DATA = [
    { dia: "DOM", cofradia: "Pollinica", seccion: "Ambas", tunica: "Blanco Puro", capirote: "Faraona Blanca", capa: "Sin capa", cordon: "Verde", botones: "Verde" },
    { dia: "MAR", cofradia: "Ecce Homo", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Negro Seda (Brillo)", capa: "Negro Seda", cordon: "Rojo", botones: "Rojo" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanco Puro", capirote: "Blanco Seda (Brillo)", capa: "Blanco Seda", cordon: "Rojo", botones: "Rojo" },
    { dia: "", cofradia: "Dolores", seccion: "Virgen", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Negro", botones: "Negro" },
    { dia: "MIÉ", cofradia: "Huerto", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Morado Seda (Brillo)", capa: "Morado Seda", cordon: "Verde", botones: "Verde" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanco Puro", capirote: "Verde Seda (Brillo)", capa: "Verde Seda", cordon: "Morado", botones: "Morado" },
    { dia: "", cofradia: "Medinaceli", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Morado Seda (Brillo)", capa: "Morado Seda", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanco Puro", capirote: "Blanco Seda (Brillo)", capa: "Blanco Seda", cordon: "Morado", botones: "Morado" },
    { dia: "JUE", cofradia: "Estudiantes", seccion: "Jesús", tunica: "Verde Oscuro", capirote: "Negro Seda (Brillo)", capa: "Sin capa", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "Rico", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Morado Seda (Brillo)", capa: "Morado Seda", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanco Puro", capirote: "Blanco Seda (Brillo)", capa: "Blanco Seda", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "Gran Poder", seccion: "Jesús", tunica: "Morado Seda", capirote: "Morado Seda", capa: "Sin capa", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Azul Marino", capirote: "Azul Marino Seda", capa: "Sin capa", cordon: "Oro", botones: "Sin botones" },
    { dia: "VIE", cofradia: "Amor", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Rojo Carmín Seda", capa: "Rojo Carmín", cordon: "Negro", botones: "Negro" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Blanco Puro", capirote: "Negro Seda (Brillo)", capa: "Negro Seda", cordon: "Rojo", botones: "Rojo" },
    { dia: "", cofradia: "Vigía", seccion: "Jesús", tunica: "Azul Marino", capirote: "Rojo Granate Seda", capa: "Rojo Granate", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "", seccion: "Virgen", tunica: "Azul Marino", capirote: "Blanco Seda (Brillo)", capa: "Blanco Seda", cordon: "Oro", botones: "Sin botones" },
    { dia: "", cofradia: "Piedad", seccion: "Virgen", tunica: "Negro Mate", capirote: "Rojo Granate Seda", capa: "Rojo Granate", cordon: "Negro", botones: "Negro" },
    { dia: "", cofradia: "Sepulcro", seccion: "Ambas", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Negro", botones: "Negro" },
    { dia: "DOM", cofradia: "Resucitado", seccion: "Jesús", tunica: "Blanco Puro", capirote: "Blanco Seda (Brillo)", capa: "Blanco Seda", cordon: "Oro", botones: "Sin botones" },
];

const JEREZ_DATA = [
    { dia: "DOM", cofradia: "Borriquita", seccion: "Única", tunica: "Blanco Puro", capirote: "Azul Rey Seda", capa: "Blanco Puro", cordon: "Cuerda Azul", botones: "Azules" },
    { dia: "DOM", cofradia: "Transporte", seccion: "Única", tunica: "Blanco Puro", capirote: "Negro Seda", capa: "Blanco Puro", cordon: "Cuerda Blanca", botones: "Blancos" },
    { dia: "DOM", cofradia: "Coronación", seccion: "Única", tunica: "Blanco Puro", capirote: "Negro Seda", capa: "Negro Seda", cordon: "Cuerda Blanca", botones: "Negros" },
    { dia: "LUN", cofradia: "Candelaria", seccion: "Única", tunica: "Blanco Puro", capirote: "Azul Marino Seda", capa: "Blanco Puro", cordon: "Cuerda Azul", botones: "Azules" },
    { dia: "LUN", cofradia: "La Cena", seccion: "Única", tunica: "Blanco Puro", capirote: "Rojo Granate Seda", capa: "Blanco Puro", cordon: "Cuerda Granate", botones: "Granates" },
    { dia: "LUN", cofradia: "Paz de Fátima", seccion: "Única", tunica: "Blanco Puro", capirote: "Blanco Seda", capa: "Rojo Carmín", cordon: "Cuerda Roja", botones: "Blancos" },
    { dia: "LUN", cofradia: "Amor y Sacrificio", seccion: "Única", tunica: "Negro Mate", capirote: "Faraona Negra", capa: "Sin capa", cordon: "Cuerda Sisal", botones: "No lleva" },
    { dia: "MAR", cofradia: "Defensión", seccion: "Única", tunica: "Morado Nazareno", capirote: "Morado Nazareno", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Morados" },
    { dia: "MAR", cofradia: "El Amor", seccion: "Única", tunica: "Blanco Roto", capirote: "Blanco Roto", capa: "Sin capa", cordon: "Cuerda Blanca", botones: "Blancos" },
    { dia: "MAR", cofradia: "Desconsuelo", seccion: "Única", tunica: "Rojo Granate Seda", capirote: "Rojo Granate Seda", capa: "Blanco Puro", cordon: "Cuerda Granate", botones: "Granates" },
    { dia: "MIÉ", cofradia: "Soberano Poder", seccion: "Única", tunica: "Blanco Puro", capirote: "Rojo Carmín Seda", capa: "Blanco Puro", cordon: "Cuerda Roja", botones: "Rojos" },
    { dia: "MIÉ", cofradia: "Prendimiento", seccion: "Única", tunica: "Blanco Puro", capirote: "Rojo Carmín Seda", capa: "Blanco Puro", cordon: "Cuerda Roja", botones: "Rojos" },
    { dia: "MIÉ", cofradia: "Amargura", seccion: "Única", tunica: "Blanco Puro", capirote: "Azul Marino Seda", capa: "Azul Marino Seda", cordon: "Cuerda Blanca", botones: "Azules" },
    { dia: "MIÉ", cofradia: "Tres Caídas", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" },
    { dia: "JUE", cofradia: "Vera Cruz", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" },
    { dia: "JUE", cofradia: "Oración Huerto", seccion: "Única", tunica: "Negro Seda", capirote: "Negro Seda", capa: "Blanco Puro", cordon: "Cuerda Blanca", botones: "Negros" },
    { dia: "JUE", cofradia: "Mayor Dolor", seccion: "Única", tunica: "Rojo Granate", capirote: "Rojo Granate", capa: "Sin capa", cordon: "Cuerda Granate", botones: "Granates" },
    { dia: "MAD", cofradia: "Santo Crucifijo", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" },
    { dia: "MAD", cofradia: "El Nazareno", seccion: "Única", tunica: "Morado Nazareno", capirote: "Morado Nazareno", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Morados" },
    { dia: "MAD", cofradia: "La Yedra", seccion: "Única", tunica: "Blanco Puro", capirote: "Verde Esmeralda Seda", capa: "Blanco Puro", cordon: "Cuerda Verde", botones: "Verdes" },
    { dia: "MAD", cofradia: "Buena Muerte", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" },
    { dia: "VIE", cofradia: "Expiración", seccion: "Única", tunica: "Negro Mate", capirote: "Morado Seda", capa: "Sin capa", cordon: "Cuerda Morada", botones: "Morados" },
    { dia: "VIE", cofradia: "Soledad", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Negro Mate", cordon: "Cuerda Negra", botones: "Negros" },
    { dia: "SÁB", cofradia: "Piedad", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Negro Seda", cordon: "Cuerda Negra", botones: "Negros" },
    { dia: "SÁB", cofradia: "Santa Marta", seccion: "Única", tunica: "Negro Mate", capirote: "Negro Mate", capa: "Sin capa", cordon: "Cuerda de Esparto", botones: "Negros" }
];

export default function ProductSpecs() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [movingId, setMovingId] = useState(null); // ID of product being moved
    const [searchTerm, setSearchTerm] = useState('');

    const [currentCategory, setCurrentCategory] = useState(null);
    const [customFolders, setCustomFolders] = useState([]); // Persistent folders from Firestore

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        price: '',
        colors: '',
        notes: '',
        colorTable: null,
        tableName: '',
        attachments: []
    });



    // Subscribe to Persistent Folders
    useEffect(() => {
        const q = query(collection(db, 'project_folders'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const foldersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomFolders(foldersData);
        }, (error) => {
            console.error("Error fetching folders:", error);
        });
        return () => unsubscribe();
    }, []);

    // Subscribe to Product Specs
    useEffect(() => {
        const q = query(collection(db, 'product_specs'), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const createFolder = async () => {
        const folderName = prompt("Nombre del nuevo Proyecto:");
        if (!folderName) return;

        if (customFolders.some(f => f.name.toLowerCase() === folderName.toLowerCase())) {
            alert("Ese proyecto ya existe.");
            return;
        }

        try {
            await addDoc(collection(db, 'project_folders'), {
                name: folderName,
                createdAt: serverTimestamp()
            });
        } catch (e) {
            console.error("Error creating folder:", e);
            alert("Error al crear proyecto.");
        }
    };

    const deleteFolder = async (folderName) => {
        if (!window.confirm(`¿Borrar el proyecto "${folderName}"? (Los catálogos dentro NO se borrarán, solo la carpeta)`)) return;

        const folderDoc = customFolders.find(f => f.name === folderName);
        if (folderDoc) {
            try {
                await deleteDoc(doc(db, 'project_folders', folderDoc.id));
                if (currentCategory === folderName) setCurrentCategory(null);
            } catch (e) {
                console.error("Error deleting folder:", e);
            }
        }
    };

    // --- FOLDER & SEARCH LOGIC ---
    // 1. Get unique folders (Persistent + tags used in products)
    const uniqueCategories = [...new Set([
        ...customFolders.map(f => f.name),
        ...products.map(p => p.category).filter(Boolean)
    ])].sort();

    const folders = uniqueCategories;

    // 2. Filter products based on view (Root vs Folder)
    const getVisibleProducts = () => {
        let filtered = products;

        // If searching, ignore folders and show all matches
        if (searchTerm) {
            return filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Standard Navigation
        if (currentCategory) {
            // Show only items in this category
            return filtered.filter(p => p.category === currentCategory);
        } else {
            // Root View: Show items with NO category (orphans)
            return filtered.filter(p => !p.category);
        }
    };

    const visibleProducts = getVisibleProducts();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            if (editingId) {
                await updateDoc(doc(db, 'product_specs', editingId), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'product_specs'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }

            setFormData({ name: '', description: '', price: '', colors: '', notes: '', colorTable: null, attachments: [] });
            setIsFormOpen(false);
        } catch (e) {
            console.error("Error saving product: ", e);
            alert("Error saving product");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar esta ficha de producto?")) return;
        try {
            await deleteDoc(doc(db, 'product_specs', id));
            if (editingId === id) {
                setEditingId(null);
                setFormData({ name: '', description: '', price: '', colors: '', notes: '', colorTable: null, attachments: [] });
            }
        } catch (e) {
            console.error("Error deleting: ", e);
        }
    }

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            category: product.category || '',
            description: product.description || '',
            price: product.price || '',
            colors: product.colors || '',
            notes: product.notes || '',
            colorTable: product.colorTable || null,
            tableName: product.tableName || (product.colorTable ? 'Vélez-Málaga' : ''),
            attachments: product.attachments || []
        });
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Universal File Upload Handler
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 1. Check for HTML Table (Vélez-Málaga detector)
        if (file.type === 'text/html' || file.name.endsWith('.html')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');

                // --- DETECTOR 1: VÉLEZ-MÁLAGA (Check basic keywords) ---
                if (text.includes("Pollinica") && text.includes("TÚNICA") && text.includes("SECCIÓN")) {
                    if (window.confirm("Detectada Tabla de Cofradías (Vélez-Málaga). ¿Importar datos?")) {
                        setFormData(prev => ({
                            ...prev,
                            colorTable: VELEZ_MALAGA_DATA,
                            notes: prev.notes + (prev.notes ? '\n\n' : '') + `Tabla importada: Vélez-Málaga`
                        }));
                        return;
                    }
                }

                // --- DETECTOR 2: JEREZ (Google Sheets Export Style) ---
                // Header check: DÍA, COFRADÍA, TÚNICA... CINTURÓN
                const table = doc.querySelector('table');
                if (table) {
                    const rows = Array.from(table.rows);
                    const firstRowText = rows[0]?.innerText || "";
                    const secondRowText = rows[1]?.innerText || ""; // Sometimes header is row 1 or 2

                    if (firstRowText.includes("CINTURÓN") || secondRowText.includes("CINTURÓN")) {
                        if (window.confirm("Detectada Tabla de Cofradías (Jerez/Genérica). ¿Importar datos?")) {
                            const parsedData = [];
                            let lastDia = "";

                            // Retrieve all rows (skipping potential header rows)
                            // Assuming data starts after the row containing "DÍA"
                            let dataStarted = false;

                            for (let i = 0; i < rows.length; i++) {
                                const rowText = rows[i].innerText;
                                if (!dataStarted) {
                                    if (rowText.includes("DÍA") && rowText.includes("COFRADÍA")) {
                                        dataStarted = true;
                                    }
                                    continue;
                                }

                                const cells = rows[i].cells;
                                if (cells.length < 5) continue; // Skip empty rows

                                // Extract text from cells (Google Sheets HTML is specific)
                                const getText = (cell) => cell ? cell.innerText.trim() : "";

                                // Column Mapping based on observed Jerez format:
                                // 0: DÍA, 1: COFRADÍA, 2: TÚNICA, 3: CAPIROTE, 4: CAPA, 5: CINTURÓN, 6: BOTONES
                                let dia = getText(cells[0]);
                                if (dia) lastDia = dia;
                                else dia = lastDia; // Fill down

                                const cofradia = getText(cells[1]);
                                if (!cofradia) continue; // Skip if no cofradia

                                parsedData.push({
                                    dia: dia,
                                    cofradia: cofradia,
                                    seccion: "Única", // Default for Jerez
                                    tunica: getText(cells[2]),
                                    capirote: getText(cells[3]),
                                    capa: getText(cells[4]),
                                    cordon: getText(cells[5]), // Map Cinturón -> Cordon
                                    botones: getText(cells[6])
                                });
                            }

                            if (parsedData.length > 0) {
                                setFormData(prev => ({
                                    ...prev,
                                    colorTable: parsedData,
                                    notes: prev.notes + (prev.notes ? '\n\n' : '') + `Tabla importada: ${file.name}`
                                }));
                                return;
                            }
                        }
                    }
                }

                // Fallback
                alert("Archivo HTML leído. No se detectó una estructura de tabla conocida (Vélez/Jerez). Se adjuntará como archivo.");
            };
            reader.readAsText(file);
        }

        // 2. Universal Attachment (Base64) - Limit size > 500KB
        if (file.size > 500 * 1024) {
            alert("El archivo es demasiado grande (>500KB). Firebase Firestore tiene límites estrictos. Por favor, reduce el tamaño.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            setFormData(prev => ({
                ...prev,
                attachments: [...prev.attachments, {
                    name: file.name,
                    type: file.type,
                    dataUrl: base64,
                    uploadedAt: new Date().toISOString()
                }]
            }));
        };
        reader.readAsDataURL(file);
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    }

    const removeTable = () => {
        if (window.confirm("¿Quitar la tabla de colores de esta ficha?")) {
            setFormData(prev => ({ ...prev, colorTable: null }));
        }
    };

    return (
        <div className="w-full animate-fade-in p-4">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                        Catálogo / Proyectos
                    </h1>
                    <p className="text-purple-100/80">Fichas técnicas de productos</p>
                </div>
                <button
                    onClick={() => {
                        if (isFormOpen && editingId) {
                            setEditingId(null);
                            // If currently in a category, default to it
                            setFormData({ name: '', category: currentCategory || '', description: '', price: '', colors: '', notes: '', colorTable: null, tableName: '', attachments: [] });
                        } else if (!isFormOpen) {
                            // Opening fresh form
                            setFormData({ name: '', category: currentCategory || '', description: '', price: '', colors: '', notes: '', colorTable: null, tableName: '', attachments: [] });
                        }
                        setIsFormOpen(!isFormOpen);
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition transform hover:-translate-y-1"
                >
                    {isFormOpen ? 'Cerrar Ficha' : <><Plus size={20} /> {currentCategory ? 'Añadir a Carpeta' : 'Nuevo Producto'}</>}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Product List - Takes up more space now */}
                <section className={`bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 min-h-[500px] transition-all duration-300 ${isFormOpen ? 'lg:col-span-3' : 'lg:col-span-4'}`}>

                    {/* BACK BUTTON (Moved to Header Area) */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-200 pb-4 gap-4">
                        <div className="flex items-center gap-4">
                            {!searchTerm && currentCategory && (
                                <button
                                    onClick={() => setCurrentCategory(null)}
                                    className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-purple-600 transition"
                                    title="Volver a Proyectos"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                </button>
                            )}
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                {currentCategory ? (
                                    <>
                                        <Package className="text-purple-600" size={24} />
                                        {currentCategory}
                                    </>
                                ) : (
                                    'Proyectos / Catálogo'
                                )}
                                <span className="text-slate-400 text-sm font-normal ml-2">({visibleProducts.length})</span>
                            </h2>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-slate-500 mt-10">Cargando catálogo...</p>
                    ) : (
                        <div className={`grid grid-cols-1 gap-6 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar ${isFormOpen ? 'xl:grid-cols-1' : 'xl:grid-cols-2'}`}>

                            {/* CREATE PROJECT BUTTON (Only in Root & No Search) */}
                            {!searchTerm && !currentCategory && (
                                <div
                                    onClick={createFolder}
                                    className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 cursor-pointer transition group min-h-[150px]"
                                >
                                    <div className="bg-white p-3 rounded-full mb-3 shadow-sm group-hover:scale-110 transition">
                                        <Plus size={24} />
                                    </div>
                                    <span className="font-bold text-sm">Nuevo Proyecto</span>
                                </div>
                            )}

                            {/* FOLDER CARDS (Only in Root & No Search) */}
                            {!searchTerm && !currentCategory && folders.map(folder => {
                                const itemCount = products.filter(p => p.category === folder).length;
                                return (
                                    <div
                                        key={folder}
                                        onClick={() => setCurrentCategory(folder)}
                                        className="bg-purple-50 rounded-xl border border-purple-100 p-6 hover:shadow-lg hover:border-purple-300 hover:scale-[1.02] transition cursor-pointer group flex items-center justify-between relative"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="bg-purple-200 text-purple-700 p-3 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                                                <Package size={32} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800 text-xl">{folder}</h3>
                                                <p className="text-sm text-purple-600 font-medium">
                                                    {itemCount} {itemCount === 1 ? 'catálogo' : 'catálogos'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Delete Folder Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteFolder(folder); }}
                                            className="absolute top-4 right-4 p-2 text-purple-300 hover:text-red-500 hover:bg-red-50 rounded-full transition opacity-0 group-hover:opacity-100"
                                            title="Borrar Proyecto"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* PRODUCT CARDS */}
                            {visibleProducts.length === 0 && !loading && !searchTerm && !currentCategory && folders.length === 0 && (
                                <p className="text-center text-slate-400 mt-10 italic col-span-full">No hay productos registrados.</p>
                            )}

                            {visibleProducts.length === 0 && currentCategory && (
                                <p className="text-center text-slate-400 mt-4 italic col-span-full">Carpeta vacía.</p>
                            )}

                            {visibleProducts.map(product => (
                                <div key={product.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-lg transition relative group flex flex-col h-full">

                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setMovingId(product.id); }}
                                            className="p-2 bg-slate-100 rounded-md text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition"
                                            title="Mover a Carpeta"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(product); }}
                                            className="p-2 bg-slate-100 rounded-md text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition"
                                            title="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }}
                                            className="p-2 bg-slate-100 rounded-md text-slate-500 hover:text-red-500 hover:bg-red-50 transition"
                                            title="Borrar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* MOVE MODAL OVERLAY */}
                                    {movingId === product.id && (
                                        <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-4 rounded-xl animate-fade-in text-center" onClick={(e) => e.stopPropagation()}>
                                            <h4 className="font-bold text-slate-800 mb-4">Mover a...</h4>
                                            <div className="grid grid-cols-2 gap-2 w-full mb-4 max-h-40 overflow-y-auto">
                                                <button onClick={() => handleMove(product.id, "")} className="p-2 bg-slate-100 rounded border border-slate-200 text-xs hover:bg-slate-200">
                                                    (Inicio)
                                                </button>
                                                {folders.map(f => (
                                                    <button key={f} onClick={() => handleMove(product.id, f)} className="p-2 bg-purple-50 rounded border border-purple-100 text-xs text-purple-700 hover:bg-purple-100 truncate">
                                                        {f}
                                                    </button>
                                                ))}
                                            </div>
                                            <button onClick={() => setMovingId(null)} className="text-slate-400 hover:text-slate-600 text-xs underline">Cancelar</button>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-start pr-12">
                                            <h3 className="font-bold text-slate-800 text-2xl mb-2">{product.name}</h3>
                                        </div>

                                        {product.price && (
                                            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-4 border border-emerald-100">
                                                <Euro size={14} /> {product.price}
                                            </div>
                                        )}

                                        <div className="space-y-4 text-sm text-slate-600">
                                            {product.colors && (
                                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                                    <Palette size={18} className="text-purple-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="font-bold text-slate-700 block mb-1">Colores / Variantes</span>
                                                        {product.colors}
                                                    </div>
                                                </div>
                                            )}
                                            {product.description && (
                                                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                                    <Tag size={18} className="text-blue-500 mt-0.5 shrink-0" />
                                                    <div>
                                                        <span className="font-bold text-slate-700 block mb-1">Descripción</span>
                                                        <p className="italic">{product.description}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* ATTACHMENTS SECTION */}
                                            {product.attachments && product.attachments.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                                        <Paperclip size={16} className="text-orange-500" /> Adjuntos ({product.attachments.length})
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {product.attachments.map((file, idx) => (
                                                            <a
                                                                key={idx}
                                                                href={file.dataUrl}
                                                                download={file.name}
                                                                className="block p-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-orange-50 hover:border-orange-200 transition group/file"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {file.type.startsWith('image/') ? (
                                                                    <div className="aspect-video w-full rounded-md overflow-hidden bg-white mb-2 relative">
                                                                        <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
                                                                        <div className="absolute inset-0 bg-black/0 group-hover/file:bg-black/10 transition"></div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="aspect-video w-full rounded-md overflow-hidden bg-white mb-2 flex items-center justify-center text-slate-400">
                                                                        <File size={32} />
                                                                    </div>
                                                                )}
                                                                <p className="text-xs font-medium text-slate-700 truncate" title={file.name}>{file.name}</p>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Render Color Table if exists */}
                                            {product.colorTable && (
                                                <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden">
                                                    <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 flex items-center gap-2">
                                                        <Table size={16} className="text-purple-600" />
                                                        <span className="font-bold text-purple-800 text-xs uppercase tracking-wide">
                                                            Tabla de Colores ({product.tableName || 'Vélez-Málaga'})
                                                        </span>
                                                    </div>
                                                    <div className="overflow-x-auto">
                                                        <table className="w-full text-xs text-left">
                                                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                                                <tr>
                                                                    <th className="px-3 py-2">Día</th>
                                                                    <th className="px-3 py-2">Cofradía</th>
                                                                    <th className="px-3 py-2">Sección</th>
                                                                    <th className="px-3 py-2">Túnica</th>
                                                                    <th className="px-3 py-2">Capirote</th>
                                                                    <th className="px-3 py-2">Capa</th>
                                                                    <th className="px-3 py-2">Cordón</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100">
                                                                {product.colorTable.map((row, idx) => (
                                                                    <tr key={idx} className="hover:bg-slate-50/50 even:bg-slate-50/30">
                                                                        <td className="px-3 py-1.5 font-medium text-slate-400">{row.dia}</td>
                                                                        <td className="px-3 py-1.5 font-bold text-slate-700">{row.cofradia}</td>
                                                                        <td className="px-3 py-1.5 text-slate-600">{row.seccion}</td>
                                                                        <td className="px-3 py-1.5 text-slate-600">{row.tunica}</td>
                                                                        <td className="px-3 py-1.5 text-slate-600">{row.capirote}</td>
                                                                        <td className="px-3 py-1.5 text-slate-600">{row.capa}</td>
                                                                        <td className="px-3 py-1.5 text-slate-600">{row.cordon}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            )}

                                            {product.notes && (
                                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mt-3 text-slate-700 text-sm">
                                                    <div className="flex items-center gap-2 font-bold text-yellow-700 mb-2">
                                                        <FileText size={14} /> Notas Técnicas
                                                    </div>
                                                    <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed">{product.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Form - Conditionally shown */}
                {isFormOpen && (
                    <section className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit sticky top-8 animate-slide-in">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            {editingId ? 'Editar Ficha' : 'Nueva Ficha de Produc.'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Producto</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="ej. Llavero Penitente"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría / Carpeta</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="ej. Semana Santa (Dejar vacío para raíz)"
                                        list="category-suggestions"
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm pl-9"
                                    />
                                    <div className="absolute left-3 top-2.5 text-slate-400">
                                        <Package size={16} />
                                    </div>
                                    <datalist id="category-suggestions">
                                        {[...new Set(products.map(p => p.category).filter(Boolean))].map(cat => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Precio de Venta</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="ej. 3.50€"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Colores / Variantes</label>
                                <input
                                    type="text"
                                    name="colors"
                                    value={formData.colors}
                                    onChange={handleChange}
                                    placeholder="ej. Morado, Blanco, Negro..."
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                                />
                            </div>

                            {/* FILE UPLOAD */}
                            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-2">
                                    <Upload size={16} /> Adjuntar Archivos
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        accept=".html,.htm,.jpg,.jpeg,.png,.pdf,.xlsx,.csv,text/*"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="cursor-pointer w-full py-2 px-3 bg-white border border-purple-200 rounded-md text-sm text-purple-600 hover:bg-purple-50 transition flex items-center justify-center gap-2"
                                    >
                                        <Paperclip size={14} /> Seleccionar (HTML, Img, PDF...)
                                    </label>
                                </div>
                                <p className="text-[10px] text-purple-400 mt-1 text-center">Máx 500KB. HTML Vélez detectado auto.</p>

                                {/* Attachments List in Form */}
                                {formData.attachments && formData.attachments.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {formData.attachments.map((file, idx) => (
                                            <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-purple-100 card-shadow-sm">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    {file.type.startsWith('image/') ? <ImageIcon size={14} className="text-blue-400" /> : <File size={14} className="text-slate-400" />}
                                                    <span className="text-xs text-slate-600 truncate max-w-[120px]" title={file.name}>{file.name}</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeAttachment(idx)}
                                                    className="text-red-400 hover:text-red-600"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Show Detected Table Badge */}
                                {formData.colorTable && (
                                    <div className="mt-3 bg-white p-2 rounded border border-green-200 flex justify-between items-center">
                                        <span className="text-xs text-green-700 font-bold flex items-center gap-1">
                                            <Table size={14} /> Tabla: {formData.tableName || 'Cargada'}
                                        </span>
                                        <button type="button" onClick={removeTable} className="text-red-400 hover:text-red-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}

                                {/* Manual Load Buttons */}
                                {!formData.colorTable && (
                                    <div className="mt-4 flex gap-2">
                                        <button type="button" onClick={loadVelezTable} className="flex-1 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-purple-600 transition">
                                            Cargar Vélez
                                        </button>
                                        <button type="button" onClick={loadJerezTable} className="flex-1 py-2 bg-white border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-orange-600 transition">
                                            Cargar Jerez
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción Breve</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="2"
                                    placeholder="Pequeña descripción..."
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ficha Técnica / Notas</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="6"
                                    placeholder="Detalles de impresión, relleno, tiempo..."
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm font-mono text-sm"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                            >
                                {editingId ? 'Guardar Cambios' : 'Guardar Ficha'}
                            </button>
                        </form>
                    </section>
                )}
            </div>
        </div>
    );
}
