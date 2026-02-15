export default function InventoryList({ items }) {
    if (items.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                <p>No filaments found.</p>
                <p className="text-sm">Add one to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="bg-white rounded-lg p-4 border border-yellow-100 hover:border-yellow-300 transition group shadow-sm"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 className="font-semibold text-lg text-yellow-900">{item.brand}</h3>
                            <div className="flex items-center gap-2 text-sm text-yellow-600">
                                <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-600 text-xs font-medium">
                                    {item.material}
                                </span>
                                <div className="flex items-center gap-1">
                                    {item.colorHex && (
                                        <div
                                            className="w-3 h-3 rounded-full border border-yellow-200"
                                            style={{ backgroundColor: item.colorHex }}
                                        />
                                    )}
                                    <span>{item.color}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-yellow-900">{item.weight}g</span>
                            <p className="text-xs text-yellow-400">remaining</p>
                        </div>
                    </div>

                    {/* Visual Weight Indicator */}
                    <div className="w-full bg-yellow-100 rounded-full h-2.5 mt-2 overflow-hidden">
                        <div
                            className={`h-2.5 rounded-full ${item.weight < 200 ? 'bg-red-400' :
                                item.weight < 500 ? 'bg-orange-400' : 'bg-green-400'
                                }`}
                            style={{ width: `${Math.min((item.weight / 1000) * 100, 100)}%` }}
                        ></div>
                    </div>

                    <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-xs text-yellow-400 hover:text-yellow-600 mr-3">Edit</button>
                        <button
                            onClick={() => onDelete(item.id)}
                            className="text-xs text-red-400 hover:text-red-600"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
