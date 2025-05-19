<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class MuroController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Muro/Index', [
            'posts' => Post::query()
                ->with([
                    'user' => fn($query) => $query->select('id', 'name', 'profile_picture'),
                    'likes.user:id',
                    'comments' => fn($query) => $query->with([
                        'user:id,name,profile_picture',
                        'replies' => fn($q) => $q->with('user:id,name,profile_picture')->latest()
                    ])->latest()
                ])
                ->withCount(['likes', 'comments'])
                ->latest()
                ->get()
                ->map(function ($post) use ($user) {
                    return [
                        'id' => $post->id,
                        'content_text' => $post->content_text,
                        'media_url' => $post->media_url,
                        'media_type' => $post->media_type,
                        'created_at' => $post->created_at->toISOString(),
                        'updated_at' => $post->updated_at->toISOString(),
                        'user' => [
                            'id' => (string)$post->user->id,
                            'name' => $post->user->name,
                            'profile_picture' => $post->user->profile_picture
                        ],
                        'is_liked' => $user ? $post->likes->contains('user_id', $user->id) : false,
                        'comments' => $post->comments->map(function ($comment) {
                            return [
                                'id' => $comment->id,
                                'content' => $comment->content,
                                'created_at' => $comment->created_at->toISOString(),
                                'user' => $comment->user,
                                'replies' => $comment->replies->map(function ($reply) {
                                    return [
                                        'id' => $reply->id,
                                        'content' => $reply->content,
                                        'created_at' => $reply->created_at->toISOString(),
                                        'user' => $reply->user
                                    ];
                                })
                            ];
                        }),
                        'comments_count' => $post->comments_count,
                        'likes_count' => $post->likes_count
                    ];
                }),
            'user' => $user ? [
                'id' => (string)$user->id,
                'name' => $user->name,
                'profile_picture' => $user->profile_picture
            ] : null,
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
