<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    // En tu CommentController.php
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_comment_id' => 'nullable|exists:comments,id'
        ]);

        $comment = $post->comments()->create([
            'content' => $validated['content'],
            'user_id' => auth()->id(), // Asegura que se guarde con tu ID
            'parent_comment_id' => $validated['parent_comment_id'] ?? null
        ]);

        // Carga la relación user
        $comment->load('user:id,name,profile_picture');

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }

    public function update(Request $request, Comment $comment)
    {
        // Verifica autorización
        $this->authorize('update', $comment);

        $validated = $request->validate([
            'content' => 'required|string|max:1000'
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'comment' => $comment->load('user:id,name,profile_picture')
        ]);
    
    }

    public function destroy(Comment $comment)
    {
        // Verifica autorización
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comentario eliminado'
        ]);
    }
}
