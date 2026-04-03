<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
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

    public function getEmailForPasswordReset()
    {
        return $this->correo;
    }
    
    public function routeNotificationForMail($notification)
    {
        return $this->correo;
    }

    /**
     * Personaliza la URL para el frontend de React
     */
    public function sendPasswordResetNotification($token)
    {
        $url = 'http://localhost:5173/reset-password?token=' . $token . '&email=' . urlencode($this->correo);

        $this->notify(new \Illuminate\Auth\Notifications\ResetPassword($url));
    }


    public function cupones()
    {
        return $this->hasMany(Cupon::class, 'cliente_id');
    }
}
