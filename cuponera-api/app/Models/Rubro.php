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
            Oferta::class,    
            Empresa::class,   
            'rubro_id',       
            'empresa_id', 
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
