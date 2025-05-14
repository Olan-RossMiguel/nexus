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

protected $fillable = ['user_id', 'content_text', 'media_url', 'media_type'];

protected $casts = [
    'created_at' => 'datetime:d M, H:i',
];
}
