import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // Usamos Link nativo de Inertia

export default function CartDrawer({ isOpen, onClose }) {
    const [cartItems, setCartItems] = useState([]);

    // Cargar los items desde la memoria
    const loadCart = () => {
        setCartItems(JSON.parse(localStorage.getItem('cart') || '[]'));
    };

    useEffect(() => {
        if (isOpen) loadCart();
        window.addEventListener('cart-updated', loadCart);
        return () => window.removeEventListener('cart-updated', loadCart);
    }, [isOpen]);

    // Función para eliminar un producto individual
    const removeItem = (indexToRemove) => {
        const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        window.dispatchEvent(new Event('cart-updated')); // Avisa al contador de la navbar
    };

    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    return (
        <>
            {/* Fondo oscuro translúcido (Overlay) */}
            <div 
                className={`fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Panel lateral derecho (Drawer) */}
            <div className={`fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-[0_0_40px_rgba(217,70,239,0.15)] transform transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                
                {/* Header del carrito */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <span className="text-cyan-400">🛒</span> Tu Carrito
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white p-2 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-slate-500 mt-10">
                            <p className="text-5xl mb-4">🛸</p>
                            <p>Tu carrito está flotando en el espacio (vacío).</p>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="flex gap-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800 relative group transition hover:border-fuchsia-500/50">
                                <img src={`/storage/${item.image}`} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-slate-800" />
                                <div className="flex-1">
                                    <h4 className="text-white font-bold text-sm truncate">{item.title}</h4>
                                    <p className="text-xs text-fuchsia-400 font-medium">{item.product}</p>
                                    <p className="text-cyan-400 font-black mt-2">${item.price.toFixed(2)}</p>
                                </div>
                                <button 
                                    onClick={() => removeItem(index)}
                                    className="absolute top-2 right-2 text-slate-600 hover:text-red-500 transition opacity-0 group-hover:opacity-100 bg-slate-900 rounded p-1"
                                    title="Eliminar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Resumen final */}
                <div className="p-6 border-t border-slate-800 bg-slate-950">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-slate-400 font-medium">Total Estimado</span>
                        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                    
                    {/* SOLUCIÓN AL CONFLICTO: Renderizado seguro según el estado del carrito */}
                    {cartItems.length === 0 ? (
                        <button 
                            disabled
                            className="w-full py-4 rounded-xl font-black text-lg bg-slate-800 text-slate-600 cursor-not-allowed text-center block"
                        >
                            Ir al Pago (Checkout)
                        </button>
                    ) : (
                        <Link 
                            href="/checkout"
                            className="w-full py-4 rounded-xl font-black text-lg text-center block bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transform hover:-translate-y-1 transition-all"
                        >
                            Ir al Pago (Checkout)
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}