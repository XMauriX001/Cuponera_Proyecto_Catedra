<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Oferta;
use Illuminate\Http\Request;

class OfertaController extends Controller
{
    public function index(Request $request)
    {
        $query = Oferta::with(['empresa', 'rubro']);

        // Filtrar por estado si se proporciona
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        $ofertas = $query->get();
        return response()->json($ofertas);
    }

    public function aprobar($id)
    {
        $oferta = Oferta::findOrFail($id);

        if ($oferta->estado !== 'en_espera') {
            return response()->json([
                'message' => 'Solo se pueden aprobar ofertas en espera'
            ], 400);
        }

        $oferta->update([
            'estado' => 'aprobada',
            'justificacion_rechazo' => null
        ]);

        return response()->json([
            'message' => 'Oferta aprobada exitosamente',
            'oferta' => $oferta->load(['empresa', 'rubro'])
        ]);
    }

    public function rechazar(Request $request, $id)
    {
        $request->validate([
            'justificacion_rechazo' => 'required|string|min:10'
        ]);

        $oferta = Oferta::findOrFail($id);

        if ($oferta->estado !== 'en_espera') {
            return response()->json([
                'message' => 'Solo se pueden rechazar ofertas en espera'
            ], 400);
        }

        $oferta->update([
            'estado' => 'rechazada',
            'justificacion_rechazo' => $request->justificacion_rechazo
        ]);

        return response()->json([
            'message' => 'Oferta rechazada',
            'oferta' => $oferta->load(['empresa', 'rubro'])
        ]);
    }

    public function show($id)
    {
        $oferta = Oferta::with(['empresa', 'rubro', 'cupones'])->findOrFail($id);

        // Calcular estadísticas
        $cuponesVendidos = $oferta->cupones->count();
        $ingresosTotales = $cuponesVendidos * $oferta->precio_oferta;
        $cargoPorServicio = $ingresosTotales * ($oferta->empresa->porcentaje_comision / 100);

        return response()->json([
            'oferta' => $oferta,
            'estadisticas' => [
                'cupones_vendidos' => $cuponesVendidos,
                'cupones_disponibles' => $oferta->cantidad_limite ? $oferta->cantidad_limite - $cuponesVendidos : 'Ilimitado',
                'ingresos_totales' => $ingresosTotales,
                'cargo_por_servicio' => $cargoPorServicio,
            ]
        ]);
    }
}
