<?php

namespace Database\Factories;

use App\Models\Design;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Design>
 */
class DesignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
      public function definition(): array
    {
        // Las categorías exactas que usas en tu Welcome.jsx
        $categories = ['Anime', 'Gaming', 'Cyberpunk', 'Streetwear'];

        return [
            // Genera un nombre de producto aleatorio con estilo tech/creativo
            'title' => fake()->words(3, true), 
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement($categories),
            // Un precio aleatorio entre 9.99 y 49.99
            'price' => fake()->randomFloat(2, 9, 49), 
            // Todas las tarjetas usarán la misma imagen de prueba por ahora
            'image_path' => 'placeholder.png', 
            // Si tus diseños están amarrados a un usuario, asúgnalos al usuario ID 1 (tú)
            'user_id' => 1, 
        ];
    }
}
