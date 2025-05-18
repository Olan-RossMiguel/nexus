<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_picture'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
    public function likes()
{
    return $this->hasMany(Like::class);
}

     public function getProfilePictureUrlAttribute()
    {
        if (!$this->profile_picture) {
            return $this->getDefaultAvatarUrl();
        }
        
        return Storage::exists('public/'.$this->profile_picture) 
            ? asset('storage/'.$this->profile_picture)
            : $this->getDefaultAvatarUrl();
    }

    protected function getDefaultAvatarUrl()
    {
        return asset('images/default-avatar.png'); // Moveremos el avatar por defecto a public/images/
    }

}
