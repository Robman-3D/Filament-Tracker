export default function InventoryList({ items, onDelete, onEdit, onImageClick }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                <p>No se encontraron filamentos.</p>
                <p className="text-sm">¡Añade uno para empezar!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-400 transition group shadow-sm flex gap-4 items-center relative"
                >
                    {/* Large Image / Color Placeholder */}
                    <div
                        className="flex-shrink-0 cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-transform hover:scale-105 border border-slate-100"
                        onClick={() => item.imageUrl && onImageClick(item.imageUrl)}
                    >
                        {item.imageUrl ? (
                            <img
                                src={item.imageUrl}
                                alt={item.brand}
                                className="w-24 h-24 object-cover object-center"
                            />
                        ) : (
                            <div
                                className="w-24 h-24 flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: item.colorHex || '#cbd5e1' }}
                            >
                                {item.color}
                            </div>
                        )}
                    </div>

                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h3 className="font-bold text-xl text-slate-900">{item.brand}</h3>
                                <div className="text-sm text-slate-500 font-medium mb-1">{item.material}</div>
                                <div className="flex items-center gap-2">
                                    {item.colorHex && !item.imageUrl && (
                                        <div
                                            className="w-3 h-3 rounded-full border border-slate-300 shadow-sm"
                                            style={{ backgroundColor: item.colorHex }}
                                        />
                                    )}
                                    <span className="text-slate-700 font-semibold">{item.color}</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-bold text-slate-900 block">{item.weight}g</span>
                                <span className="text-xs text-slate-400 uppercase tracking-wider">Restante</span>
                            </div>
                        </div>

                        {/* Visual Weight Indicator */}
                        <div className="w-full bg-slate-100 rounded-full h-3 mt-3 overflow-hidden border border-slate-200">
                            <div
                                className={`h-3 rounded-full ${item.weight < 200 ? 'bg-red-500' :
                                    item.weight < 500 ? 'bg-orange-400' : 'bg-green-500'
                                    }`}
                                style={{ width: `${Math.min((item.weight / 1000) * 100, 100)}%` }}
                            ></div>
                        </div>


                        <div className="mt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-3">
                            <button
                                onClick={() => onEdit(item)}
                                className="text-sm text-slate-500 hover:text-blue-600 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="text-sm text-red-400 hover:text-red-600 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
                            >
                                Borrar
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
