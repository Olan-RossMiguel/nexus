<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
    // Opciones válidas para media_type
    $mediaTypes = ['image', 'gif', 'pdf', 'video', 'none'];

    // Elegimos un tipo aleatorio
    $mediaType = $this->faker->randomElement($mediaTypes);

    // Si no hay media, la URL será null
    $mediaUrl = $mediaType === 'none'
        ? null
        : $this->faker->imageUrl(640, 480, 'science', true, 'Post');

    return [
        'user_id' => User::factory(), // Se asocia automáticamente a un user falso
        'content_text' => $this->faker->paragraphs(2, true),
        'media_url' => $mediaUrl,
        'media_type' => $mediaType,
    ];
    }
}
