<?php

namespace App\Http\Controllers;

use App\Events\NewPostCreated;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log; // Añade esta línea

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content_text' => 'required|string|max:5000',
            'media_url' => 'nullable|file|mimes:jpg,png,jpeg,gif,pdf,mp4,mov|max:10240',
            'tempId' => 'sometimes|string' // Añade esto para recibir el ID temporal
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        $post = $user->posts()->create([
            'content_text' => $validated['content_text']
        ]);

        if ($request->hasFile('media_url')) {
            $file = $request->file('media_url');
            $path = $file->store("posts/{$user->id}", 'private');

            $post->update([
                'media_url' => $path,
                'media_type' => $this->getMediaType($file)
            ]);
        }

        // Carga explícita de la relación user
        $post->load(['user' => function ($query) {
            $query->select('id', 'name', 'profile_picture');
        }]);

        return back()->with([
            'flash' => [
                'success' => 'Publicación creada con éxito',
                'newPost' => $post->load('user'),
                'tempId' => $request->input('tempId'), // Incluimos el tempId
                'action' => 'create' // Identificador para el frontend
            ]
        ]);
    }

    private function getMediaType($file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $mimeType = $file->getMimeType();

        if (str_starts_with($mimeType, 'image/')) {
            return $mimeType === 'image/gif' ? 'gif' : 'image';
        }

        return match ($extension) {
            'pdf' => 'pdf',
            'mp4', 'mov' => 'video',
            default => 'file',
        };
    }

    public function showMedia(int $userId, string $filename)
    {
        $path = "posts/{$userId}/{$filename}";

        /** @var \Illuminate\Filesystem\FilesystemAdapter $storage */
        $storage = Storage::disk('private');

        if (!$storage->exists($path)) {
            abort(404);
        }

        if (Auth::id() !== $userId) {
            abort(403);
        }

        return response()->file(
            $storage->path($path),
            ['Content-Type' => $storage->mimeType($path)] // Ahora el IDE reconocerá el método
        );
    }
    public function index()
    {
        $posts = Post::with([
            'user:id,name,profile_picture',
            'allComments.user:id,name,profile_picture',
            'allComments.replies.user:id,name,profile_picture',
            'likes.user:id' // Relación de likes con usuario
        ])
            ->withCount([
                'allComments as comments_count',
                'likes as likes_count' // Nombre explícito para el conteo
            ])
            ->latest()
            ->get()
            ->map(function ($post) {
                // Verificación más eficiente del like del usuario
                $isLiked = auth()->check()
                    ? $post->likes->where('user_id', auth()->id())->isNotEmpty()
                    : false;

                // Procesamiento de comentarios
                $groupedComments = $post->allComments->groupBy('parent_comment_id');

                $mainComments = $groupedComments->get(null, collect())->map(function ($comment) use ($groupedComments) {
                    $replies = $groupedComments->get($comment->id, collect())->map(function ($reply) {
                        return [
                            'id' => $reply->id,
                            'content' => $reply->content,
                            'created_at' => $reply->created_at,
                            'user' => $reply->user->only(['id', 'name', 'profile_picture_url'])
                        ];
                    });

                    return [
                        'id' => $comment->id,
                        'content' => $comment->content,
                        'created_at' => $comment->created_at,
                        'user' => $comment->user->only(['id', 'name', 'profile_picture_url']),
                        'replies' => $replies->toArray()
                    ];
                });

                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'created_at' => $post->created_at,
                    'user' => $post->user->only(['id', 'name', 'profile_picture_url']),
                    'comments_count' => $post->comments_count,
                    'likes_count' => $post->likes_count, // Usa el conteo cargado con withCount
                    'is_liked' => $isLiked,
                    'comments' => $mainComments->values()->toArray(), // Asegura array indexado
                ];
            });

        return Inertia::render('Muro/Index', [
            'posts' => $posts,
        ]);
    }


    // Ejemplo en PostController.php
    public function getPostsWithUsers()
    {
        $posts = Post::with(['user' => function ($query) {
            $query->select('id', 'name', 'profile_picture');
        }])->get();

        return response()->json([
            'posts' => $posts->map(function ($post) {
                return [
                    'id' => $post->id,
                    'content' => $post->content,
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                        'profile_picture_url' => $post->user->profile_picture_url
                    ]
                ];
            })
        ]);
    }
    // En PostController.php
    public function update(Request $request, Post $post)
    {
        $this->authorize('update', $post);

        $validated = $request->validate([
            'content_text' => 'required|string|max:5000'
        ]);

        $post->update($validated);

        return response()->json([
            'success' => true,
            'post' => $post->fresh() // Devuelve el post actualizado
        ]);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return response()->json(['success' => true]);
    }
}

//ME QUEDÉ HASTA AQUÍ, FALTA PONER LO DE LIKE Y COMMENTS