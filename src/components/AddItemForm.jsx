import { useState } from 'react';

export default function AddItemForm({ onAdd }) {
    const [formData, setFormData] = useState({
        brand: '',
        material: 'PLA',
        color: '',
        colorHex: '#3b82f6', // default blue-500
        weight: 1000,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({ brand: '', material: 'PLA', color: '', colorHex: '#3b82f6', weight: 1000 });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Brand</label>
                <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full bg-white border border-pink-200 rounded-lg px-4 py-2 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                    placeholder="e.g. Anycubic"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-pink-700 mb-1">Material</label>
                    <select
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        className="w-full bg-white border border-pink-200 rounded-lg px-4 py-2 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
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
                    <label className="block text-sm font-medium text-pink-700 mb-1">Weight (g)</label>
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full bg-white border border-pink-200 rounded-lg px-4 py-2 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-pink-700 mb-1">Color</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full bg-white border border-pink-200 rounded-lg px-4 py-2 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                        placeholder="e.g. Matte Black"
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
                            className="h-10 w-10 rounded border border-pink-200 shadow-sm"
                            style={{ backgroundColor: formData.colorHex }}
                        />
                    </div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
                Add to Inventory
            </button>
        </form>
    );
}
