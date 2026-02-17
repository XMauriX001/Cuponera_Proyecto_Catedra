<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rubro extends Model
{
    use HasFactory;

    protected $fillable = ['nombre', 'descripcion'];

    /**
     * 
     */
    public function ofertas()
    {
        return $this->hasManyThrough(
            Oferta::class,    // El modelo final al que queremos llegar
            Empresa::class,   // El modelo intermedio
            'rubro_id',       // Clave foránea en la tabla empresas
            'empresa_id',     // Clave foránea en la tabla ofertas 
            'id',
            'id'
        );
    }

    /**
     
     */
    public function empresas()
    {
        return $this->hasMany(Empresa::class, 'rubro_id');
    }
}
