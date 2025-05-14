<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class MuroController extends Controller
{
    public function index()
    {
        return Inertia::render('Muro/Index', [
            'posts' => Post::query()
                ->with(['user' => fn($query) => $query->select('id', 'name', 'profile_picture')])
                ->latest()
                ->get(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function personal()
    {
        $user = Auth::user();
        
        return Inertia::render('Muro/Personal', [
            'posts' => $user->posts()
                ->with(['user' => fn($q) => $q->select('id', 'name')])
                ->latest()
                ->get(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function publico()
    {
        return Inertia::render('Muro/Publico', [
            'posts' => Post::with(['user', 'comments'])
                ->latest()
                ->paginate(10),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ],
            'newPost' => session('newPost')
        ]);
    }
}
