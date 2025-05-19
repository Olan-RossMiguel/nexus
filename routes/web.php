<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
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
// En routes/web.php temporalmente
Route::get('/debug-comments', function () {
    $post = \App\Models\Post::with('comments.user')->first();
    return [
        'post_id' => $post->id,
        'comments_count' => $post->comments->count(),
        'first_comment' => $post->comments->first() ? [
            'id' => $post->comments->first()->id,
            'content' => $post->comments->first()->content,
            'user' => $post->comments->first()->user->name
        ] : null
    ];
});
Route::middleware('auth')->group(function () {
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->middleware('auth');
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
    Route::post('posts/{post}/like', [LikeController::class, 'toggleLike'])
    ->name('posts.like')
    ->middleware('auth');
    // routes/web.php
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])
        ->middleware(['auth', 'verified']);
  
    Route::post('/posts/{post}/comment', [PostController::class, 'comment'])->middleware('auth');
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::put('/posts/{post}', [PostController::class, 'update']);
    Route::delete('/posts/{post}', [PostController::class, 'destroy']);
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

require __DIR__ . '/auth.php';
