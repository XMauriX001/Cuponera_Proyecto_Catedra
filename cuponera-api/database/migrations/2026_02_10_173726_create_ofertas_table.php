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
    Schema::create('ofertas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('empresa_id')->constrained('empresas');
        $table->foreignId('rubro_id')->constrained('rubros'); 
        $table->string('titulo'); 
        $table->decimal('precio_regular', 8, 2); 
        $table->decimal('precio_oferta', 8, 2); 
        $table->date('fecha_inicio'); 
        $table->date('fecha_fin'); 
        $table->date('fecha_limite_cupon'); 
        $table->integer('cantidad_limite')->nullable(); 
        $table->text('descripcion');
        $table->text('otros_detalles')->nullable();
        $table->enum('estado', [
            'en_espera', 
            'aprobada', 
            'rechazada', 
            'descartada'
        ])->default('aprobada'); 
        $table->text('justificacion_rechazo')->nullable();
        $table->timestamps();
         
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ofertas');
    }
};
