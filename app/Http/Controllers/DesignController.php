<?php

namespace App\Http\Controllers;
use App\Models\Design;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DesignController extends Controller
{
    public function showArtist(int $id)
    {
    // Buscamos al usuario (artista) y cargamos sus diseños
    $artist = \App\Models\User::with('designs')->findOrFail($id);

    return \Inertia\Inertia::render('ArtistProfile', [
        'artist' => $artist,
        'designs' => $artist->designs // Aquí tienes solo sus obras
    ]);
}
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        $path = $request->file('image')->store('designs', 'public');

        // AQUÍ EL CAMBIO: Usamos el modelo en lugar de DB::table
        Design::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'category' => $request->category,
            'price' => $request->price,
            'image_path' => $path,
        ]);

        return redirect()->back();
    }
}
