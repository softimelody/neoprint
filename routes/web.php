<?php

use App\Http\Controllers\DesignController;
use App\Http\Controllers\ProfileController;
use App\Models\Order;
use App\Models\Category;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\CheckoutController;
use App\Models\Design;

Route::get('/', function () {
    // CAMBIO: Usamos Design::with('user') en lugar de DB::table
    $ultimosDisenos = Design::with('user')
        ->latest() // Es equivalente a ->orderByDesc('created_at')
        ->take(8)
        ->get();

    $dbCategories = Category::orderBy('name')->pluck('name')->toArray();
    $categories = array_merge(['Todos'], $dbCategories);

    return Inertia::render('Welcome', [
        'designs' => $ultimosDisenos,
        'categories' => $categories,
    ]);
});
Route::get('/artist/{id}', [App\Http\Controllers\DesignController::class, 'showArtist'])->name('artist.show');
Route::get('/design/{id}', function ($id) {
    // Usamos el modelo Design y cargamos la relación 'user'
    $design = Design::with('user')->findOrFail($id);

    return Inertia::render('DesignDetail', [
        'design' => $design
    ]);
})->name('design.show');

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout');

Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

Route::get('/dashboard', function () {
    // CAMBIO: Usamos Design::with('user')
    $misDisenos = Design::with('user')
        ->where('user_id', Auth::id())
        ->latest()
        ->get();

    $dbCategories = Category::orderBy('name')->pluck('name')->toArray();
    $categories = array_merge(['Todos'], $dbCategories);

    return Inertia::render('Dashboard', [
        'designs' => $misDisenos,
        'categories' => $categories,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/mi-cuenta', function () {
    // Buscamos las órdenes que pertenezan al ID del usuario actual
    // Cargamos en cascada sus items y el diseño asociado a cada item
    $orders = Order::where('user_id', Auth::id())
        ->with('items.design')
        ->latest() // Las más recientes primero
        ->get();

    return Inertia::render('MyAccount', [
        'orders' => $orders
    ]);
})->middleware(['auth', 'verified'])->name('my-account');

Route::middleware('auth')->group(function () {
    // Rutas de Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Rutas de Diseños
    Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');
    
    // Rutas de Checkout que SÍ necesitan que el usuario esté logueado
    Route::post('/checkout/procesar', [CheckoutController::class, 'store'])->name('checkout.store');
    Route::get('/checkout/exito', [CheckoutController::class, 'success'])->name('checkout.success');
});

// =========================================================================
// RUTAS PÚBLICAS DE FLOW (Fuera del middleware auth)
// =========================================================================
Route::post('/checkout/retorno', [CheckoutController::class, 'returnUrl'])->name('checkout.return');
Route::post('/checkout/confirmar', [CheckoutController::class, 'confirm'])->name('checkout.confirm');

require __DIR__ . '/auth.php';
