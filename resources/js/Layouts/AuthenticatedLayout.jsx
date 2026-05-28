import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import ToastManager from '@/Components/ToastManager'; 
import Footer from '@/Components/Footer';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // LÓGICA DE TEMA GLOBAL
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    // Escuchar si el tema cambia en otra pestaña o en el inicio
    useEffect(() => {
        const handleStorageChange = () => {
            setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className={`min-h-screen flex flex-col transition-colors duration-700 ${
            isAero 
            ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50 text-slate-800' 
            : 'bg-slate-950 text-slate-100'
        }`}>
            {/* Navbar Dinámico */}
            <nav className={`backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-700 ${
                isAero ? 'bg-white/50 border-white/60 shadow-sm' : 'bg-slate-900/50 border-slate-800'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/" className={`text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${
                                    isAero ? 'from-blue-600 to-emerald-500' : 'from-cyan-400 to-fuchsia-500'
                                }`}>
                                    NeoPrint.
                                </Link>
                            </div>

                            {/* Enlaces Header */}
                            <div className="hidden space-x-8 sm:ms-10 sm:flex items-center">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')} className={isAero ? 'text-blue-900 hover:text-blue-600' : 'text-slate-300 hover:text-white'}>
                                    Mi Panel
                                </NavLink>
                                <NavLink href={route('my-account')} active={route().current('my-account')} className={isAero ? 'text-blue-900 hover:text-blue-600' : 'text-slate-300 hover:text-white'}>
                                    Mi Perfil
                                </NavLink>
                            </div>
                        </div>

                        {/* Menú Usuario */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className={`inline-flex items-center px-4 py-2 border text-sm font-bold rounded-xl transition ${
                                                    isAero 
                                                    ? 'border-white bg-white/60 text-blue-900 hover:bg-white hover:border-blue-300 shadow-sm' 
                                                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:text-white hover:border-cyan-500'
                                                }`}
                                            >
                                                {user.name}
                                                <svg className="ms-2 -me-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content contentClasses={`py-1 border rounded-xl shadow-2xl ${
                                        isAero ? 'bg-white/90 border-white/50 backdrop-blur-md' : 'bg-slate-900 border-slate-800'
                                    }`}>
                                        <Dropdown.Link href={route('my-account')} className={`block w-full px-4 py-2 text-left text-sm font-medium transition ${isAero ? 'text-slate-700 hover:bg-blue-50 hover:text-blue-600' : 'text-slate-300 hover:bg-slate-950 hover:text-cyan-400'}`}>
                                            Mi Cuenta
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button" className={`block w-full px-4 py-2 text-left text-sm font-medium transition ${isAero ? 'text-slate-700 hover:bg-red-50 hover:text-red-500' : 'text-slate-400 hover:bg-slate-950 hover:text-red-400'}`}>
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Menú Móvil Botón */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className={`inline-flex items-center justify-center p-2 rounded-md transition ${
                                    isAero ? 'text-slate-500 hover:text-blue-600 hover:bg-white/50' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                }`}
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className={`border-b transition-colors duration-700 ${isAero ? 'bg-white/40 border-white/60 shadow-sm' : 'bg-slate-900/30 border-slate-900'}`}>
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="flex-1 flex flex-col">{children}</main>
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
            <ToastManager />
        </div>
    );
}