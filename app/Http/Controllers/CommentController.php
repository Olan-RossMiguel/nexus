<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:1000',
            'parent_comment_id' => 'nullable|exists:comments,id'
        ]);

        $comment = $post->allComments()->create([
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'parent_comment_id' => $validated['parent_comment_id'] ?? null
        ]);

        $comment->load('user:id,name,profile_picture');

        return response()->json([
            'success' => true,
            'comment' => $comment
        ]);
    }
}