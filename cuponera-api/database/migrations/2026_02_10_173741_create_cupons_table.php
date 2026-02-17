<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('cupones', function (Blueprint $table) {
        $table->id();
        $table->string('codigo')->unique(); 
        $table->foreignId('cliente_id')->constrained('clientes'); 
        $table->foreignId('oferta_id')->constrained('ofertas'); 
        $table->decimal('precio_pagado', 8, 2); 
        $table->enum('estado', [
            'disponible', 
            'canjeado', 
            'vencido'
        ])->default('disponible');
        $table->timestamp('fecha_compra')->useCurrent();
        $table->timestamp('fecha_canje')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cupones');
    }
};
