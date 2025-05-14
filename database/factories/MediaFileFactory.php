<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MediaFile>
 */
class MediaFileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::inRandomOrder()->first()?->id ?? Post::factory(),
            'file_url' => $this->faker->imageUrl(), // Simula una URL de archivo (puedes ajustar esto según tipo)
            'file_type' => $this->faker->randomElement(['image', 'gif', 'pdf', 'video']),
        ];
    }
}
