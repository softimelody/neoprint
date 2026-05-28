import { useState, useEffect } from 'react';

export default function ToastManager() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        // Esta función escucha cada vez que alguien pide mostrar un toast
        const handleAddToast = (e) => {
            const newToast = {
                id: Date.now(),
                message: e.detail.message,
                type: e.detail.type || 'success' // puede ser 'success' o 'error'
            };
            
            // Añadimos el toast a la lista
            setToasts((prev) => [...prev, newToast]);

            // Lo destruimos automáticamente después de 3.5 segundos
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
            }, 3500);
        };

        // Ponemos a nuestra app a escuchar el evento personalizado
        window.addEventListener('show-toast', handleAddToast);
        return () => window.removeEventListener('show-toast', handleAddToast);
    }, []);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => (
                <div 
                    key={toast.id} 
                    className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl border transform transition-all duration-300 animate-fade-in-up ${
                        toast.type === 'error' 
                        ? 'bg-red-950/80 border-red-500/50 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                        : 'bg-slate-900/90 border-cyan-500/50 text-cyan-50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    }`}
                    style={{ animation: 'slideIn 0.3s ease-out forwards' }}
                >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                        {toast.type === 'error' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        )}
                    </div>
                    <p className="font-bold text-sm tracking-wide">{toast.message}</p>
                </div>
            ))}

            {/* Pequeño hack para la animación de entrada en Tailwind */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}} />
        </div>
    );
}