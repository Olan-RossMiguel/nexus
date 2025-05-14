<?php

namespace Database\Seeders;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FollowSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $follower) {
            // Elegimos de 1 a 3 personas aleatorias para seguir
            $followedUsers = User::where('id', '!=', $follower->id)
                                ->inRandomOrder()
                                ->take(rand(1, 3))
                                ->get();

            foreach ($followedUsers as $followed) {
                Follow::firstOrCreate([
                    'follower_id' => $follower->id,
                    'followed_id' => $followed->id,
                ]);
            }
        }
    }
}
