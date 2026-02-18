<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Rubro;

class RubroSeeder extends Seeder
{
    public function run(): void
    {
        $rubros = [
            ['nombre' => 'Restaurantes', 'descripcion' => 'Comida y bebidas'],
            ['nombre' => 'Salones de Belleza', 'descripcion' => 'Cuidado personal y estética'],
            ['nombre' => 'Entretenimiento', 'descripcion' => 'Cine, teatro y diversión'],
            ['nombre' => 'Talleres', 'descripcion' => 'Servicios automotrices'],
        ];

        foreach ($rubros as $rubro) {
            Rubro::create($rubro);
        }
    }
}
