<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;
use Illuminate\Support\Facades\Hash;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        $empresas = [
            [
                'nombre' => 'Pizza Hut',
                'codigo' => 'PIZ001',
                'direccion' => 'Centro Comercial Multiplaza',
                'nombre_contacto' => 'Juan Pérez',
                'telefono' => '2222-3333',
                'correo' => 'contacto@pizzahut.sv',
                'password' => Hash::make('password123'),
                'rubro_id' => 1,
                'porcentaje_comision' => 15.00,
            ],
            [
                'nombre' => 'Salon Glamour',
                'codigo' => 'GLM001',
                'direccion' => 'Colonia Escalón',
                'nombre_contacto' => 'María López',
                'telefono' => '2233-4444',
                'correo' => 'info@glamour.sv',
                'password' => Hash::make('password123'),
                'rubro_id' => 2,
                'porcentaje_comision' => 10.00,
            ],
            [
                'nombre' => 'Cinemark',
                'codigo' => 'CIN001',
                'direccion' => 'La Gran Via',
                'nombre_contacto' => 'Carlos Ramírez',
                'telefono' => '2244-5555',
                'correo' => 'contacto@cinemark.sv',
                'password' => Hash::make('password123'),
                'rubro_id' => 3,
                'porcentaje_comision' => 12.00,
            ],
        ];

        foreach ($empresas as $empresa) {
            Empresa::create($empresa);
        }
    }
}
