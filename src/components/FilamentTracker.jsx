import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import InventoryList from './InventoryList';
import AddItemForm from './AddItemForm';
import { Heart, Search } from 'lucide-react';

export default function FilamentTracker() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Search state

    // Subscribe to real-time updates
    useEffect(() => {
        const q = query(collection(db, 'filaments'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const filamentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setItems(filamentsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching filaments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSaveItem = async (itemData) => {
        try {
            if (editingItem) {
                // Update existing item
                const itemRef = doc(db, 'filaments', editingItem.id);
                await updateDoc(itemRef, {
                    ...itemData,
                    updatedAt: serverTimestamp()
                });
                setEditingItem(null);
            } else {
                // Add new item
                await addDoc(collection(db, 'filaments'), {
                    ...itemData,
                    createdAt: serverTimestamp()
                });
            }
        } catch (e) {
            console.error("Error saving document: ", e);
            alert("Error saving item: " + e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this filament?")) return;
        try {
            await deleteDoc(doc(db, 'filaments', id));
            if (editingItem && editingItem.id === id) {
                setEditingItem(null);
            }
        } catch (e) {
            console.error("Error deleting document: ", e);
            alert("Error deleting item.");
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Filter items based on search term
    const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'weightDesc', 'weightAsc'

    // Filter AND Sort items
    const filteredItems = items
        .filter(item =>
            item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.material && item.material.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (sortOrder === 'weightDesc') {
                return (Number(b.weight) || 0) - (Number(a.weight) || 0);
            } else if (sortOrder === 'weightAsc') {
                return (Number(a.weight) || 0) - (Number(b.weight) || 0);
            } else {
                // Default: Newest first (using createdAt provided by Firestore)
                // If createdAt is missing or equal, stable sort
                return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
            }
        });

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in">
            <header className="flex flex-col md:flex-row justify-between items-center py-6 mb-8 px-4 gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                        Gestión de filamentos
                    </h1>
                    <div className="text-sm text-blue-200 font-medium">
                        Inventario Compartido
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-blue-300" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por marca, color o material..."
                        className="block w-full pl-10 pr-3 py-2 border border-blue-400/30 rounded-full leading-5 bg-blue-900/50 text-blue-100 placeholder-blue-300 focus:outline-none focus:bg-blue-900/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent sm:text-sm backdrop-blur-sm transition-all shadow-inner"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Sort Control */}
                <div className="relative w-full md:w-auto min-w-[200px]">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="appearance-none w-full bg-blue-900/50 border border-blue-400/30 text-blue-100 py-2 pl-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer backdrop-blur-sm shadow-inner"
                    >
                        <option value="newest">Más Recientes</option>
                        <option value="weightDesc">Cantidad: Mayor a Menor</option>
                        <option value="weightAsc">Cantidad: Menor a Mayor</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-blue-300">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </header>

            <div className="px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Inventory List - Takes 2 columns on large screens */}
                    <section className="lg:col-span-2 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit min-h-[500px]">
                        <h2 className="text-2xl font-semibold mb-6 text-slate-800 border-b border-slate-200 pb-2 flex justify-between items-center">
                            <span>Filamentos Robman</span>
                            <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                {filteredItems.length} {filteredItems.length === 1 ? 'filamento' : 'filamentos'}
                            </span>
                        </h2>
                        <InventoryList
                            items={filteredItems}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onImageClick={handleImageClick}
                        />
                        {loading && <p className="text-center text-blue-600 mt-2">Sincronizando...</p>}
                    </section>

                    {/* Add Item Form - Takes 1 column */}
                    <section className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit sticky top-8">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            {editingItem ? 'Editar Filamento' : 'Añadir nuevo filamento'}
                        </h2>
                        <AddItemForm
                            onSave={handleSaveItem}
                            initialData={editingItem}
                            onCancel={() => setEditingItem(null)}
                        />
                    </section>
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full flex justify-center">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-red-400 transition"
                        >
                            <Heart className="rotate-45" size={40} fill="currentColor" />
                            <span className="sr-only">Cerrar</span>
                        </button>
                        <img
                            src={selectedImage}
                            alt="Filamento Full Size"
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-4 border-white"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
