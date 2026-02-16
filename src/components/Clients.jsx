import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, query, orderBy, serverTimestamp, doc, where } from 'firebase/firestore';
import { db } from '../firebase';
import { User, Phone, Mail, MapPin, FileText, Trash2, Plus, ArrowLeft, TrendingUp, TrendingDown, Calendar, Wallet, MessageSquare, Send } from 'lucide-react';

export default function Clients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null); // For Detail View
    const [clientTransactions, setClientTransactions] = useState([]); // For History
    const [clientComments, setClientComments] = useState([]); // For Comments
    const [newComment, setNewComment] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        address: '',
        phone: '',
        email: '',
        notes: ''
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Subscribe to Clients
    useEffect(() => {
        const q = query(collection(db, 'clients'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClients(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching clients:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch Transactions and Comments when a client is selected
    useEffect(() => {
        if (selectedClient) {
            const clientFullName = `${selectedClient.name} ${selectedClient.surname || ''}`.trim();

            // 1. Transactions (By Name)
            const qTrx = query(collection(db, 'transactions'), where('client', '==', clientFullName));
            const unsubTrx = onSnapshot(qTrx, (snapshot) => {
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                docs.sort((a, b) => {
                    const dateA = a.date || (a.createdAt?.toDate ? a.createdAt.toDate().toISOString().split('T')[0] : '');
                    const dateB = b.date || (b.createdAt?.toDate ? b.createdAt.toDate().toISOString().split('T')[0] : '');
                    return dateB.localeCompare(dateA);
                });
                setClientTransactions(docs);
            });

            // 2. Comments (By ID)
            // Note: Removed orderBy to avoid needing a composite index immediately. Sorting client-side.
            const qComments = query(collection(db, 'client_comments'), where('clientId', '==', selectedClient.id));
            const unsubComments = onSnapshot(qComments, (snapshot) => {
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Client-side sort
                docs.sort((a, b) => {
                    const timeA = a.createdAt?.toMillis() || 0;
                    const timeB = b.createdAt?.toMillis() || 0;
                    return timeB - timeA;
                });
                setClientComments(docs);
            });

            return () => {
                unsubTrx();
                unsubComments();
            };
        }
    }, [selectedClient]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            await addDoc(collection(db, 'clients'), {
                ...formData,
                createdAt: serverTimestamp()
            });
            setFormData({
                name: '',
                surname: '',
                address: '',
                phone: '',
                email: '',
                notes: ''
            });
            setIsFormOpen(false);
        } catch (e) {
            console.error("Error adding client: ", e);
            alert("Error adding client");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar este cliente?")) return;
        try {
            await deleteDoc(doc(db, 'clients', id));
            if (selectedClient && selectedClient.id === id) {
                setSelectedClient(null);
            }
        } catch (e) {
            console.error("Error deleting: ", e);
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedClient) return;

        try {
            await addDoc(collection(db, 'client_comments'), {
                clientId: selectedClient.id,
                text: newComment,
                createdAt: serverTimestamp()
            });
            setNewComment('');
        } catch (e) {
            console.error("Error adding comment", e);
        }
    }

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("¿Borrar comentario?")) return;
        try {
            await deleteDoc(doc(db, 'client_comments', commentId));
        } catch (e) { console.error(e) }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const formatDate = (dateString, timestamp) => {
        if (timestamp) {
            return timestamp.toDate().toLocaleDateString() + ' ' + timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    // --- DETAIL VIEW ---
    if (selectedClient) {
        return (
            <div className="w-full max-w-7xl animate-fade-in p-4">
                <button
                    onClick={() => setSelectedClient(null)}
                    className="mb-6 flex items-center gap-2 text-blue-200 hover:text-white transition group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Volver al directorio
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Client Info Card */}
                    <section className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-xl p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="relative z-10 flex flex-col items-center -mt-4">
                                <div className="w-24 h-24 rounded-full bg-white p-2 shadow-lg mb-4">
                                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-3xl">
                                        {selectedClient.name.charAt(0)}{selectedClient.surname ? selectedClient.surname.charAt(0) : ''}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 text-center">{selectedClient.name} {selectedClient.surname}</h2>
                                <p className="text-blue-500 font-medium mb-6">Cliente</p>

                                <div className="w-full space-y-4">
                                    {selectedClient.phone && (
                                        <div className="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-lg">
                                            <Phone size={18} className="text-blue-500" />
                                            <span>{selectedClient.phone}</span>
                                        </div>
                                    )}
                                    {selectedClient.email && (
                                        <div className="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-lg">
                                            <Mail size={18} className="text-blue-500" />
                                            <span className="truncate">{selectedClient.email}</span>
                                        </div>
                                    )}
                                    {selectedClient.address && (
                                        <div className="flex items-center gap-3 text-slate-600 p-3 bg-slate-50 rounded-lg">
                                            <MapPin size={18} className="text-blue-500" />
                                            <span>{selectedClient.address}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-white rounded-xl p-6 shadow-xl border border-slate-100 flex flex-col h-[500px]">
                            <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <MessageSquare className="text-indigo-500" size={20} /> Comentarios / Notas
                            </h3>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 mb-4 pr-2">
                                {clientComments.length === 0 ? (
                                    <p className="text-sm text-slate-400 italic text-center mt-10">No hay comentarios aún.</p>
                                ) : (
                                    clientComments.map(comment => (
                                        <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative group">
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="absolute top-2 right-2 text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                                            <p className="text-[10px] text-slate-400 mt-2 text-right">
                                                {comment.createdAt ? formatDate(null, comment.createdAt) : 'Ahora'}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <form onSubmit={handleAddComment} className="relative">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Escribe un comentario..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                                    disabled={!newComment.trim()}
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Transaction History */}
                    <section className="lg:col-span-2 space-y-6">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Wallet className="text-emerald-400" /> Historial de Movimientos
                            </h3>

                            {clientTransactions.length === 0 ? (
                                <div className="text-center py-12 text-blue-200 bg-blue-900/20 rounded-xl border border-blue-500/20">
                                    <p>No hay movimientos registrados para este cliente.</p>
                                    <p className="text-sm opacity-60 mt-2">Registra pagos en la pestaña Contabilidad asignando este nombre.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {clientTransactions.map(t => (
                                        <div key={t.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                    {t.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{t.concept}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <Calendar size={12} />
                                                        <span>{formatDate(t.date)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                                {t.type === 'income' ? '+' : '-'}{Number(t.amount).toFixed(2)}€
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        )
    }

    // --- LIST VIEW (Default) ---
    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in p-4">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                        Clientes
                    </h1>
                    <p className="text-blue-100/80">Agenda de contactos</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-1"
                >
                    {isFormOpen ? 'Cerrar Formulario' : <><Plus size={20} /> Nuevo Cliente</>}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Clients List */}
                <section className={`bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 min-h-[500px] transition-all duration-300 ${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b border-slate-200 pb-2">
                        Directorio ({clients.length})
                    </h2>

                    {loading ? (
                        <p className="text-center text-slate-500 mt-10">Cargando clientes...</p>
                    ) : clients.length === 0 ? (
                        <p className="text-center text-slate-400 mt-10 italic">No hay clientes registrados.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                            {clients.map(client => (
                                <div key={client.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition relative group flex flex-col justify-between h-full">
                                    <div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                                            className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 z-10"
                                            title="Borrar cliente"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
                                                {client.name.charAt(0)}{client.surname ? client.surname.charAt(0) : ''}
                                            </div>
                                            <div className="overflow-hidden">
                                                <h3 className="font-bold text-slate-800 text-lg leading-tight truncate">{client.name} {client.surname}</h3>
                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Cliente</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm text-slate-600 mb-4">
                                            {client.phone ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} className="text-blue-400" />
                                                    <span>{client.phone}</span>
                                                </div>
                                            ) : <div className="h-5"></div>}

                                            {client.email ? (
                                                <div className="flex items-center gap-2">
                                                    <Mail size={14} className="text-blue-400" />
                                                    <span className="truncate">{client.email}</span>
                                                </div>
                                            ) : <div className="h-5"></div>}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedClient(client)}
                                        className="w-full mt-2 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 font-medium rounded-lg transition border border-slate-200 hover:border-blue-200 text-sm flex items-center justify-center gap-2"
                                    >
                                        <FileText size={16} /> Ver Ficha
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Add Client Form - Conditionally shown */}
                {isFormOpen && (
                    <section className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit sticky top-8 animate-slide-in">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">Nuevo Contacto</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
                                    <input
                                        type="text"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white"
                            >
                                Guardar Contacto
                            </button>
                        </form>
                    </section>
                )}
            </div>
        </div>
    );
}
