import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import CartDrawer from "@/Components/CartDrawer";
import Footer from '@/Components/Footer';

export default function DesignDetail({ design }) {
    // Tema global (para permitir cambio desde el footer)
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    useEffect(() => {
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const [selectedProduct, setSelectedProduct] = useState("Polera Premium");
    const [price, setPrice] = useState(() => {
        return design && design.price ? parseFloat(design.price) : 24.99;
    });

    // Estados para el Toast y el contador del carrito
    const [showCartToast, setShowCartToast] = useState(false);
    const [cartToastMessage, setCartToastMessage] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const products = [
        { name: "Polera Premium", price: 24.99, icon: "👕" },
        { name: "Sticker Holográfico", price: 4.5, icon: "✨" },
        { name: "Póster Y2K (A3)", price: 15.0, icon: "🖼️" },
    ];

    // Leer la cantidad de elementos en el carrito al cargar la página
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.length);
    }, []);

    const handleProductChange = (prod) => {
        setSelectedProduct(prod.name);
        setPrice(prod.price);
    };

    const addToCart = () => {
        // 1. Obtener el carrito actual o crear uno vacío
        const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");

        // 2. Agregar el nuevo producto elegido
        const newItem = {
            id: design.id,
            title: design.title,
            product: selectedProduct,
            price: price,
            image: design.image_path,
        };
        currentCart.push(newItem);

        // 3. Guardar de vuelta en localStorage
        localStorage.setItem("cart", JSON.stringify(currentCart));

        // 4. Actualizar contador local y disparar un evento global para otros headers
        setCartCount(currentCart.length);
        window.dispatchEvent(new Event("cart-updated"));

        // 5. Mostrar la notificación estilizada
        setCartToastMessage(
            `Agregado: ${selectedProduct} por $${price.toFixed(2)}`,
        );
        setShowCartToast(true);
        setTimeout(() => setShowCartToast(false), 4000);
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-700 relative overflow-hidden ${isAero ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50 text-slate-800 selection:bg-blue-500 selection:text-white' : 'bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white'}`}>
            <Head title={`${design.title} | NeoPrint`} />

            {/* BARRA DE NAVEGACIÓN CON ÍCONO DE CARRITO */}
            <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-700 ${isAero ? 'bg-white/40 border-white/60' : 'bg-slate-900/40 border-slate-800'}`}>
                <div className="p-6 max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href="/"
                        className={`text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${isAero ? 'from-blue-600 to-emerald-500' : 'from-cyan-400 to-fuchsia-500'} hover:opacity-80 transition`}
                    >
                        ← Volver a NeoPrint
                    </Link>

                    {/* Botón flotante del carrito con contador de neón */}
                    <div
                        onClick={() => setIsCartOpen(true)}
                        className={`relative p-2.5 rounded-xl cursor-pointer transition shadow-lg ${isAero ? 'bg-white/60 border-white text-blue-600 hover:bg-white hover:shadow-blue-500/20' : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500'}`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            ></path>
                        </svg>
                        {cartCount > 0 && (
                            <span className={`absolute -top-2 -right-2 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce ${isAero ? 'bg-blue-500 shadow-blue-500/50' : 'bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]'}`}>
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Columna Izquierda: Imagen */}
                    <div className="relative group">
                        <div className={`absolute -inset-1 rounded-2xl blur opacity-25 transition duration-1000 ${isAero ? 'bg-gradient-to-r from-blue-300 to-emerald-300 group-hover:opacity-60' : 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 group-hover:opacity-50'}`}></div>
                        <div className={`relative rounded-2xl p-4 shadow-2xl ${isAero ? 'bg-white/90 border border-white/40' : 'bg-slate-900 border border-slate-700'}`}>
                            <img
                                src={`/storage/${design.image_path}`}
                                alt={design.title}
                                className="w-full rounded-xl object-contain max-h-[600px]"
                            />
                        </div>
                    </div>

                    {/* Columna Derecha: Opciones */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <h1 className={`text-4xl md:text-5xl font-black mb-2 ${isAero ? 'text-slate-800' : 'text-white'}`}>
                                {design.title}
                            </h1>
                            <p className={`${isAero ? 'text-slate-600' : 'text-slate-400'} text-lg`}>
                                {design.description ||
                                    "Una obra de arte digital exclusiva de NeoPrint."}
                            </p>
                        </div>

                        <div className={`p-6 rounded-2xl ${isAero ? 'bg-white/50 border border-white/60' : 'bg-slate-900/50 border border-slate-800'}`}>
                            <h3 className="text-cyan-400 font-bold mb-4 uppercase tracking-widest text-sm">
                                Elige el formato
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                {products.map((prod) => (
                                    <button
                                        key={prod.name}
                                        onClick={() =>
                                            handleProductChange(prod)
                                        }
                                        className={`p-4 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedProduct === prod.name ? (isAero ? 'bg-blue-200/30 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-fuchsia-600/20 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]') : (isAero ? 'bg-white/80 border-white/40 hover:border-blue-500' : 'bg-slate-950 border-slate-700 hover:border-cyan-500')}`}
                                    >
                                        <span className="text-3xl mb-2">
                                            {prod.icon}
                                        </span>
                                        <span className="text-sm font-bold text-center">
                                            {prod.name}
                                        </span>
                                    </button>
                                ))}
                            </div>

                                    <div className="flex items-end justify-between mb-6">
                                <div>
                                    <p className="text-slate-500 font-medium">
                                        Precio total
                                    </p>
                                    <p className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${isAero ? 'from-blue-600 to-cyan-400' : 'from-cyan-400 to-emerald-400'}`}>
                                        ${price.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={addToCart}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-[1.02]"
                            >
                                Añadir al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Toast del Carrito */}
            <div
                className={`fixed bottom-5 right-5 z-50 transform transition-all duration-500 flex items-center space-x-4 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.4)] max-w-sm ${
                    showCartToast
                        ? "translate-y-0 opacity-100 scale-100"
                        : "translate-y-12 opacity-0 scale-90 pointer-events-none"
                }`}
            >
                <div className="bg-cyan-500/20 text-cyan-400 p-2 rounded-xl text-xl animate-bounce">
                    🛒
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">
                        ¡Carrito Actualizado!
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                        {cartToastMessage}
                    </p>
                </div>
                <button
                    onClick={() => setShowCartToast(false)}
                    className="text-slate-500 hover:text-white text-sm font-bold px-1"
                >
                    ✕
                </button>
            </div>
            <Footer />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </div>
    );
}
