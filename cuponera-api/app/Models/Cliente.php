<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Cliente extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombres',
        'apellidos',
        'telefono',
        'correo',
        'password',
        'direccion',
        'dui',
        'cuenta_verificada'
    ];

    protected $hidden = [
        'password',
    ];

    // Relación: Un cliente tiene muchos cupones
    public function cupones()
    {
        return $this->hasMany(Cupon::class, 'cliente_id');
    }
}
