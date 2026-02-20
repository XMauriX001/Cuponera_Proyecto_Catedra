<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cupon extends Model
{
    use HasFactory;

    protected $table = 'cupones';
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
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    public function oferta()
    {
        return $this->belongsTo(Oferta::class, 'oferta_id');
    }
}
