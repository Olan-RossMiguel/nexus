<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth; // Importa el facade Auth

class Post extends Model
{
    protected $fillable = [
        'content_text',
        'media_url',
        'media_type',
        'likes_count'
    ];

    // Carga automática de relaciones
    protected $with = ['user', 'comments'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->select('id', 'name', 'profile_picture');
    }

   // app/Models/Post.php

/**
 * Relación con los likes del post
 */
public function likes(): HasMany
{
    return $this->hasMany(Like::class);
}

/**
 * Verifica si un usuario específico dio like al post
 */
public function likedBy(User $user): bool
{
    if (!$user) return false;
    
    return $this->likes()
        ->where('user_id', $user->id)
        ->exists();
}

/**
 * Accesor para verificar si el usuario actual dio like
 */
public function getIsLikedAttribute(): bool
{
    if (!Auth::check()) { // Usa Auth::check() en lugar de auth()
        return false;
    }
    return $this->likes()
        ->where('user_id', Auth::id()) // Usa Auth::id()
        ->exists();
}

/**
 * Accesor para el conteo de likes
 */
public function getLikesCountAttribute(): int
{
    if (array_key_exists('likes_count', $this->attributes)) {
        return (int) $this->attributes['likes_count'];
    }
    return $this->likes()->count();
}


    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->with(['user', 'replies.user']) // Carga eager de relaciones
            ->latest(); // Ordena por los más recientes primero
    }
    
    /**
     * Relación para obtener TODOS los comentarios (principales y respuestas)
     * Esta relación es idéntica a comments() pero sin el whereNull
     * Podríamos eliminar esta relación y usar comments() directamente
     */
    public function allComments(): HasMany
    {
        return $this->hasMany(Comment::class)
            ->with(['user', 'replies.user'])
            ->latest();
    }
    
    /**
     * Accesor para el conteo de comentarios
     * Prioriza el valor pre-calculado (comments_count) si existe
     * Si no, realiza un conteo en tiempo real
     */
    public function getCommentsCountAttribute()
    {
        // Si ya tenemos un count calculado (ej. desde withCount)
        if (array_key_exists('comments_count', $this->attributes)) {
            return $this->attributes['comments_count'];
        }
        
        // Si no, contamos todos los comentarios (incluye respuestas)
        return $this->allComments()->count();
    }


    
    protected $casts = [
        'created_at' => 'datetime:d M, H:i',
    ];
}
