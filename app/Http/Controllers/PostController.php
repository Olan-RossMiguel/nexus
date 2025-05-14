<?php

namespace App\Http\Controllers;

use App\Events\NewPostCreated;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content_text' => 'required|string|max:5000',
            'media_url' => 'nullable|file|mimes:jpg,png,jpeg,gif,pdf,mp4,mov|max:10240'
        ]);
    
        $user = Auth::user();
    
        $postData = [
            'content_text' => $validated['content_text'],
            'user_id' => $user->id
        ];
    
        if ($request->hasFile('media_url')) {
            $file = $request->file('media_url');
            $path = $file->store("posts/{$user->id}", 'private');
            
            $postData['media_url'] = $path;
            $postData['media_type'] = $this->getMediaType($file);
        }
    
        $post = Post::create($postData);
        
        // Mover el event después de crear el post
        event(new NewPostCreated($post));
    
        return redirect()->route('muro.publico')->with([
            'success' => 'Publicación creada con éxito',
            'newPost' => $post->load('user')
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
}


