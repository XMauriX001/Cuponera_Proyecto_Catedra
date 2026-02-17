<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'codigo',
        'direccion',
        'nombre_contacto',
        'telefono',
        'correo',
        'password',
        'rubro_id',
        'porcentaje_comision'
    ];

    protected $hidden = ['password'];

    // Una empresa pertenece a un rubro
    public function rubro()
    {
        return $this->belongsTo(Rubro::class);
    }

    // Una empresa tiene muchas ofertas
    public function ofertas()
    {
        return $this->hasMany(Oferta::class);
    }
}
