import { useState, useEffect } from 'react';

export default function AddItemForm({ onSave, initialData, onCancel }) {
    const defaultData = {
        brand: 'GST 3D',
        material: 'PLA',
        color: '',
        colorHex: '#3b82f6', // default blue-500
        weight: 1000,
        imageUrl: '',
    };

    const [formData, setFormData] = useState(defaultData);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData(defaultData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        if (!initialData) {
            setFormData(defaultData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                <select
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                >
                    <option value="GST 3D">GST 3D</option>
                    <option value="BAMBU">BAMBU</option>
                    <option value="WINKLE">WINKLE</option>
                    <option value="SMARTFIL">SMARTFIL</option>
                    <option value="ELEGOO">ELEGOO</option>
                    <option value="FORMFUTURA">FORMFUTURA</option>
                    <option value="I3D TESTER">I3D TESTER</option>
                    <option value="GEEETECH">GEEETECH</option>
                    <option value="PRINT A LOT">PRINT A LOT</option>
                    <option value="DESCONOCIDO">DESCONOCIDO</option>
                    <option value="PRUSAMENT">PRUSAMENT</option>
                    <option value="FILAMENTUM">FILAMENTUM</option>
                    <option value="LOCTATREE">LOCTATREE</option>
                    <option value="BQ">BQ</option>
                    <option value="GIANTARM">GIANTARM</option>
                    <option value="OTRA">OTRA</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
                    <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    >
                        <option value="PLA">PLA</option>
                        <option value="PLA+">PLA+</option>
                        <option value="PETG">PETG</option>
                        <option value="ABS">ABS</option>
                        <option value="TPU">TPU</option>
                        <option value="ASA">ASA</option>
                        <option value="Nylon">Nylon</option>
                        <option value="Wood">Wood</option>
                        <option value="Silk">Silk</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Peso (g)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                        placeholder="ej. Negro Mate"
                        required
                    />
                    <div className="relative">
                        <input
                            type="color"
                            name="colorHex"
                            className="h-10 w-10 rounded cursor-pointer bg-transparent border-none p-0 opacity-0 absolute inset-0"
                            value={formData.colorHex}
                            onChange={handleChange}
                        />
                        <div
                            className="h-10 w-10 rounded border border-slate-300 shadow-sm"
                            style={{ backgroundColor: formData.colorHex }}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Imagen (URL) <span className="text-slate-400 font-normal text-xs">(Opcional)</span></label>
                <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    placeholder="https://ejemplo.com/foto-filamento.jpg"
                />
            </div>

            <div className="flex gap-2">
                {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-lg shadow transition"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    className={`flex-1 bg-gradient-to-r ${initialData ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'} text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 active:translate-y-0`}
                >
                    {initialData ? 'Actualizar Filamento' : 'Añadir al Inventario'}
                </button>
            </div>
        </form>
    );
}
