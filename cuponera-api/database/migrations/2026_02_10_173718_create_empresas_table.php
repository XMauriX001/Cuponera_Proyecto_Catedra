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
    Schema::create('empresas', function (Blueprint $table) {
        $table->id();
        $table->string('nombre'); 
        $table->string('codigo')->unique(); 
        $table->string('direccion');
        $table->string('nombre_contacto');
        $table->string('telefono');
        $table->string('correo')->unique();
        $table->string('password'); 
        $table->foreignId('rubro_id')->constrained('rubros');
        $table->decimal('porcentaje_comision', 5, 2); 
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresas');
    }
};
