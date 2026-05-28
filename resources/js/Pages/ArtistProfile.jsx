import { Head } from '@inertiajs/react';

export default function ArtistProfile({ artist, designs, isAero }) {
    return (
        <div className={`min-h-screen p-8 ${isAero ? 'bg-blue-50' : 'bg-slate-950 text-white'}`}>
            <div className="max-w-4xl mx-auto text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 mb-4 shadow-xl"></div>
                <h1 className="text-4xl font-black">{artist.name}</h1>
                <p className="opacity-70">Diseñador/a en NeoPrint</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {designs.map(design => (
                        <div key={design.id} className="p-4 bg-slate-800 rounded-2xl">
                            <img src={`/storage/${design.image_path}`} className="rounded-xl mb-2" />
                            <h3 className="font-bold">{design.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}