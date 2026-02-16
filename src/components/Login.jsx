import { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function Login({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Contraseña simple harcodeada como acordamos
        if (password === 'jerez0000velez') {
            onLogin();
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen bg-[#000597] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-600/20 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-600/20 blur-[100px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/30">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenido/a</h1>
                    <p className="text-blue-200 text-center">Introduce la contraseña de acceso</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(false); }}
                            placeholder="Contraseña"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-center tracking-widest text-lg"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center font-medium animate-shake">
                            Contraseña incorrecta, inténtalo de nuevo.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                    >
                        Entrar
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    );
}
