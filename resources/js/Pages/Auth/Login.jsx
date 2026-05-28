import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    useEffect(() => {
        localStorage.setItem('neoprint-theme', theme);
    }, [theme]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className={`min-h-screen flex flex-col font-sans transition-colors duration-700 relative overflow-hidden ${
            isAero ? 'bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-50 text-slate-800' : 'bg-slate-950 text-slate-100'
        }`}>
            <Head title="Iniciar Sesión | NeoPrint" />
            <Link 
                href="/" 
                className={`absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 font-bold transition-all duration-300 hover:-translate-x-2 ${
                    isAero ? 'text-blue-800 hover:text-blue-600 drop-shadow-sm' : 'text-cyan-400 hover:text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                }`}
            >
                <div className={`p-2 rounded-full backdrop-blur-md border ${
                    isAero ? 'bg-white/40 border-white/60 shadow-sm' : 'bg-slate-900/50 border-cyan-500/30'
                }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                </div>
                <span className="hidden sm:inline">Volver</span>
            </Link>
            {/* LUCES DE FONDO */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-700 ${isAero ? 'bg-blue-400/40' : 'bg-cyan-600/30'}`}></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] transition-colors duration-700 ${isAero ? 'bg-emerald-400/30' : 'bg-fuchsia-600/20'}`}></div>
            </div>

            {/* CONTENIDO PRINCIPAL CENTRADO */}
            <main className="flex-grow flex items-center justify-center p-4 z-10">
                {/* TARJETA DE LOGIN */}
                <div className={`relative w-full max-w-md p-8 rounded-3xl border shadow-2xl backdrop-blur-xl transition-colors duration-700 ${
                    isAero ? 'bg-white/50 border-white/60' : 'bg-slate-900/60 border-slate-800'
                }`}>
                    <div className="text-center mb-8">
                        <Link href="/">
                            <h1 className={`text-4xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r inline-block mb-2 ${
                                isAero ? 'from-blue-600 to-emerald-500' : 'from-cyan-400 to-fuchsia-500'
                            }`}>
                                NeoPrint.
                            </h1>
                        </Link>
                        <p className={`font-bold ${isAero ? 'text-slate-500' : 'text-slate-400'}`}>Bienvenido de vuelta a la red</p>
                    </div>

                    {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className={`block text-sm font-bold mb-2 ${isAero ? 'text-slate-700' : 'text-slate-300'}`}>Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                    isAero 
                                    ? 'bg-white/50 border-white/60 focus:bg-white text-slate-800 focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-slate-950/50 border-slate-700 focus:border-cyan-500 text-white focus:ring-1 focus:ring-cyan-500'
                                }`}
                                autoComplete="username"
                                autoFocus
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1 font-bold">{errors.email}</p>}
                        </div>

                        <div>
                            <label className={`block text-sm font-bold mb-2 ${isAero ? 'text-slate-700' : 'text-slate-300'}`}>Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                                    isAero 
                                    ? 'bg-white/50 border-white/60 focus:bg-white text-slate-800 focus:ring-2 focus:ring-blue-400' 
                                    : 'bg-slate-950/50 border-slate-700 focus:border-cyan-500 text-white focus:ring-1 focus:ring-cyan-500'
                                }`}
                                autoComplete="current-password"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1 font-bold">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className={`ms-2 text-sm font-bold ${isAero ? 'text-slate-600' : 'text-slate-400'}`}>Recuérdame</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className={`text-sm font-bold hover:underline transition-colors ${
                                        isAero ? 'text-blue-600 hover:text-blue-800' : 'text-cyan-400 hover:text-cyan-300'
                                    }`}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <button
                            disabled={processing}
                            className={`w-full py-3.5 rounded-xl text-white font-black tracking-wide uppercase transition-all duration-300 hover:-translate-y-1 shadow-lg ${
                                isAero 
                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:shadow-blue-500/40' 
                                : 'bg-gradient-to-r from-cyan-500 to-fuchsia-600 hover:shadow-cyan-500/50'
                            } ${processing && 'opacity-50 cursor-not-allowed'}`}
                        >
                            Entrar a la Plataforma
                        </button>
                        
                        <p className="text-center text-sm font-bold mt-4">
                            <span className={isAero ? 'text-slate-500' : 'text-slate-400'}>¿Aún no tienes cuenta? </span>
                            <Link href={route('register')} className={`hover:underline ${isAero ? 'text-blue-600' : 'text-cyan-400'}`}>Regístrate aquí</Link>
                        </p>
                    </form>
                </div>
            </main>

            {/* FOOTER */}
            <footer className={`relative z-10 border-t backdrop-blur-xl pt-16 pb-8 transition-colors duration-700 mt-auto ${
                isAero ? 'bg-white/60 border-white/80 text-slate-600' : 'bg-slate-950/80 border-slate-800 text-slate-400'
            }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-1">
                            <div className={`text-3xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r mb-4 ${
                                isAero ? 'from-blue-600 to-emerald-500' : 'from-cyan-400 to-fuchsia-500'
                            }`}>
                                NeoPrint.
                            </div>
                            <p className={`text-sm font-medium ${isAero ? 'text-slate-500' : 'text-slate-400'}`}>
                                Transformando arte digital en merch de alta calidad. Desde Santiago, Chile para el mundo.
                            </p>
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Plataforma</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className={`text-sm font-semibold transition ${isAero ? 'hover:text-blue-600' : 'hover:text-cyan-400'}`}>Términos y Condiciones</a></li>
                                <li><a href="#" className={`text-sm font-semibold transition ${isAero ? 'hover:text-blue-600' : 'hover:text-cyan-400'}`}>Políticas de Privacidad</a></li>
                                <li><a href="#" className={`text-sm font-semibold transition ${isAero ? 'hover:text-blue-600' : 'hover:text-cyan-400'}`}>Centro de Ayuda</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Conecta</h4>
                            <ul className="space-y-2">
                                <li>
                                    <a href="https://instagram.com/chocofranm" target="_blank" rel="noreferrer" className={`flex items-center gap-2 text-sm font-semibold transition group ${isAero ? 'hover:text-pink-600' : 'hover:text-fuchsia-400'}`}>
                                        <svg className={`w-5 h-5 transition-transform group-hover:scale-110 ${isAero ? 'text-pink-500' : 'text-fuchsia-500'}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                        </svg>
                                        @chocofranm
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold mb-4 ${isAero ? 'text-slate-800' : 'text-white'}`}>Entorno Visual</h4>
                            <p className="text-sm mb-4">Personaliza la estética de la plataforma:</p>
                            <button 
                                onClick={() => setTheme(isAero ? 'cyberpunk' : 'frutiger')}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-xs transition-all duration-300 shadow-sm transform hover:-translate-y-1 w-full justify-center ${
                                    isAero 
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-400 text-white border border-white/50 hover:shadow-[0_10px_20px_rgba(59,130,246,0.3)]' 
                                    : 'bg-slate-800 text-cyan-400 border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                                }`}
                            >
                                {isAero ? '🌌 Cambiar a Cyberpunk' : '🐬 Cambiar a Frutiger Aero'}
                            </button>
                        </div>
                    </div>
                    <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
                        isAero ? 'border-blue-200' : 'border-slate-800'
                    }`}>
                        <div className="text-sm font-bold tracking-wide">
                            © {new Date().getFullYear()} NeoPrint. <span className="opacity-70 font-normal">Todos los derechos reservados.</span>
                        </div>
                        <div className="text-sm font-medium flex items-center gap-1">
                            Hecho <span className="text-red-500 animate-pulse">❤️</span> por 
                            <a 
                                href="https://github.com/softimelody" 
                                target="_blank" 
                                rel="noreferrer" 
                                className={`font-bold hover:underline transition-colors ${
                                    isAero ? 'text-blue-600 hover:text-blue-800' : 'text-fuchsia-400 hover:text-fuchsia-300'
                                }`}
                            >
                                @Softimelody
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}