<?php

namespace App\Http\Controllers;

use App\Models\Cupon;
use App\Models\Oferta;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CuponController extends Controller
{
    public function index(Request $request)
    {
        $cupones = $request->user()->cupones()->with('oferta.empresa')->get();

        return response()->json($cupones);
    }

    public function store(Request $request)
    {
        $request->validate([
            'oferta_id' => 'required|exists:ofertas,id',
            'precio_pagado' => 'required|numeric'
        ]);

        $oferta = Oferta::with('empresa')->findOrFail($request->oferta_id);

        // Generar código único
        $codigo = $oferta->empresa->codigo . strtoupper(Str::random(7));

        $cupon = Cupon::create([
            'codigo' => $codigo,
            'cliente_id' => $request->user()->id,
            'oferta_id' => $request->oferta_id,
            'precio_pagado' => $request->precio_pagado,
            'estado' => 'disponible',
            'fecha_compra' => now(),
        ]);

        return response()->json([
            'message' => 'Cupón comprado exitosamente',
            'cupon' => $cupon->load('oferta.empresa')
        ], 201);
    }
}
