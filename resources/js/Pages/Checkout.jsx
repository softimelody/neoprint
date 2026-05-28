import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router} from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Checkout({ auth }) {
    // 1. Estados reales para tu carrito
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    // 2. Leer los datos reales apenas carga la página
    useEffect(() => {
        try {
            // 1. Leemos la memoria del navegador
            const storedData = localStorage.getItem('cart');
            
            // 2. Lo transformamos con seguridad y obligamos a que sea un Array
            const parsedCart = storedData ? JSON.parse(storedData) : [];
            const safeCart = Array.isArray(parsedCart) ? parsedCart : [];
            
            setCart(safeCart);
            
            // 3. Calculamos el total con seguridad
            const calculatedTotal = safeCart.reduce((sum, item) => sum + (item.price || 19.99), 0);
            setTotal(parseFloat(calculatedTotal.toFixed(2))); 
            
        } catch (error) {
            // Si algo explota (como un JSON corrupto), salvamos la página dejando el carrito vacío
            console.error("Error cargando el carrito:", error);
            setCart([]);
            setTotal(0);
        }
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const { data, setData, post, processing } = useForm({
        gateway: 'flow', // Valor por defecto listo para conectar tu cuenta sandbox
    });
    

    const handleCheckout = (e) => {
        e.preventDefault();
        // Aquí conectaremos la ruta del controlador que creará la orden y llamará a la API de Flow
        router.post(route('checkout.store'), {
            total: total,
            cart: cart
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className={`font-black text-2xl leading-tight transition-colors duration-700 ${
                    isAero ? 'text-blue-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500'
                }`}>
                    Finalizar Pedido
                </h2>
            }
        >
            <Head title="Checkout | NeoPrint" />

            {/* Body Dinámico con soporte Frutiger Aero */}
            <div className={`py-12 min-h-screen relative overflow-hidden transition-colors duration-700 ${
                isAero ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50' : 'bg-slate-950'
            }`}>
                
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Formulario de Facturación / Pasarela */}
                    <div className={`backdrop-blur-xl border rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-700 ${
                        isAero ? 'bg-white/60 border-white/80 text-slate-800' : 'bg-slate-900/60 border-slate-800 text-white'
                    }`}>
                        <h3 className="text-2xl font-black mb-6">Información de Pago</h3>
                        
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div>
                                <label className={`block font-bold mb-2 text-sm ${isAero ? 'text-blue-800' : 'text-cyan-400'}`}>
                                    Pasarela Seleccionada
                                </label>
                                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                                    isAero ? 'bg-white/80 border-slate-200' : 'bg-slate-950 border-slate-700'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">💳</span>
                                        <div>
                                            <p className="font-bold text-sm">Flow Webpay</p>
                                            <p className="text-xs text-slate-400">Tarjetas de Crédito / Débito (Chile)</p>
                                        </div>
                                    </div>
                                    <span className="w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]"></span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={processing || cart.length === 0}
                                className={`w-full py-4 rounded-xl font-black text-lg transition-all transform hover:-translate-y-0.5 shadow-md ${
                                    cart.length === 0 
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : isAero 
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-blue-500/30' 
                                    : 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                }`}
                            >
                                {processing ? 'Redirigiendo a Flow...' : `Pagar $${total.toFixed(2)} USD`}
                            </button>
                        </form>
                    </div>

                    {/* Resumen del Carrito de Compras */}
                    <div className={`backdrop-blur-xl border rounded-3xl p-6 md:p-8 shadow-xl transition-all duration-700 ${
                        isAero ? 'bg-white/40 border-white/60 text-slate-800' : 'bg-slate-900/40 border-slate-800 text-white'
                    }`}>
                        <h3 className="text-2xl font-black mb-6">Resumen del Carrito</h3>
                        
                        {cart.length === 0 ? (
                            <p className="text-slate-400 text-sm">Tu carrito está vacío.</p>
                        ) : (
                            <div className="space-y-4">
                                <div className={`max-h-60 overflow-y-auto space-y-3 pr-2 divide-y ${isAero ? 'divide-slate-100' : 'divide-slate-800'}`}>
                                    {cart.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between pt-3 first:pt-0">
                                            <div>
                                                <p className="font-bold text-sm truncate max-w-[180px]">{item.title || 'Diseño Custom'}</p>
                                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{item.product_type || 'Merch'}</p>
                                            </div>
                                            <p className="font-black text-sm">${(item.price || 19.99).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className={`pt-4 border-t-2 flex justify-between items-center ${isAero ? 'border-slate-200' : 'border-slate-800'}`}>
                                    <span className="font-bold text-lg">Total a pagar:</span>
                                    <span className={`text-2xl font-black ${isAero ? 'text-blue-600' : 'text-cyan-400'}`}>
                                        ${total.toFixed(2)} USD
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}