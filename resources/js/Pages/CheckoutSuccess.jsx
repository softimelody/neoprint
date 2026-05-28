import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function CheckoutSuccess({ auth }) {
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    useEffect(() => {
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        
        // Limpiamos el carrito local ya que la compra fue exitosa
        localStorage.removeItem('cart');
        
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="¡Pago Exitoso! | NeoPrint" />

            <div className={`min-h-[80vh] flex items-center justify-center relative overflow-hidden transition-colors duration-700 ${
                isAero ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50' : 'bg-slate-950'
            }`}>
                
                <div className="max-w-xl w-full mx-auto px-4 relative z-10 text-center">
                    <div className={`backdrop-blur-xl border rounded-3xl p-10 md:p-14 shadow-2xl transition-all duration-700 transform hover:scale-[1.02] ${
                        isAero ? 'bg-white/80 border-white text-slate-800' : 'bg-slate-900/80 border-slate-800 text-white'
                    }`}>
                        
                        {/* Ícono animado */}
                        <div className="mb-8 flex justify-center">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg ${
                                isAero ? 'bg-gradient-to-br from-emerald-400 to-cyan-400 text-white' : 'bg-gradient-to-br from-cyan-500 to-fuchsia-600 text-white'
                            }`}>
                                ✨
                            </div>
                        </div>

                        <h2 className="text-4xl font-black mb-4">¡Pago Completado!</h2>
                        <p className={`text-lg mb-8 ${isAero ? 'text-slate-600' : 'text-slate-300'}`}>
                            Tu orden ha sido procesada con éxito por Flow. Hemos enviado un recibo a tu correo electrónico.
                        </p>

                        <div className={`p-4 rounded-xl mb-8 border ${
                            isAero ? 'bg-blue-50 border-blue-100' : 'bg-slate-950 border-slate-700'
                        }`}>
                            <p className={`text-sm font-bold ${isAero ? 'text-blue-800' : 'text-cyan-400'}`}>
                                Estado: <span className="text-emerald-500">Aprobado</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href={route('my-account')}
                                className={`px-8 py-3 rounded-xl font-bold transition-all shadow-md ${
                                    isAero 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30' 
                                    : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                }`}
                            >
                                Ver mis compras
                            </Link>
                            <Link 
                                href={route('dashboard')}
                                className={`px-8 py-3 rounded-xl font-bold border transition-all ${
                                    isAero 
                                    ? 'border-slate-300 text-slate-600 hover:bg-slate-50' 
                                    : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                Volver al Panel
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}