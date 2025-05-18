<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['content', 'user_id', 'post_id', 'parent_comment_id'];
    
    protected $with = ['user']; // Carga automática del usuario

    public function user()
    {
        return $this->belongsTo(User::class)->select('id', 'name', 'profile_picture');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // Para comentarios anidados (si los usas)
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_comment_id')->with('user');
    }
}