import { Head, Link } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import CartDrawer from "@/Components/CartDrawer";
import ToastManager from "@/Components/ToastManager";

export default function Welcome({ auth, designs, categories: serverCategories }) {
    const designsGridRef = useRef(null);
    const [cartCount, setCartCount] = useState(0);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const [theme, setTheme] = useState(
        () => localStorage.getItem("neoprint-theme") || "cyberpunk",
    );
    const isAero = theme === "frutiger";
    const [currentSlide, setCurrentSlide] = useState(0);
    const [results, setResults] = useState([]); // Los productos encontrados
    const [isFocused, setIsFocused] = useState(false); // Para saber si el usuario está escribiendo
    const categories = (serverCategories && serverCategories.length) ? serverCategories : ["Todos", "Anime", "Gaming", "Cyberpunk", "Streetwear"];
    const featuredSlides = [
        { title: "Nuevos Drops", subtitle: "Colección de Verano" },
        { title: "Arte Cyberpunk", subtitle: "Neón y Cromo" },
        { title: "Estilo Streetwear", subtitle: "Urbano y Único" },
    ];
    const filteredDesigns = designs
        ? designs
              .filter((design) => {
                  // Ahora solo filtramos por categoría (el buscador del Navbar ya no afecta esto)
                  const matchCategory =
                      activeCategory === "Todos" ||
                      (design.category &&
                          design.category.toLowerCase() ===
                              activeCategory.toLowerCase());

                  return matchCategory; // Eliminamos matchSearch
              })
              .sort((a, b) => {
                  // Ordenamiento sigue funcionando normal
                  if (sortBy === "price-asc") return a.price - b.price;
                  if (sortBy === "price-desc") return b.price - a.price;
                  return new Date(b.created_at) - new Date(a.created_at);
              })
        : [];
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) =>
                prev === featuredSlides.length - 1 ? 0 : prev + 1,
            );
        }, 4000);
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem("cart") || "[]");
            setCartCount(cart.length);
        };
        updateCount();
        window.addEventListener("cart-updated", updateCount);
        return () => window.removeEventListener("cart-updated", updateCount);
    }, []);

    useEffect(() => {
        localStorage.setItem("neoprint-theme", theme);
    }, [theme]);

    useEffect(() => {
        if (searchQuery.length > 2) {
            // Solo buscamos si el usuario escribe más de 2 letras
            const filtered = designs.filter((d) =>
                d.title.toLowerCase().includes(searchQuery.toLowerCase()),
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [searchQuery]);
    return (
        <div
            className={`min-h-screen flex flex-col font-sans transition-colors duration-700 relative ${
                isAero
                    ? "bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50 text-slate-800 selection:bg-blue-500 selection:text-white"
                    : "bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white"
            }`}
        >
            <Head title="NeoPrint | El futuro del Merch" />

            {/* LUCES DE FONDO */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div
                    className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isAero ? "bg-blue-400/40" : "bg-cyan-600/30"}`}
                ></div>
                <div
                    className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-700 ${isAero ? "bg-emerald-400/30" : "bg-fuchsia-600/20"}`}
                ></div>
            </div>
            {/* NAVBAR */}
            <nav
                className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-700 ${
                    isAero
                        ? "bg-white/40 border-white/60 shadow-sm"
                        : "bg-slate-900/60 border-slate-800"
                }`}
            >
                <div className="flex items-center justify-between gap-6 p-6 max-w-full mx-0">
                    {/* MENÚ CATEGORÍAS - IZQUIERDA */}
                    <div className="hidden lg:block relative group shrink-0">
                        <button className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all duration-300 whitespace-nowrap ${isAero ? "bg-white/50 border-white/70 text-blue-900 hover:bg-white hover:shadow-[0_8px_20px_rgba(59,130,246,0.15)]" : "bg-slate-900/60 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]"}`}>
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
                            </svg>
                            <span className="font-bold text-sm"></span>
                        </button>

                        {/* Menú Desplegable */}
                        <div className={`absolute left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-left z-50`}>
                            <div className={`rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl ${isAero ? "bg-white/95 border-white/60" : "bg-slate-950/95 border-slate-800"}`}>
                                {/* Para ti */}
                                <div className={`border-b px-4 py-3 ${isAero ? "border-blue-100" : "border-slate-800"}`}>
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isAero ? "text-blue-600" : "text-cyan-400"}`}>
                                        Para ti
                                    </p>
                                    <div className="space-y-2">
                                        {auth.user ? (
                                            <>
                                                <Link href={route("dashboard")} className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                                    Mi Galería
                                                </Link>
                                                <Link href={route("my-account")} className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                                    Mi Perfil
                                                </Link>
                                            </>
                                        ) : (
                                            <>
                                                <Link href={route("login")} className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                                    Iniciar Sesión
                                                </Link>
                                                <Link href={route("register")} className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                                    Crear Cuenta
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Explorar */}
                                <div className={`border-b px-4 py-3 ${isAero ? "border-blue-100" : "border-slate-800"}`}>
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isAero ? "text-blue-600" : "text-cyan-400"}`}>
                                        Explorar
                                    </p>
                                    <div className="space-y-2">
                                        <button onClick={() => setActiveCategory("Todos")} className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                            Todos los Diseños
                                        </button>
                                        <a href="#" className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                            Populares
                                        </a>
                                        <a href="#" className={`block px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}>
                                            Nuevos
                                        </a>
                                    </div>
                                </div>

                                {/* Categorías */}
                                <div className="px-4 py-3">
                                    <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${isAero ? "text-blue-600" : "text-cyan-400"}`}>
                                        Categorías
                                    </p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {categories.map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => setActiveCategory(category)}
                                                className={`w-full text-left px-3 py-2 rounded-lg font-semibold text-sm transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-400 hover:bg-slate-900/80 hover:text-cyan-400"}`}
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* LOGO - CENTRO IZQUIERDA */}
                    <div
                        className={`text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r shrink-0 ${
                            isAero
                                ? "from-blue-600 to-emerald-500"
                                : "from-cyan-400 to-fuchsia-500"
                        }`}
                    >
                        NeoPrint.
                    </div>

                    {/* BUSCADOR CON CUADRO FLOTANTE */}
                    <div className={`hidden md:block flex-1 max-w-sm mx-auto relative p-0.5 rounded-xl transition-all duration-300 ${isFocused ? (isAero ? "shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "shadow-[0_0_20px_rgba(6,182,212,0.4)]") : (isAero ? "shadow-[0_0_10px_rgba(59,130,246,0.15)]" : "shadow-[0_0_10px_rgba(168,85,247,0.2)]")} bg-gradient-to-r ${isAero ? "from-blue-400/30 via-cyan-400/20 to-blue-400/30" : "from-cyan-500/30 via-fuchsia-500/20 to-cyan-500/30"}`}>
                        <input
                            type="text"
                            placeholder="Buscar diseños..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() =>
                                setTimeout(() => setIsFocused(false), 200)
                            }
                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-all backdrop-blur-sm ${
                                isAero
                                    ? "bg-white/60 border-white/70 focus:bg-white/80 text-slate-800 focus:ring-2 focus:ring-blue-400"
                                    : "bg-slate-900/50 border-slate-700/50 focus:border-cyan-500 text-white focus:ring-2 focus:ring-cyan-400/60"
                            }`}
                        />

                        {/* CUADRO FLOTANTE DE RESULTADOS */}
                        {isFocused && searchQuery.length > 0 && (
                            <div
                                className={`absolute top-full mt-2 w-full rounded-xl border shadow-2xl overflow-hidden z-50 ${
                                    isAero
                                        ? "bg-white/90 backdrop-blur-md border-white"
                                        : "bg-slate-900 border-slate-800"
                                }`}
                            >
                                {results.length > 0 ? (
                                    results.map((design) => (
                                        <Link
                                            key={design.id}
                                            href={route(
                                                "design.show",
                                                design.id,
                                            )}
                                            className={`flex items-center gap-3 px-4 py-3 transition ${
                                                isAero
                                                    ? "hover:bg-blue-50"
                                                    : "hover:bg-slate-800"
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${design.image_path}`}
                                                className="w-10 h-10 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p
                                                    className={`font-bold text-sm ${isAero ? "text-slate-800" : "text-white"}`}
                                                >
                                                    {design.title}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    ${design.price}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="px-4 py-3 text-sm text-slate-500">
                                        No hay coincidencias.
                                    </p>
                                )}

                                {/* Botón de Scroll */}
                                <button
                                    onClick={() => {
                                        setIsFocused(false);
                                        designsGridRef.current?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                    }}
                                    className={`w-full py-2 text-center text-xs font-bold uppercase tracking-widest transition ${
                                        isAero
                                            ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            : "bg-slate-800 text-cyan-400 hover:bg-slate-700"
                                    }`}
                                >
                                    Ver todos los resultados
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Iconos y Acciones */}
                    <div className="flex items-center space-x-6 shrink-0">
                        <Link
                            href={
                                auth.user ? route("dashboard") : route("login")
                            }
                            className={`font-semibold transition hidden sm:inline-block ${isAero ? "text-blue-800 hover:text-blue-600" : "text-cyan-400 hover:text-cyan-300"}`}
                        >
                            Panel de Creador
                        </Link>

                        <div
                            onClick={() => setIsCartOpen(true)}
                            className={`relative p-2.5 rounded-xl border cursor-pointer transition shadow-lg ${
                                isAero
                                    ? "bg-white/60 border-white text-blue-600 hover:bg-white hover:shadow-blue-500/20"
                                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500"
                            }`}
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
                                <span
                                    className={`absolute -top-2 -right-2 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center ${isAero ? "bg-blue-500 shadow-blue-500/50" : "bg-gradient-to-r from-fuchsia-500 to-pink-500 shadow-[0_0_10px_rgba(217,70,239,0.8)]"}`}
                                >
                                    {cartCount}
                                </span>
                            )}
                        </div>

                        {auth.user ? (
                            <div
                                className={`relative border-l pl-6 hidden sm:block ${isAero ? "border-blue-200" : "border-slate-800"}`}
                            >
                                <div className="group relative cursor-pointer">
                                    <button
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition ${
                                            isAero
                                                ? "bg-white/50 border-white text-blue-900 hover:bg-white"
                                                : "bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:border-cyan-500"
                                        }`}
                                    >
                                        <span className="font-bold text-sm">
                                            {auth.user.name}
                                        </span>
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                        <div
                                            className={`py-1 rounded-xl shadow-2xl border ${isAero ? "bg-white/90 border-white/50 backdrop-blur-md" : "bg-slate-900 border-slate-800"}`}
                                        >
                                            <Link
                                                href={route("my-account")}
                                                className={`block w-full px-4 py-2 text-left text-sm font-medium transition ${isAero ? "text-slate-700 hover:bg-blue-50 hover:text-blue-600" : "text-slate-300 hover:bg-slate-950 hover:text-cyan-400"}`}
                                            >
                                                Mi Cuenta
                                            </Link>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className={`block w-full px-4 py-2 text-left text-sm font-medium transition ${isAero ? "text-slate-700 hover:bg-red-50 hover:text-red-500" : "text-slate-400 hover:bg-slate-950 hover:text-red-400"}`}
                                            >
                                                Cerrar Sesión
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`space-x-4 flex items-center border-l pl-6 sm:flex ${isAero ? "border-blue-200" : "border-slate-800"}`}
                            >
                                <Link
                                    href={route("login")}
                                    className={`font-medium transition ${isAero ? "text-blue-800 hover:text-blue-600" : "text-slate-300 hover:text-white"}`}
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href={route("register")}
                                    className={`px-5 py-2.5 rounded-full text-white font-bold transition-all hover:-translate-y-0.5 shadow-lg ${isAero ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/40" : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50"}`}
                                >
                                    Unirse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-grow relative z-10">
                <div className="relative w-full max-w-6xl mx-auto mt-8 mb-16 h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden rounded-3xl shadow-2xl transition-all duration-700 z-10 group">
                    {/* El fondo de cristal (Se quitaron los bordes para un look más limpio) */}
                    <div
                        className={`absolute inset-0 transition-colors duration-700 ${
                            isAero
                                ? "bg-white/40 backdrop-blur-md"
                                : "bg-slate-900/50 backdrop-blur-lg"
                        }`}
                    ></div>

                    {/* Las Diapositivas */}
                    {featuredSlides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 flex flex-col items-center justify-center text-center px-4 transition-all duration-1000 transform ${
                                index === currentSlide
                                    ? "opacity-100 translate-x-0 scale-100"
                                    : "opacity-0 translate-x-12 scale-95 pointer-events-none"
                            }`}
                        >
                            <h1
                                className={`text-4xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-sm ${isAero ? "text-slate-800" : "text-white"}`}
                            >
                                {slide.title}
                            </h1>
                            <p
                                className={`text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r drop-shadow-sm ${
                                    isAero
                                        ? "from-blue-600 to-cyan-500"
                                        : "from-cyan-400 to-fuchsia-500"
                                }`}
                            >
                                {slide.subtitle}
                            </p>
                        </div>
                    ))}

                    {/* Botoncitos indicadores abajo */}
                    <div className="absolute bottom-6 flex space-x-3 z-20">
                        {featuredSlides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    index === currentSlide
                                        ? isAero
                                            ? "bg-blue-600 w-8"
                                            : "bg-cyan-400 w-8"
                                        : isAero
                                        ? "bg-blue-300/50 hover:bg-blue-400"
                                        : "bg-slate-600 hover:bg-slate-500"
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full max-w-7xl mx-auto px-4 mb-12">
                    <div
                        className={`flex flex-wrap items-center justify-center gap-3 backdrop-blur-md border p-3 rounded-2xl w-fit mx-auto shadow-inner transition-colors duration-700 ${isAero ? "bg-white/30 border-white/50" : "bg-slate-900/40 border-slate-900"}`}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 ${activeCategory === category ? (isAero ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg scale-105" : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105") : isAero ? "text-slate-600 hover:bg-white/60 hover:text-blue-600 border border-transparent" : "text-slate-400 hover:text-white hover:bg-slate-900/80 border border-transparent hover:border-slate-800"}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-7xl mx-auto px-4 pb-20">
                    <div className="flex justify-between items-center mb-10">
                        <h2
                            className={`text-3xl md:text-4xl font-extrabold pl-4 border-l-4 ${isAero ? "text-slate-800 border-blue-500" : "text-white border-cyan-500"}`}
                        >
                            {activeCategory === "Todos"
                                ? "Últimos Lanzamientos"
                                : `Estilo: ${activeCategory}`}
                        </h2>
                    </div>
                    {filteredDesigns.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {filteredDesigns.map((design) => (
                                <div
                                    key={design.id}
                                    className={`group relative backdrop-blur-sm rounded-2xl border overflow-hidden transition duration-500 flex flex-col ${isAero ? "bg-white/40 border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:border-blue-400 hover:-translate-y-2" : "bg-slate-900/50 border-slate-800 shadow-2xl hover:border-fuchsia-500 hover:-translate-y-2"}`}
                                >
                                    {/* 2. El enlace de la imagen ahora es un componente independiente */}
                                    <Link
                                        href={route("design.show", design.id)}
                                        className="block aspect-[4/5] w-full overflow-hidden relative"
                                    >
                                        <div
                                            className={`absolute inset-0 opacity-80 z-10 bg-gradient-to-t to-transparent ${isAero ? "from-white via-white/20" : "from-slate-950 via-transparent"}`}
                                        ></div>
                                        <img
                                            src={`/storage/${design.image_path}`}
                                            alt={design.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-0 left-0 w-full p-5 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <h3
                                                className={`text-xl font-black mb-1 truncate ${isAero ? "text-slate-800" : "text-white drop-shadow-md"}`}
                                            >
                                                {design.title}
                                            </h3>
                                            <p
                                                className={`font-bold ${isAero ? "text-blue-600" : "text-cyan-400 drop-shadow-md"}`}
                                            >
                                                {design.price ? `$${parseFloat(design.price).toFixed(2)} USD` : '—'}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* 3. AQUÍ INSERTAMOS EL ENLACE AL ARTISTA FUERA DEL LINK ANTERIOR */}
                                    <div className="p-4 mt-auto">
                                        <Link
                                            href={route(
                                                "artist.show",
                                                design.user_id,
                                            )}
                                            className={`text-xs font-bold hover:underline ${isAero ? "text-blue-600" : "text-cyan-400"}`}
                                        >
                                            Por:{" "}
                                            {design.user?.name || "Artista"}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center rounded-3xl animate-pulse">
                            <p className="text-5xl mb-4">🛸</p>
                        </div>
                    )}
                </div>

                {/* SECCIÓN: LIGHTNING DEALS */}
                <section className="w-full max-w-7xl mx-auto px-4 py-16">
                    <div className="mb-12">
                        <h2 className={`text-3xl md:text-4xl font-extrabold pl-4 border-l-4 mb-2 ${isAero ? "text-slate-800 border-blue-500" : "text-white border-cyan-500"}`}>
                            Ofertas Relámpago⚡
                        </h2>
                        <p className={`pl-4 text-sm font-medium ${isAero ? "text-slate-600" : "text-slate-400"}`}>
                            Descuentos especiales por tiempo limitado
                        </p>
                    </div>

                    {/* Grid de Lightning Deals */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {designs.slice(0, 4).map((design) => {
                            const originalPrice = parseFloat(design.price);
                            const salePrice = originalPrice * 0.8;
                            return (
                                <Link
                                    key={design.id}
                                    href={route("design.show", design.id)}
                                    className={`group relative backdrop-blur-sm rounded-2xl border overflow-hidden transition duration-500 flex flex-col ${isAero ? "bg-white/40 border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(59,130,246,0.2)] hover:border-blue-400 hover:-translate-y-2" : "bg-slate-900/50 border-slate-800 shadow-2xl hover:border-fuchsia-500 hover:-translate-y-2"}`}
                                >
                                    {/* Imagen con badge flotante */}
                                    <div className="relative aspect-square w-full overflow-hidden">
                                        <img
                                            src={`/storage/${design.image_path}`}
                                            alt={design.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div
                                            className={`absolute inset-0 opacity-70 z-10 bg-gradient-to-t to-transparent ${isAero ? "from-white via-white/20" : "from-slate-950 via-transparent"}`}
                                        ></div>

                                        {/* Badge -20% OFF */}
                                        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full font-black text-xs tracking-widest z-20 transition-transform duration-300 group-hover:scale-110 shadow-lg ${isAero ? "bg-gradient-to-r from-red-400 to-rose-500 text-white" : "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white"}`}>
                                            -20% OFF
                                        </div>
                                    </div>

                                    {/* Contenido: Título y Precios */}
                                    <div className="p-4 mt-auto">
                                        <h3
                                            className={`text-sm font-black mb-2 truncate ${isAero ? "text-slate-800" : "text-white"}`}
                                        >
                                            {design.title}
                                        </h3>

                                        {/* Precios */}
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`text-xs font-bold line-through ${isAero ? "text-slate-500" : "text-slate-500"}`}
                                            >
                                                ${originalPrice.toFixed(2)}
                                            </span>
                                            <span
                                                className={`text-lg font-black ${isAero ? "text-rose-500" : "text-fuchsia-400"}`}
                                            >
                                                ${salePrice.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* SECCIÓN: FEATURED ARTISTS */}
                <section className={`w-full py-16 my-16 transition-colors duration-700 ${isAero ? "bg-gradient-to-br from-blue-50/60 via-white/40 to-cyan-50/50 backdrop-blur-sm" : "bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-800/50 backdrop-blur-md"}`}>
                    <div className="w-full max-w-7xl mx-auto px-4">
                        {/* Header */}
                        <div className="text-center mb-16">
                            <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${isAero ? "text-blue-600" : "text-cyan-400"}`}>
                                Nuestra Comunidad
                            </p>
                            <h2 className={`text-4xl md:text-5xl font-extrabold mb-4 ${isAero ? "text-slate-800" : "text-white"}`}>
                                Creadores Destacados
                            </h2>
                            <p className={`text-lg font-medium max-w-2xl mx-auto ${isAero ? "text-slate-600" : "text-slate-400"}`}>
                                Conecta con artistas excepcionales y explora sus galerías digitales
                            </p>
                        </div>

                        {/* Grid de Artistas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[
                                { id: 1, name: "Luna Nova", works: 24, initials: "LN", color: "from-purple-500 to-pink-500" },
                                { id: 2, name: "Kyn Solaris", works: 18, initials: "KS", color: "from-blue-500 to-cyan-500" },
                                { id: 3, name: "Pixel Dreams", works: 31, initials: "PD", color: "from-cyan-400 to-blue-600" },
                                { id: 4, name: "Nova Storm", works: 27, initials: "NS", color: "from-fuchsia-500 to-rose-500" },
                            ].map((artist) => (
                                <div
                                    key={artist.id}
                                    className={`text-center rounded-2xl border p-8 backdrop-blur-md transition duration-500 flex flex-col items-center group hover:-translate-y-3 ${isAero ? "bg-white/50 border-white/70 shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] hover:border-blue-300" : "bg-slate-900/60 border-slate-800 shadow-2xl hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:border-fuchsia-500"}`}
                                >
                                    {/* Avatar Circular */}
                                    <div
                                        className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black text-white mb-4 transition-transform duration-500 group-hover:scale-110 shadow-lg bg-gradient-to-br ${artist.color}`}
                                    >
                                        {artist.initials}
                                    </div>

                                    {/* Nombre del Artista */}
                                    <h3 className={`text-xl font-extrabold mb-2 ${isAero ? "text-slate-800" : "text-white"}`}>
                                        {artist.name}
                                    </h3>

                                    {/* Contador de Obras */}
                                    <p className={`text-sm font-bold mb-6 ${isAero ? "text-slate-500" : "text-slate-400"}`}>
                                        {artist.works} obras publicadas
                                    </p>

                                    {/* Botón Ver Galería */}
                                    <Link
                                        href={route("artist.show", artist.id)}
                                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-1 active:scale-95 ${isAero ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)] border border-white/60" : "bg-gradient-to-r from-fuchsia-500 to-pink-600 text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] border border-fuchsia-400/50"}`}
                                    >
                                        Ver Galería
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER PROFESIONAL */}
            <footer
                className={`relative z-10 border-t backdrop-blur-xl pt-16 pb-8 transition-colors duration-700 mt-auto ${
                    isAero
                        ? "bg-white/60 border-white/80 text-slate-600"
                        : "bg-slate-950/80 border-slate-800 text-slate-400"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <div
                                className={`text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r mb-4 ${
                                    isAero
                                        ? "from-blue-600 to-emerald-500"
                                        : "from-cyan-400 to-fuchsia-500"
                                }`}
                            >
                                NeoPrint.
                            </div>
                            <p
                                className={`text-sm font-medium ${isAero ? "text-slate-500" : "text-slate-400"}`}
                            >
                                Transformando arte digital en merch de alta
                                calidad. Desde Santiago, Chile para el mundo.
                            </p>
                        </div>

                        <div>
                            <h4
                                className={`text-lg font-bold mb-4 ${isAero ? "text-slate-800" : "text-white"}`}
                            >
                                Plataforma
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="#"
                                        className={`text-sm font-semibold transition ${isAero ? "hover:text-blue-600" : "hover:text-cyan-400"}`}
                                    >
                                        Términos y Condiciones
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`text-sm font-semibold transition ${isAero ? "hover:text-blue-600" : "hover:text-cyan-400"}`}
                                    >
                                        Políticas de Privacidad
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className={`text-sm font-semibold transition ${isAero ? "hover:text-blue-600" : "hover:text-cyan-400"}`}
                                    >
                                        Centro de Ayuda
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4
                                className={`text-lg font-bold mb-4 ${isAero ? "text-slate-800" : "text-white"}`}
                            >
                                Conecta
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <a
                                        href="https://instagram.com/chocofranm"
                                        target="_blank"
                                        rel="noreferrer"
                                        className={`flex items-center gap-2 text-sm font-semibold transition group ${isAero ? "hover:text-pink-600" : "hover:text-fuchsia-400"}`}
                                    >
                                        <svg
                                            className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAero ? "text-pink-500" : "text-fuchsia-500"}`}
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        @chocofranm
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4
                                className={`text-lg font-bold mb-4 ${isAero ? "text-slate-800" : "text-white"}`}
                            >
                                Entorno Visual
                            </h4>
                            <p className="text-sm mb-4">
                                Personaliza la estética de la plataforma:
                            </p>
                            <button
                                onClick={() =>
                                    setTheme(isAero ? "cyberpunk" : "frutiger")
                                }
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all duration-300 shadow-sm transform hover:-translate-y-1 w-full justify-center ${
                                    isAero
                                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border border-white/50 hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
                                        : "bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                                }`}
                            >
                                {isAero
                                    ? "🌌 Cambiar a Cyberpunk"
                                    : "🐬 Cambiar a Frutiger Aero"}
                            </button>
                        </div>
                    </div>

                    <div
                        className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
                            isAero ? "border-blue-200" : "border-slate-800"
                        }`}
                    >
                        <div className="text-sm font-bold tracking-wide">
                            © {new Date().getFullYear()} NeoPrint.{" "}
                            <span className="opacity-70 font-normal">
                                Todos los derechos reservados.
                            </span>
                        </div>
                        <div className="text-sm font-medium flex items-center gap-1">
                            Hecho{" "}
                            <span className="text-red-500 animate-pulse">
                                ❤️
                            </span>{" "}
                            por
                            <a
                                href="https://github.com/softimelody"
                                target="_blank"
                                rel="noreferrer"
                                className={`font-bold hover:underline transition-colors ${
                                    isAero
                                        ? "text-blue-600 hover:text-blue-800"
                                        : "text-fuchsia-400 hover:text-fuchsia-300"
                                }`}
                            >
                                @Softimelody
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <ToastManager />
        </div>
    );
}
