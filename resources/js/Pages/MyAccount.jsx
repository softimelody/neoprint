import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function MyAccount({ auth, orders }) {
    const [activeTab, setActiveTab] = useState('compras');
    
    // Sincronización del Tema Global
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    useEffect(() => {
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className={`font-black text-2xl leading-tight transition-colors duration-700 ${
                    isAero ? 'text-blue-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-500'
                }`}>
                    Central de Usuario
                </h2>
            }
        >
            <Head title="Mi Cuenta | NeoPrint" />

            {/* Contenedor Base Dinámico */}
            <div className={`py-12 min-h-screen pb-24 relative overflow-hidden transition-colors duration-700 ${
                isAero ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50' : 'bg-slate-950'
            }`}>
                {/* Burbujas decorativas traslúcidas (Solo Cyberpunk) */}
                {!isAero && (
                    <>
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none"></div>
                    </>
                )}

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 relative z-0 flex flex-col md:flex-row gap-8">
                    
                    {/* COLUMNA IZQUIERDA: Tarjeta de Perfil */}
                    <div className="w-full md:w-1/3">
                        <div className={`backdrop-blur-xl border rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ${
                            isAero ? 'bg-white/60 border-white/80 shadow-blue-500/5 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-white'
                        }`}>
                            <div className={`h-32 relative bg-gradient-to-r ${isAero ? 'from-blue-500 to-cyan-400' : 'from-cyan-600 to-fuchsia-600'}`}>
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                            
                            <div className="px-6 pb-8 relative">
                                <div className={`mx-auto -mt-12 border-4 rounded-full p-2 shadow-xl ${isAero ? 'bg-white border-white/60' : 'bg-slate-900 border-slate-900'}`}>
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${auth.user.name}&backgroundColor=transparent`} 
                                        alt="Avatar" 
                                        className={`w-20 h-20 rounded-full ${isAero ? 'bg-blue-500/10' : 'bg-cyan-500/20'}`}
                                    />
                                </div>

                                <div className="mt-6">
                                    <h1 className="text-2xl font-black">{auth.user.name}</h1>
                                    <p className={`font-bold text-sm mb-4 ${isAero ? 'text-blue-600' : 'text-cyan-400'}`}>@softimelody</p>
                                    
                                    <div className={`space-y-2 text-sm font-medium ${isAero ? 'text-slate-600' : 'text-slate-400'}`}>
                                        <p className="flex items-center gap-2"><span>📍</span> Santiago, Chile</p>
                                        <p className="flex items-center gap-2"><span>💻</span> Analista Programador</p>
                                        <p className="flex items-center gap-2"><span>✉️</span> {auth.user.email}</p>
                                    </div>
                                </div>

                                <button className={`mt-8 w-full py-3 rounded-xl border font-bold transition-all ${
                                    isAero 
                                    ? 'border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:border-blue-400' 
                                    : 'border-slate-700 text-slate-300 hover:text-white hover:border-fuchsia-500 hover:bg-slate-800'
                                }`}>
                                    Editar Perfil
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: Historial Real de la DB */}
                    <div className="w-full md:w-2/3">
                        <div className={`backdrop-blur-xl border rounded-3xl p-6 md:p-8 min-h-[500px] shadow-xl transition-all duration-700 ${
                            isAero ? 'bg-white/60 border-white/80 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-white'
                        }`}>
                            
                            {/* Selector de Pestañas */}
                            <div className={`flex space-x-8 border-b mb-8 pb-2 ${isAero ? 'border-slate-200' : 'border-slate-800'}`}>
                                <button 
                                    onClick={() => setActiveTab('compras')}
                                    className={`font-bold text-lg pb-2 transition-all ${
                                        activeTab === 'compras' 
                                        ? (isAero ? 'text-blue-600 border-b-2 border-blue-600' : 'text-fuchsia-400 border-b-2 border-fuchsia-400 shadow-[0_4px_10px_-2px_rgba(217,70,239,0.5)]') 
                                        : 'text-slate-400 hover:text-slate-500'
                                    }`}
                                >
                                    Mis Compras ({orders.length})
                                </button>
                                <button 
                                    onClick={() => setActiveTab('coleccion')}
                                    className={`font-bold text-lg pb-2 transition-all ${
                                        activeTab === 'coleccion' 
                                        ? (isAero ? 'text-blue-600 border-b-2 border-blue-600' : 'text-fuchsia-400 border-b-2 border-fuchsia-400 shadow-[0_4px_10px_-2px_rgba(217,70,239,0.5)]') 
                                        : 'text-slate-400 hover:text-slate-500'
                                    }`}
                                >
                                    Mi Colección Digital
                                </button>
                            </div>

                            {/* Contenido Dinámico */}
                            {activeTab === 'compras' && (
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center text-slate-400 py-12">
                                            <p className="text-5xl mb-4">🛸</p>
                                            <p className="font-medium">Aún no has realizado compras en el sistema.</p>
                                        </div>
                                    ) : (
                                        orders.map((order) => {
                                            const orderDate = new Date(order.created_at).toLocaleDateString('es-CL', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            });

                                            return (
                                                <div key={order.id} className={`border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all group ${
                                                    isAero 
                                                    ? 'bg-white/80 border-slate-200 hover:border-blue-400 shadow-sm' 
                                                    : 'bg-slate-950/50 border-slate-800 hover:border-cyan-500/50'
                                                }`}>
                                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${isAero ? 'bg-slate-100' : 'bg-slate-800'}`}>
                                                            📦
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-bold text-slate-400 mb-0.5">
                                                                Orden <span className={isAero ? 'text-blue-600' : 'text-cyan-400'}>#{order.id}</span> • {orderDate}
                                                            </p>
                                                            <h4 className="font-bold truncate">
                                                                {order.items.map(item => `${item.design?.title || 'Diseño Exclusivo'}`).join(', ')}
                                                            </h4>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-0 pt-4 md:pt-0 mt-2 md:mt-0 border-slate-800">
                                                        <div className="text-right">
                                                            <p className="text-slate-400 text-xs uppercase font-bold mb-1">Total</p>
                                                            <p className="text-xl font-black">${parseFloat(order.total_amount).toFixed(2)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {activeTab === 'coleccion' && (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="text-6xl mb-4 opacity-50">🐬</div>
                                    <h3 className="text-xl font-bold mb-2">Bóveda Digital</h3>
                                    <p className="text-slate-400">Los recursos premium se activarán al pasar a producción.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}