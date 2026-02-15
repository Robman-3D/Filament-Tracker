import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import InventoryList from './components/InventoryList';
import AddItemForm from './components/AddItemForm';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleAddItem = async (newItem) => {
    try {
      await addDoc(collection(db, 'filaments'), {
        ...newItem,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Error adding item. Check console.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this filament?")) return;
    try {
      await deleteDoc(doc(db, 'filaments', id));
    } catch (e) {
      console.error("Error deleting document: ", e);
      alert("Error deleting item.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-6 mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Filament Tracker
        </h1>
        <div className="text-sm text-slate-400">
          Shared Inventory
        </div>
      </header>

      <main className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inventory List */}
          <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-purple-300">Your Filaments</h2>
            <InventoryList items={items} onDelete={handleDelete} />
            {loading && <p className="text-center text-slate-500 mt-2">Syncing...</p>}
          </section>

          {/* Add Item Form */}
          <section className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 shadow-xl h-fit">
            <h2 className="text-xl font-semibold mb-4 text-blue-300">Add New Spool</h2>
            <AddItemForm onAdd={handleAddItem} />
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
