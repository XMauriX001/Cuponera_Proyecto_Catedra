<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Empresa;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Administrador
        $admin = User::create([
            'name' => 'Administrador Sistema',
            'email' => 'admin@lacuponera.sv',
            'password' => Hash::make('admin123'),
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('administrador');

        // Obtener empresas por correo para vincularlas
        $pizzaHut = Empresa::where('correo', 'contacto@pizzahut.sv')->first();
        $glamour = Empresa::where('correo', 'info@glamour.sv')->first();

        // Empresa
        $admin_empresa1 = User::create([
            'name' => 'Pizza Hut Admin',
            'email' => 'admin@pizzahut.sv',
            'password' => Hash::make('pizza123'),
            'email_verified_at' => now(),
            'empresa_id' => $pizzaHut ? $pizzaHut->id : null,
        ]);
        $admin_empresa1->assignRole('admin_empresa');

        // Empresa
        $admin_empresa2 = User::create([
            'name' => 'Glamour Admin',
            'email' => 'admin@glamour.sv',
            'password' => Hash::make('glamour123'),
            'email_verified_at' => now(),
            'empresa_id' => $glamour ? $glamour->id : null, 
        ]);
        $admin_empresa2->assignRole('admin_empresa');

        // Empleado
        $empleado1 = User::create([
            'name' => 'Juan Pérez',
            'email' => 'empleado@pizzahut.sv',
            'password' => Hash::make('empleado123'),
            'email_verified_at' => now(),
            'empresa_id' => $pizzaHut ? $pizzaHut->id : null, 
        ]);
        $empleado1->assignRole('empleado');
    }
}