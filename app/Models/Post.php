<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}

protected $fillable = [
    'content_text', 
    'media_url', 
    'media_type',
    'likes_count',
    'comments_count'
];

// Relación con likes
public function likes() {
    return $this->hasMany(Like::class);
}

// Relación con comentarios
public function comments() {
    return $this->hasMany(Comment::class)->latest();
}

// Verifica si el usuario actual dio like
public function isLikedBy(User $user) {
    return $this->likes()->where('user_id', $user->id)->exists();
}


protected $casts = [
    'created_at' => 'datetime:d M, H:i',
];
}
