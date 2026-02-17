<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Oferta extends Model
{
    use HasFactory;

    protected $table = 'ofertas';

    protected $fillable = [
        'empresa_id',
        'titulo',
        'precio_regular',
        'precio_oferta',
        'fecha_inicio',
        'fecha_fin',
        'fecha_limite_cupon',
        'cantidad_limite',
        'descripcion',
        'otros_detalles',
        'estado',
        'justificacion_rechazo'
    ];

    /**
     * Relación: Una oferta pertenece a un Rubro A TRAVÉS de la Empresa.
     */
    public function rubro()
    {
        //accedemos mediante la empresa:
        return $this->empresa->rubro();
    }

    /**
     * Relación: Una oferta pertenece a una Empresa.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'empresa_id');
    }

    /**
     * Relación: Una oferta tiene muchos cupones.
     */
    public function cupones()
    {
        return $this->hasMany(Cupon::class, 'oferta_id');
    }
}
