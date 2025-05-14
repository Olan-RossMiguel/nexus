<?php

namespace App\Events;

use App\Models\Post;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewPostCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $post;

    public function __construct(Post $post)
    {
        $this->post = $post->load('user'); // Carga la relación user
    }

    public function broadcastOn()
    {
        return new Channel('public-posts'); // Canal público
    }

    public function broadcastAs()
    {
        return 'new.post'; // Nombre personalizado del evento
    }
}
