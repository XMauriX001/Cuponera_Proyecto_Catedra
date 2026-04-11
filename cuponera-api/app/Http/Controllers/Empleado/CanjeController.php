<?php

namespace App\Http\Controllers\Empleado;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Cupon;


class CanjeController extends Controller
{
    public function canjear(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
            'dui' => 'required|string'
        ]);

        $cupon = Cupon::with(['cliente', 'oferta.empresa'])
            ->where('codigo', $request->codigo)
            ->first();


        if (!$cupon) {
            return response()->json([
                'message' => 'No existe el cupón con ese código'
            ], 404);
        }

        $empresaId = $request->user()->empresa_id;

        if ($cupon->oferta->empresa_id !== $empresaId) {
            return response()->json([
                'message' => 'Este cupón no pertenece a tu empresa'
            ], 403);
        }

        if ($cupon->estado === 'canjeado') {
            return response()->json([
                'message' => 'Este cupón ya fue canjeado',
                'fecha_canje' => $cupon->fecha_canje
            ], 400);
        }

        if ($cupon->estado === 'vencido') {
            return response()->json([
                'message' => 'Este cupón está vencido'
            ], 400);
        }

        if ($cupon->cliente->dui !== $request->dui) {
            return response()->json([
                'message' => 'El DUI no coincide con el titular del cupón'
            ], 403);
        }

        if (now()->gt($cupon->oferta->fecha_limite_cupon)) {
            $cupon->update(['estado' => 'vencido']);

            return response()->json([
                'message' => 'El cupón expiró el ' . $cupon->oferta->fecha_limite_cupon
            ], 400);
        }

        $cupon->update([
            'estado' => 'canjeado',
            'fecha_canje' => now()
        ]);

        return response()->json([
            'message' => 'Cupón canjeado exitosamente',
            'cupon' => [
                'codigo' => $cupon->codigo,
                'oferta' => $cupon->oferta->titulo,
                'cliente' => $cupon->cliente->nombres . ' ' . $cupon->cliente->apellidos,
                'precio_pagado' => $cupon->precio_pagado,
                'fecha_canje' => $cupon->fecha_canje,
            ]
        ], 200);
    }

    public function verificar(Request $request)
    {
        $request->validate([
            'codigo' => 'required|string',
        ]);

        $cupon = Cupon::with(['cliente', 'oferta.empresa'])
            ->where('codigo', $request->codigo)
            ->first();

        if (!$cupon) {
            return response()->json([
                'message' => 'Cupón no encontrado'
            ], 404);
        }
        $empresaId = $request->user()->empresa_id;

        if ($cupon->oferta->empresa_id !== $empresaId) {
            return response()->json([
                'message' => 'Este cupón no pertenece a tu empresa'
            ], 403);
        }

        return response()->json([
            'cupon' => [
                'codigo' => $cupon->codigo,
                'estado' => $cupon->estado,
                'oferta' => $cupon->oferta->titulo,
                'cliente' => [
                    'nombres' => $cupon->cliente->nombres,
                    'apellidos' => $cupon->cliente->apellidos,
                    'dui' => $cupon->cliente->dui,
                ],
                'precio_pagado' => $cupon->precio_pagado,
                'fecha_compra' => $cupon->fecha_compra,
                'fecha_canje' => $cupon->fecha_canje,
                'fecha_limite' => $cupon->oferta->fecha_limite_cupon,
            ]
        ]);
    }
}
