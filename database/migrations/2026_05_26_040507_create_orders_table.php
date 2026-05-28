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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            // Si el cliente está logueado, guardamos su ID. Si no, queda nulo.
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');

            // Datos de envío del formulario
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_address');

            // Datos del negocio
            $table->decimal('total_amount', 8, 2);
            $table->string('status')->default('paid'); // paid, production, shipped
            $table->string('tracking_number')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
