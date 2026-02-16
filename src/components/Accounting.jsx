import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { TrendingUp, TrendingDown, Euro, Trash2, Calendar, User, Edit2, Search, Filter, X } from 'lucide-react';

export default function Accounting() {
    const [transactions, setTransactions] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null); // ID of transaction being edited

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [formData, setFormData] = useState({
        concept: '',
        amount: '',
        type: 'income',
        date: new Date().toISOString().split('T')[0],
        client: ''
    });

    // Subscribe to real-time updates for Transactions AND Clients
    useEffect(() => {
        // Transactions
        const qTrx = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
        const unsubscribeTrx = onSnapshot(qTrx, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort by date desc
            docs.sort((a, b) => {
                const dateA = a.date || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString().split('T')[0] : '');
                const dateB = b.date || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString().split('T')[0] : '');
                return dateB.localeCompare(dateA);
            });

            setTransactions(docs);
            setLoading(false);
        }, (error) => console.error(error));

        // Clients
        const qClients = query(collection(db, 'clients'), orderBy('name', 'asc'));
        const unsubscribeClients = onSnapshot(qClients, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(docs);
        });

        return () => {
            unsubscribeTrx();
            unsubscribeClients();
        };
    }, []);

    // --- FILTER LOGIC ---
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch =
            (t.concept && t.concept.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.client && t.client.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStart = startDate ? t.date >= startDate : true;
        const matchesEnd = endDate ? t.date <= endDate : true;

        return matchesSearch && matchesStart && matchesEnd;
    });

    // --- DYNAMIC TOTALS ---
    const totalBalance = filteredTransactions.reduce((acc, curr) => {
        return curr.type === 'income' ? acc + Number(curr.amount) : acc - Number(curr.amount);
    }, 0);

    const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.concept || !formData.amount || !formData.date) return;

        try {
            if (editingId) {
                // Update existing transaction
                await updateDoc(doc(db, 'transactions', editingId), {
                    concept: formData.concept,
                    amount: Number(formData.amount),
                    type: formData.type,
                    date: formData.date,
                    client: formData.client || '',
                    updatedAt: serverTimestamp()
                });
                setEditingId(null);
            } else {
                // Add new transaction
                await addDoc(collection(db, 'transactions'), {
                    concept: formData.concept,
                    amount: Number(formData.amount),
                    type: formData.type,
                    date: formData.date,
                    client: formData.client || '',
                    createdAt: serverTimestamp()
                });
            }

            // Reset form completely on save
            setFormData({
                concept: '',
                amount: '',
                type: 'income',
                date: new Date().toISOString().split('T')[0],
                client: ''
            });

        } catch (e) {
            console.error("Error saving transaction: ", e);
            alert("Error saving transaction");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar este movimiento?")) return;
        try {
            await deleteDoc(doc(db, 'transactions', id));
            if (editingId === id) {
                setEditingId(null);
                setFormData({ concept: '', amount: '', type: 'income', date: new Date().toISOString().split('T')[0], client: '' });
            }
        } catch (e) {
            console.error("Error deleting: ", e);
        }
    }

    const handleEdit = (t) => {
        setEditingId(t.id);
        setFormData({
            concept: t.concept,
            amount: t.amount,
            type: t.type,
            date: t.date || '',
            client: t.client || ''
        });
        // Optional: Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const clearFilters = () => {
        setSearchTerm('');
        setStartDate('');
        setEndDate('');
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }


    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in p-4">
            <header className="mb-8">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent">
                    Contabilidad
                </h1>
                <p className="text-emerald-100/80">Control de gastos e ingresos</p>
            </header>

            {/* Summary Cards (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Euro size={24} />
                        </div>
                        <h3 className="text-slate-500 font-semibold">Balance {searchTerm || startDate || endDate ? '(Filtrado)' : ''}</h3>
                    </div>
                    <p className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                        {totalBalance.toFixed(2)}€
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-slate-500 font-semibold">Ingresos</h3>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">
                        +{totalIncome.toFixed(2)}€
                    </p>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                            <TrendingDown size={24} />
                        </div>
                        <h3 className="text-slate-500 font-semibold">Gastos</h3>
                    </div>
                    <p className="text-3xl font-bold text-red-500">
                        -{totalExpense.toFixed(2)}€
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Transactions List with Filters */}
                <section className="lg:col-span-2 space-y-4">
                    {/* Search & Filters Bar */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-1/3">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar concepto o cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                <span className="text-xs text-slate-400 uppercase font-bold">Desde</span>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent text-sm text-slate-700 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                <span className="text-xs text-slate-400 uppercase font-bold">Hasta</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent text-sm text-slate-700 focus:outline-none"
                                />
                            </div>
                        </div>

                        {(searchTerm || startDate || endDate) && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition"
                            >
                                <X size={16} /> Limpiar
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 min-h-[500px]">
                        <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b border-slate-200 pb-2">
                            Movimientos {filteredTransactions.length !== transactions.length ? `(${filteredTransactions.length})` : ''}
                        </h2>

                        {loading ? (
                            <p className="text-center text-slate-500 mt-10">Cargando movimientos...</p>
                        ) : filteredTransactions.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-slate-400 italic">No hay movimientos que coincidan.</p>
                                {(searchTerm || startDate || endDate) && <p className="text-sm text-blue-400 mt-2 cursor-pointer hover:underline" onClick={clearFilters}>Limpiar filtros</p>}
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredTransactions.map(t => (
                                    <div key={t.id} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white rounded-lg border shadow-sm hover:shadow-md transition group gap-2 ${editingId === t.id ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-100'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-full mt-1 ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{t.concept}</h4>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        <span>{formatDate(t.date)}</span>
                                                    </div>
                                                    {t.client && (
                                                        <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                            <User size={14} />
                                                            <span className="font-medium">{t.client}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pl-14 sm:pl-0">
                                            <span className={`font-bold text-xl ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{Number(t.amount).toFixed(2)}€
                                            </span>
                                            <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition">
                                                <button
                                                    onClick={() => handleEdit(t)}
                                                    className="text-slate-300 hover:text-blue-500 transition"
                                                    title="Editar"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="text-slate-300 hover:text-red-400 transition"
                                                    title="Borrar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Add/Edit Transaction Form */}
                <section className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit sticky top-8">
                    <h2 className="text-xl font-semibold mb-4 text-slate-800">
                        {editingId ? 'Editar Movimiento' : 'Registrar Movimiento'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Movimiento</label>
                            <div className="grid grid-cols-2 gap-2">
                                {/* Swapped Buttons: Income LEFT, Expense RIGHT */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'income' })}
                                    className={`py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${formData.type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <TrendingUp size={18} /> Ingreso
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: 'expense' })}
                                    className={`py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${formData.type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    <TrendingDown size={18} /> Gasto
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente / Proveedor</label>
                            <select
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                            >
                                <option value="">-- Seleccionar Contacto --</option>
                                {clients.map(client => (
                                    <option key={client.id} value={`${client.name} ${client.surname || ''}`.trim()}>
                                        {client.name} {client.surname}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">¿No aparece? Añado en la pestaña Clientes.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Concepto</label>
                            <input
                                type="text"
                                value={formData.concept}
                                onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
                                placeholder={formData.type === 'expense' ? "ej. Compra rollos PLA" : "ej. Venta figura dragón"}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Importe (€)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-4 ${formData.type === 'income'
                                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
                                }`}
                        >
                            {editingId ? 'Guardar Cambios' : (formData.type === 'income' ? 'Registrar Ingreso' : 'Registrar Gasto')}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingId(null);
                                    setFormData({ concept: '', amount: '', type: 'income', date: new Date().toISOString().split('T')[0], client: '' });
                                }}
                                className="w-full font-medium py-2 px-4 rounded-lg text-slate-500 hover:bg-slate-100 transition mt-2"
                            >
                                Cancelar Edición
                            </button>
                        )}
                    </form>
                </section>
            </div>
        </div>
    );
}
