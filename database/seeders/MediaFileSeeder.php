<?php

namespace Database\Seeders;

use App\Models\MediaFile;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MediaFileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MediaFile::factory()->count(30)->create();
    }
}
