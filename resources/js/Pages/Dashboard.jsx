import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ auth, designs, categories }) {
    // Lógica del Tema Global
    const [theme, setTheme] = useState(() => localStorage.getItem('neoprint-theme') || 'cyberpunk');
    const isAero = theme === 'frutiger';

    // Escuchar cambios de tema entre pestañas
    useEffect(() => {
        const handleStorage = () => setTheme(localStorage.getItem('neoprint-theme') || 'cyberpunk');
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const { data, setData, post, processing } = useForm({
        title: '',
        description: '',
        category: '',
        price: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('designs.store'), {
            onSuccess: () => setData({ title: '', description: '', category: '', price: '', image: null }),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className={`font-black text-2xl leading-tight ${isAero ? 'text-blue-900' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500'}`}>Panel del Creador</h2>}
        >
            <Head title="Dashboard | NeoPrint" />

            <div className={`min-h-screen transition-colors duration-700 ${isAero ? 'bg-gradient-to-br from-blue-100 to-emerald-50' : 'bg-slate-950'}`}>
                
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 py-12">
                    {/* Formulario de Subida */}
                    <div className={`backdrop-blur-xl border shadow-2xl sm:rounded-3xl p-8 transition-colors duration-700 ${
                        isAero ? 'bg-white/50 border-white/60 text-slate-800' : 'bg-slate-900/80 border-slate-800 text-white'
                    }`}>
                        <h3 className="text-3xl font-bold mb-6">Sube tu nueva obra</h3>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className={`block font-semibold mb-2 ${isAero ? 'text-blue-700' : 'text-cyan-400'}`}>Título del Diseño</label>
                                <input 
                                    type="text" 
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 transition ${isAero ? 'bg-white/50 border-blue-200 focus:ring-blue-400' : 'bg-slate-950 border-slate-700 focus:ring-fuchsia-500'}`}
                                    placeholder="Ej: Cyberpunk City 2099"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block font-semibold mb-2 ${isAero ? 'text-blue-700' : 'text-cyan-400'}`}>Descripción</label>
                                <textarea
                                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 transition ${isAero ? 'bg-white/50 border-blue-200 focus:ring-blue-400' : 'bg-slate-950 border-slate-700 focus:ring-fuchsia-500'}`}
                                    placeholder="Describe tu obra (material, inspiración, notas...)"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className={`block font-semibold mb-2 ${isAero ? 'text-blue-700' : 'text-cyan-400'}`}>Categoría</label>
                                    <select
                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 transition ${isAero ? 'bg-white/50 border-blue-200 focus:ring-blue-400' : 'bg-slate-950 border-slate-700 focus:ring-fuchsia-500'}`}
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        required
                                    >
                                        <option value="">Selecciona una categoría</option>
                                        {Array.isArray(categories) && categories.filter(c => c !== 'Todos').map((cat) => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block font-semibold mb-2 ${isAero ? 'text-blue-700' : 'text-cyan-400'}`}>Precio (USD)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className={`w-full border rounded-lg px-4 py-3 focus:ring-2 transition ${isAero ? 'bg-white/50 border-blue-200 focus:ring-blue-400' : 'bg-slate-950 border-slate-700 focus:ring-fuchsia-500'}`}
                                        placeholder="Ej: 24.99"
                                        value={data.price}
                                        onChange={e => setData('price', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Área de carga de archivo */}
                            <div className={`relative overflow-hidden border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${isAero ? 'border-blue-300 hover:bg-blue-50' : 'border-slate-600 hover:border-fuchsia-500 hover:bg-slate-800/50'}`}>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={e => setData('image', e.target.files[0])} />
                                <div className="text-4xl mb-2">✨</div>
                                <p className={isAero ? 'text-slate-600' : 'text-slate-300'}>Haz clic para seleccionar tu arte</p>
                                {data.image && <p className="text-cyan-500 font-bold mt-2">{data.image.name}</p>}
                            </div>

                            <button type="submit" disabled={processing} className={`w-full py-4 rounded-xl font-black text-lg transition-all ${
                                isAero ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white hover:shadow-lg'
                            }`}>
                                {processing ? 'Publicando...' : 'Publicar en NeoPrint'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Galería */}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-12 pb-20">
                    <h3 className={`text-3xl font-extrabold mb-8 ${isAero ? 'text-slate-800' : 'text-white'}`}>Mi Galería</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {designs.map((design) => (
                            <div key={design.id} className={`rounded-2xl border overflow-hidden shadow-xl ${isAero ? 'bg-white/40 border-white/60' : 'bg-slate-900/80 border-slate-700'}`}>
                                <img src={`/storage/${design.image_path}`} alt={design.title} className="w-full h-48 object-cover"/>
                                <div className="p-4">
                                    <h4 className={`font-bold ${isAero ? 'text-slate-800' : 'text-white'}`}>{design.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}