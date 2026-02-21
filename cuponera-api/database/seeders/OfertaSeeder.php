<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Oferta;

class OfertaSeeder extends Seeder
{
    public function run(): void
    {
        $ofertas = [
            // Pizza Hut (Restaurantes = rubro_id 1)
            [
                'empresa_id' => 1,
                'rubro_id' => 1,
                'titulo' => '2x1 en Pizzas Medianas',
                'precio_regular' => 25.00,
                'precio_oferta' => 15.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => 100,
                'descripcion' => 'Lleva 2 pizzas medianas al precio de 1',
                'otros_detalles' => 'Válido de lunes a jueves',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 1,
                'rubro_id' => 1,
                'titulo' => 'Combo Familiar',
                'precio_regular' => 35.00,
                'precio_oferta' => 22.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => null,
                'descripcion' => '1 Pizza grande + 8 alitas + 2 litros de bebida',
                'otros_detalles' => 'Disponible todos los días',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 1,
                'rubro_id' => 1,
                'titulo' => 'Combo Personal',
                'precio_regular' => 10.00,
                'precio_oferta' => 4.99,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-03-01',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => 150,
                'descripcion' => '1 Pizza personal + bebida + acompañamiento',
                'otros_detalles' => 'Ideal para una persona',
                'estado' => 'aprobada',
            ],

            // Salon Glamour (Salones de Belleza = rubro_id 2)
            [
                'empresa_id' => 2,
                'rubro_id' => 2,
                'titulo' => 'Corte + Tinte',
                'precio_regular' => 80.00,
                'precio_oferta' => 45.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => 50,
                'descripcion' => 'Corte de cabello + aplicación de tinte',
                'otros_detalles' => 'Previa cita',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 2,
                'rubro_id' => 2,
                'titulo' => 'Manicure + Pedicure',
                'precio_regular' => 30.00,
                'precio_oferta' => 18.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => 80,
                'descripcion' => 'Servicio completo de manos y pies',
                'otros_detalles' => 'Incluye esmaltado',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 2,
                'rubro_id' => 2,
                'titulo' => 'Alisado Permanente + Corte',
                'precio_regular' => 60.00,
                'precio_oferta' => 29.99,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-03-05',
                'fecha_limite_cupon' => '2026-03-20',
                'cantidad_limite' => 40,
                'descripcion' => 'Tratamiento completo de hidratación y corte de puntas',
                'otros_detalles' => 'Incluye productos profesionales',
                'estado' => 'aprobada',
            ],

            // Cinemark (Entretenimiento = rubro_id 3)
            [
                'empresa_id' => 3,
                'rubro_id' => 3,
                'titulo' => '2 Boletos + Palomitas',
                'precio_regular' => 18.00,
                'precio_oferta' => 12.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-02-28',
                'fecha_limite_cupon' => '2026-03-15',
                'cantidad_limite' => 200,
                'descripcion' => '2 entradas de cine + 1 palomitas mediana',
                'otros_detalles' => 'Válido de lunes a jueves',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 3,
                'rubro_id' => 3,
                'titulo' => '4 Boletos + Combo Familiar',
                'precio_regular' => 40.00,
                'precio_oferta' => 25.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-03-10',
                'fecha_limite_cupon' => '2026-03-20',
                'cantidad_limite' => 100,
                'descripcion' => 'Entradas válidas para cualquier función 2D + combo gigante',
                'otros_detalles' => 'Incluye 2 palomitas grandes y 4 bebidas',
                'estado' => 'aprobada',
            ],
            [
                'empresa_id' => 3,
                'rubro_id' => 3,
                'titulo' => 'Pase VIP Todo el Día',
                'precio_regular' => 30.00,
                'precio_oferta' => 15.00,
                'fecha_inicio' => '2026-02-01',
                'fecha_fin' => '2026-03-12',
                'fecha_limite_cupon' => '2026-03-25',
                'cantidad_limite' => 75,
                'descripcion' => 'Acceso ilimitado a juegos mecánicos y área de comida',
                'otros_detalles' => 'No incluye juegos de habilidad',
                'estado' => 'aprobada',
            ],
        ];

        foreach ($ofertas as $oferta) {
            Oferta::create($oferta);
        }
    }
}
