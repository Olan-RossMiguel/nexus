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
                ->with([
                    'user' => fn($query) => $query->select('id', 'name', 'profile_picture'),
                    'likes.user:id'
                ])
                ->withCount(['likes'])
                ->latest()
                ->get()
                ->map(function ($post) {
                    return array_merge($post->toArray(), [
                        'is_liked' => Auth::check()
                            ? $post->likes->contains('user_id', Auth::id())
                            : false
                    ]);
                }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function personal()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Muro/Personal', [
            'posts' => $user->posts()
                ->with([
                    'user' => fn($q) => $q->select('id', 'name', 'profile_picture'),
                    'likes.user:id'
                ])
                ->withCount(['likes'])
                ->latest()
                ->get()
                ->map(function ($post) use ($user) {
                    return array_merge($post->toArray(), [
                        'is_liked' => $post->likes->contains('user_id', $user->id)
                    ]);
                }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }

    public function publico()
    {
        return Inertia::render('Muro/Publico', [
            'posts' => Post::with([
                'user',
                'comments',
                'likes.user:id'
            ])
                ->withCount(['likes'])
                ->latest()
                ->paginate(10)
                ->through(function ($post) {
                    return array_merge($post->toArray(), [
                        'is_liked' => Auth::check()
                            ? $post->likes->contains('user_id', Auth::id())
                            : false
                    ]);
                }),
            'flash' => [
                'success' => session('success'),
                'error' => session('error')
            ],
            'newPost' => session('newPost')
        ]);
    }
}
