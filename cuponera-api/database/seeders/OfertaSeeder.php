<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Oferta;
use Carbon\Carbon;

class OfertaSeeder extends Seeder
{
    public function run(): void
    {
        $ahora = Carbon::now();
        $ofertas = [];

        $datosRubros = [
            1 => [ 
                'empresa_id' => 1,
                'titulos' => ['2x1 en Pizzas Medianas', 'Combo Familiar Gigante', 'Almuerzo Ejecutivo'],
                'precios' => [[25, 15], [35, 22], [12, 7.99]]
            ],
            2 => [
                'empresa_id' => 2,
                'titulos' => ['Corte + Tinte Global', 'Manicure y Pedicure Spa', 'Alisado de Keratina'],
                'precios' => [[80, 45], [30, 18], [120, 65]]
            ],
            3 => [ 
                'empresa_id' => 3,
                'titulos' => ['Pack 2 Entradas + Combo', 'Cumpleaños en el Cine', 'Pase Anual VIP'],
                'precios' => [[20, 12.50], [150, 99], [300, 199]]
            ]
        ];


        foreach ($datosRubros as $rubroId => $info) {
            for ($i = 0; $i < 3; $i++) {
                $ofertas[] = [
                    'empresa_id' => $info['empresa_id'],
                    'rubro_id' => $rubroId,
                    'titulo' => $info['titulos'][$i],
                    'precio_regular' => $info['precios'][$i][0],
                    'precio_oferta' => $info['precios'][$i][1],
                    'fecha_inicio' => $ahora->copy()->subDays(rand(1, 5))->format('Y-m-d'),
                    'fecha_fin' => $ahora->copy()->addDays(rand(10, 20))->format('Y-m-d'),
                    'fecha_limite_cupon' => $ahora->copy()->addDays(30)->format('Y-m-d'),
                    'cantidad_limite' => 100,
                    'descripcion' => 'Descripción de prueba para ' . $info['titulos'][$i],
                    'otros_detalles' => 'Válido en todas las sucursales',
                    'estado' => 'aprobada', 
                ];
            }
        }

        $ofertas[] = [
            'empresa_id' => 1,
            'rubro_id' => 1,
            'titulo' => 'Pizza Gratis de por vida',
            'precio_regular' => 1000,
            'precio_oferta' => 0,
            'fecha_inicio' => $ahora->format('Y-m-d'),
            'fecha_fin' => $ahora->addDays(5)->format('Y-m-d'),
            'fecha_limite_cupon' => $ahora->addDays(10)->format('Y-m-d'),
            'cantidad_limite' => 1,
            'descripcion' => 'Esta oferta será rechazada por el admin de la cuponera',
            'otros_detalles' => 'No cumple las políticas',
            'estado' => 'rechazada', 
        ];

        $ofertas[] = [
            'empresa_id' => 2, 
            'rubro_id' => 2,
            'titulo' => 'Cambio de look extremo gratis',
            'precio_regular' => 50,
            'precio_oferta' => 0,
            'fecha_inicio' => $ahora->format('Y-m-d'),
            'fecha_fin' => $ahora->addDays(5)->format('Y-m-d'),
            'fecha_limite_cupon' => $ahora->addDays(10)->format('Y-m-d'),
            'cantidad_limite' => 5,
            'descripcion' => 'Oferta de prueba rechazada',
            'otros_detalles' => 'Faltan detalles técnicos',
            'estado' => 'rechazada',
        ];

        foreach ($ofertas as $oferta) {
            Oferta::create($oferta);
        }
    }
}
