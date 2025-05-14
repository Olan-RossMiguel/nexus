<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Follow>
 */
class FollowFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
{
    $follower = User::inRandomOrder()->first() ?? User::factory()->create();
    
    // Asegurarse que followed sea distinto
    do {
        $followed = User::inRandomOrder()->first() ?? User::factory()->create();
    } while ($follower->id === $followed->id);

    return [
        'follower_id' => $follower->id,
        'followed_id' => $followed->id,
    ];
}
}
