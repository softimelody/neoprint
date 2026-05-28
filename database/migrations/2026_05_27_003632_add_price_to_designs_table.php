<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('designs', function (Blueprint $table) {
            // Agregamos la columna 'price' como decimal. 8 dígitos en total, 2 decimales.
            $table->decimal('price', 8, 2)->nullable()->after('category');
        });
    }

    public function down(): void
    {
        Schema::table('designs', function (Blueprint $table) {
            $table->dropColumn('price');
        });
    }
};