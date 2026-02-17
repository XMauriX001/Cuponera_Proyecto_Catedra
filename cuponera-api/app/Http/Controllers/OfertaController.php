<?php

namespace App\Http\Controllers;

use App\Models\Oferta;
use App\Models\Rubro;
use Illuminate\Http\Request;
use Carbon\Carbon;

class OfertaController extends Controller
{
    /**
     * Muestra las ofertas aprobadas y vigentes, clasificadas por rubro.
     */
    public function index()
    {
        $hoy = now()->toDateString();

        // Cargamos los rubros y sus ofertas vigentes usando la relación hasManyThrough
        $rubros = Rubro::with(['ofertas' => function ($query) use ($hoy) {
            $query->where('estado', 'aprobada')
                ->where('fecha_inicio', '<=', $hoy)
                ->where('fecha_fin', '>=', $hoy)
                ->where(function ($q) {
                    $q->whereNull('cantidad_limite')
                        ->orWhereRaw('cantidad_limite > (select count(*) from cupones where cupones.oferta_id = ofertas.id)');
                });
        }])->get();

        // Filtramos para no enviar rubros vacíos a React
        $rubrosConOfertas = $rubros->filter(function ($rubro) {
            return $rubro->ofertas->isNotEmpty();
        });

        return response()->json($rubrosConOfertas->values());
    }
    /**
     * Muestra el detalle de una oferta específica
     */
    public function show($id)
    {
        $oferta = Oferta::with('empresa')->find($id);

        if (!$oferta) {
            return response()->json(['message' => 'Oferta no encontrada'], 404);
        }

        return response()->json($oferta);
    }
}
