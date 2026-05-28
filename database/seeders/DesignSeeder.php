<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Design;

class DesignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Esto le dice a Laravel: Usa el molde para crear 30 diseños en la base de datos de SQLite
        Design::factory()->count(30)->create();
    }
}
