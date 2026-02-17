<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'codigo',
        'cliente_id',
        'oferta_id',
        'precio_pagado',
        'estado',
        'fecha_compra',
        'fecha_canje'
    ];

    // Un cupón pertenece a un cliente
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    // Un cupón pertenece a una oferta
    public function oferta()
    {
        return $this->belongsTo(Oferta::class);
    }
}
