import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Briefcase, Calendar, User, DollarSign, Trash2, Plus, Edit2, CheckCircle, Clock, Timer, Package, FileText } from 'lucide-react';

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        client: '',
        status: 'Pendiente',
        price: '',
        deadline: '',
        notes: ''
    });

    const statuses = [
        { value: 'Pendiente', color: 'bg-slate-100 text-slate-600', icon: Clock },
        { value: 'Diseño', color: 'bg-blue-100 text-blue-600', icon: FileText },
        { value: 'Impresión', color: 'bg-amber-100 text-amber-600', icon: PrinterIcon }, // Custom icon helper below
        { value: 'Post-procesado', color: 'bg-purple-100 text-purple-600', icon: Package },
        { value: 'Terminado', color: 'bg-emerald-100 text-emerald-600', icon: CheckCircle },
        { value: 'Entregado', color: 'bg-gray-800 text-white', icon: User }
    ];

    function PrinterIcon({ size, className }) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><path d="M6 14h12v8H6z"></path></svg>
        )
    }

    // Subscribe to Projects and Clients
    useEffect(() => {
        const qProjects = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubProjects = onSnapshot(qProjects, (snapshot) => {
            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });

        const qClients = query(collection(db, 'clients'), orderBy('name', 'asc'));
        const unsubClients = onSnapshot(qClients, (snapshot) => {
            setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubProjects();
            unsubClients();
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            if (editingId) {
                await updateDoc(doc(db, 'projects', editingId), {
                    ...formData,
                    updatedAt: serverTimestamp()
                });
                setEditingId(null);
            } else {
                await addDoc(collection(db, 'projects'), {
                    ...formData,
                    createdAt: serverTimestamp()
                });
            }

            setFormData({
                name: '',
                client: '',
                status: 'Pendiente',
                price: '',
                deadline: '',
                notes: ''
            });
            setIsFormOpen(false);
        } catch (e) {
            console.error("Error saving project: ", e);
            alert("Error saving project");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar este proyecto?")) return;
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (e) {
            console.error("Error deleting: ", e);
        }
    }

    const handleEdit = (project) => {
        setFormData({
            name: project.name,
            client: project.client,
            status: project.status,
            price: project.price,
            deadline: project.deadline,
            notes: project.notes || ''
        });
        setEditingId(project.id);
        setIsFormOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const getStatusInfo = (statusVal) => statuses.find(s => s.value === statusVal) || statuses[0];

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    return (
        <div className="w-full max-w-7xl mx-auto animate-fade-in p-4">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-200 to-white bg-clip-text text-transparent">
                        Encargos
                    </h1>
                    <p className="text-indigo-100/80">Gestión de pedidos 3D</p>
                </div>
                <button
                    onClick={() => {
                        if (isFormOpen && editingId) {
                            setEditingId(null);
                            setFormData({ name: '', client: '', status: 'Pendiente', price: '', deadline: '', notes: '' });
                        }
                        setIsFormOpen(!isFormOpen);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-1"
                >
                    {isFormOpen ? 'Cerrar Panel' : <><Plus size={20} /> Nuevo Encargo</>}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Projects List */}
                <section className={`bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 min-h-[500px] transition-all duration-300 ${isFormOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                    <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b border-slate-200 pb-2">
                        Encargos en curso ({projects.length})
                    </h2>

                    {loading ? (
                        <p className="text-center text-slate-500 mt-10">Cargando encargos...</p>
                    ) : projects.length === 0 ? (
                        <p className="text-center text-slate-400 mt-10 italic">No hay encargos activos.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                            {projects.map(project => {
                                const statusInfo = getStatusInfo(project.status);
                                const StatusIcon = statusInfo.icon;
                                return (
                                    <div key={project.id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition relative group flex flex-col justify-between">
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="text-slate-400 hover:text-blue-500"
                                                title="Editar"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="text-slate-400 hover:text-red-500"
                                                title="Borrar"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-3 ${statusInfo.color}`}>
                                                <StatusIcon size={12} />
                                                {project.status}
                                            </div>
                                            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{project.name}</h3>
                                            {(project.client || project.deadline) && (
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3">
                                                    {project.client && (
                                                        <div className="flex items-center gap-1">
                                                            <User size={14} className="text-blue-400" />
                                                            <span>{project.client}</span>
                                                        </div>
                                                    )}
                                                    {project.deadline && (
                                                        <div className="flex items-center gap-1">
                                                            <Calendar size={14} className={new Date(project.deadline) < new Date() ? 'text-red-400' : 'text-slate-400'} />
                                                            <span className={new Date(project.deadline) < new Date() ? 'text-red-500 font-medium' : ''}>{formatDate(project.deadline)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center mt-2">
                                            <span className="font-bold text-lg text-slate-700">{Number(project.price).toFixed(2)}€</span>
                                            {project.notes && <span className="text-xs text-slate-400 italic max-w-[60%] truncate">{project.notes}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* Form */}
                {isFormOpen && (
                    <section className="lg:col-span-1 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-xl border border-white/20 h-fit sticky top-8 animate-slide-in">
                        <h2 className="text-xl font-semibold mb-4 text-slate-800">
                            {editingId ? 'Editar Encargo' : 'Nuevo Encargo'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Encargo</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="ej. Casco Mandalorian"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                                <select
                                    value={formData.client}
                                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                >
                                    <option value="">-- Seleccionar --</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={`${c.name} ${c.surname || ''}`.trim()}>
                                            {c.name} {c.surname}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Precio (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Entrega</label>
                                    <input
                                        type="date"
                                        value={formData.deadline}
                                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                >
                                    {statuses.map(s => (
                                        <option key={s.value} value={s.value}>{s.value}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="2"
                                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 mt-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white"
                            >
                                {editingId ? 'Guardar Cambios' : 'Crear Encargo'}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingId(null);
                                        setFormData({ name: '', client: '', status: 'Pendiente', price: '', deadline: '', notes: '' });
                                        setIsFormOpen(false);
                                    }}
                                    className="w-full font-medium py-2 px-4 rounded-lg text-slate-500 hover:bg-slate-100 transition"
                                >
                                    Cancelar Edición
                                </button>
                            )}
                        </form>
                    </section>
                )}
            </div>
        </div>
    );
}
