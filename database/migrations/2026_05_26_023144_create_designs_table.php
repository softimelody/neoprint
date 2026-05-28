<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('designs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Conecta el diseño con el artista creador
            $table->string('title'); // Ej: "Cyberpunk City 2099"
            $table->text('description')->nullable();
            $table->string('image_path'); // Aquí guardaremos la ruta de la imagen en alta resolución
            $table->boolean('is_published')->default(true); // Para ocultar o mostrar en la tienda
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('designs');
    }
};
