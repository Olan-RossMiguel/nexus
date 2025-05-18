<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    /**
     * Alternar like/unlike en un post
     *
     * @param Post $post
     * @return \Illuminate\Http\RedirectResponse
     */
    
    public function toggleLike(Post $post)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->back()->with('error', 'Debes iniciar sesión para dar like');
        }

        try {
            $liked = $post->likes()->where('user_id', $user->id)->exists();

            if ($liked) {
                $post->likes()->where('user_id', $user->id)->delete();
                $message = 'Like eliminado';
            } else {
                $post->likes()->create(['user_id' => $user->id]);
                $message = 'Like agregado';
            }

            return back()->with([
                'flash' => [
                    'type' => 'success',
                    'message' => $message,
                    'likeStatus' => [
                        'liked' => !$liked,
                        'likes_count' => $post->fresh()->likes_count
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return back()->with([
                'flash' => [
                    'likeStatus' => [
                        'liked' => !$liked,
                        'likes_count' => $post->fresh()->likes_count
                    ]
                ]
            ]);
        }
    }
}
