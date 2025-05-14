<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MuroController;
use App\Http\Controllers\PostController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/private/media/{userId}/{filename}', [PostController::class, 'showMedia'])
    ->middleware('auth')
    ->name('private.media');
// Rutas protegidas (requieren login)
Route::middleware('auth')->group(function () {
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::get('/private/media/{userId}/{filename}', [PostController::class, 'showMedia'])
         ->name('private.media');
    // Muro
    Route::get('/muro', [MuroController::class, 'index'])->name('muro.publico');
    Route::get('/mi-muro', [MuroController::class, 'personal'])->name('muro.personal');
    
    // Perfil
    Route::get('/profile/{user}', [ProfileController::class, 'show'])->name('profile.show');
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
