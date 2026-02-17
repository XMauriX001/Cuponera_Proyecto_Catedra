<?php

namespace App\Http\Controllers;

use App\Models\Cupon;
use App\Models\Oferta;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CuponController extends Controller
{
    // Ver cupones del cliente autenticado
    public function index(Request $request)
    {
        $cupones = Cupon::where('cliente_id', $request->user()->id)
            ->with('oferta.empresa')
            ->get();

        return response()->json($cupones);
    }

    // Comprar un cupón
    public function store(Request $request)
    {
        $request->validate([
            'oferta_id' => 'required|exists:ofertas,id',
        ]);

        $oferta = Oferta::find($request->oferta_id);

        // Verificar que la oferta esté activa
        if ($oferta->estado !== 'aprobada') {
            return response()->json([
                'message' => 'Esta oferta no está disponible'
            ], 400);
        }

        // Verificar que no haya expirado
        if ($oferta->fecha_fin < now()->format('Y-m-d')) {
            return response()->json([
                'message' => 'Esta oferta ha expirado'
            ], 400);
        }

        // Verificar límite de cupones si existe
        if ($oferta->cantidad_limite) {
            $cuponesVendidos = Cupon::where('oferta_id', $oferta->id)->count();
            if ($cuponesVendidos >= $oferta->cantidad_limite) {
                return response()->json([
                    'message' => 'Los cupones de esta oferta se han agotado'
                ], 400);
            }
        }

        // Generar código único: código empresa + 7 dígitos aleatorios
        $codigo = $oferta->empresa->codigo . strtoupper(Str::random(7));

        $cupon = Cupon::create([
            'codigo'       => $codigo,
            'cliente_id'   => $request->user()->id,
            'oferta_id'    => $oferta->id,
            'precio_pagado' => $oferta->precio_oferta,
            'estado'       => 'disponible',
            'fecha_compra' => now(),
        ]);

        return response()->json([
            'message' => 'Cupón comprado exitosamente',
            'cupon'   => $cupon->load('oferta.empresa'),
        ], 200);
    }
}
