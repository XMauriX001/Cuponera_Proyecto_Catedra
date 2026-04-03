<?php

namespace App\Http\Controllers\adminEmpresa;

use App\Http\Controllers\Controller;
use App\Models\Empresa as EmpresaModel;
use App\Models\Oferta;
use App\Models\Cupon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    private function getEmpresaId(Request $request)
    {
        // Verificar autenticación primero
        $user = $request->user();

        if (!$user) {
            abort(401, 'No autenticado');
        }

        if (!$user->empresa_id) {
            abort(403, 'Usuario no vinculado a ninguna empresa');
        }

        return $user->empresa_id;
    }
    public function index(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);

        $empresa = EmpresaModel::findOrFail($empresaId);

        $totalOfertas = Oferta::where('empresa_id', $empresa->id)->count();

        $totalOfertas = Oferta::where('empresa_id', $empresa->id)->count();
        $ofertasActivas = Oferta::where('empresa_id', $empresa->id)
            ->where('estado', 'aprobada')
            ->where('fecha_inicio', '<=', now())
            ->where('fecha_fin', '>=', now())
            ->count();

        $cuponesVendidos = Cupon::whereHas('oferta', function ($q) use ($empresa) {
            $q->where('empresa_id', $empresa->id);
        })->count();

        $ingresosTotales = Cupon::whereHas('oferta', function ($q) use ($empresa) {
            $q->where('empresa_id', $empresa->id);
        })->sum('precio_pagado');

        $comision = $ingresosTotales * ($empresa->porcentaje_comision / 100);

        return response()->json([
            'empresa' => $empresa,
            'estadisticas' => [
                'total_ofertas' => $totalOfertas,
                'ofertas_activas' => $ofertasActivas,
                'cupones_vendidos' => $cuponesVendidos,
                'ingresos_totales' => $ingresosTotales,
                'comision_a_pagar' => $comision,
                'ganancias_netas' => $ingresosTotales - $comision,
            ]
        ]);
    }
}
