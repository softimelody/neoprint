import { useState, useEffect } from 'react';

export default function Footer() {
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    // Sincronizar tema si cambia en otra pestaña
    useEffect(() => {
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <footer className={`relative z-10 border-t backdrop-blur-xl pt-16 pb-8 transition-colors duration-700 mt-auto ${
            isAero ? 'bg-white/60 border-white/80 text-slate-600' : 'bg-slate-950/80 border-slate-800 text-slate-400'
        }`}>
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Columna 1 */}
                    <div className="md:col-span-1">
                        <div className={`text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r mb-4 ${isAero ? 'from-blue-600 to-emerald-500' : 'from-cyan-400 to-fuchsia-500'}`}>NeoPrint.</div>
                        <p className={`text-sm font-medium ${isAero ? 'text-slate-500' : 'text-slate-400'}`}>Transformando arte digital en merch de alta calidad.</p>
                    </div>
                    {/* Columna 2 */}
                    <div>
                        <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Plataforma</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className={`text-sm font-semibold transition ${isAero ? 'hover:text-blue-600' : 'hover:text-cyan-400'}`}>Términos</a></li>
                            <li><a href="#" className={`text-sm font-semibold transition ${isAero ? 'hover:text-blue-600' : 'hover:text-cyan-400'}`}>Privacidad</a></li>
                        </ul>
                    </div>
                    {/* Columna 3 */}
                    <div>
                        <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Conecta</h4>
                        <a href="https://instagram.com/chocofranm" target="_blank" rel="noreferrer" className={`text-sm font-semibold ${isAero ? 'hover:text-pink-600' : 'hover:text-fuchsia-400'}`}>@chocofranm</a>
                    </div>
                    {/* Columna 4 */}
                    <div>
                        <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Visual</h4>
                        <button onClick={() => { 
                            const newTheme = isAero ? 'cyberpunk' : 'frutiger';
                            setTheme(newTheme);
                            localStorage.setItem('neoprint-theme', newTheme);
                            window.dispatchEvent(new Event('storage')); // Notificar a otros componentes
                        }} className={`w-full px-4 py-2 rounded-xl font-black text-xs ${isAero ? 'bg-blue-500 text-white' : 'bg-slate-800 text-cyan-400'}`}>
                            {isAero ? '🌌 Cambiar a Cyberpunk' : '🐬 Cambiar a Frutiger'}
                        </button>
                    </div>
                </div>
                {/* Copyright */}
                <div className={`pt-8 border-t flex justify-between ${isAero ? 'border-blue-200' : 'border-slate-800'}`}>
                    <div className="text-sm font-bold">© {new Date().getFullYear()} NeoPrint.</div>
                    <div className="text-sm font-medium">Hecho ❤️ por <a href="https://github.com/softimelody" target="_blank" className="font-bold text-fuchsia-400 hover:underline">@Softimelody</a></div>
                </div>
            </div>
        </footer>
    );
}