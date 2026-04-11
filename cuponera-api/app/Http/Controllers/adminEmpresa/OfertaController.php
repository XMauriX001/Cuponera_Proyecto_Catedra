<?php

namespace App\Http\Controllers\adminEmpresa;

use App\Http\Controllers\Controller;
use App\Models\Oferta;
use App\Models\Empresa as EmpresaModel;
use Illuminate\Http\Request;

class OfertaController extends Controller
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

        $query = Oferta::where('empresa_id', $empresaId)->with('rubro');

        // Filtrar por estado si se proporciona
        if ($request->has('estado')) {
            $query->where('estado', $request->estado);
        }

        $ofertas = $query->get();

        return response()->json($ofertas);
    }

    public function store(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);

        $request->validate([
            'titulo' => 'required|string|max:255',
            'precio_regular' => 'required|numeric|min:0',
            'precio_oferta' => 'required|numeric|min:0|lt:precio_regular',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after:fecha_inicio',
            'fecha_limite_cupon' => 'required|date|after_or_equal:fecha_fin',
            'cantidad_limite' => 'nullable|integer|min:1',
            'descripcion' => 'required|string',
            'otros_detalles' => 'nullable|string',
            'rubro_id' => 'required|exists:rubros,id',
        ]);

        $oferta = Oferta::create([
            'empresa_id' => $empresaId,
            'rubro_id' => $request->rubro_id,
            'titulo' => $request->titulo,
            'precio_regular' => $request->precio_regular,
            'precio_oferta' => $request->precio_oferta,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_fin' => $request->fecha_fin,
            'fecha_limite_cupon' => $request->fecha_limite_cupon,
            'cantidad_limite' => $request->cantidad_limite,
            'descripcion' => $request->descripcion,
            'otros_detalles' => $request->otros_detalles,
            'estado' => 'en_espera',
        ]);

        return response()->json([
            'message' => 'Oferta creada exitosamente. En espera de aprobación.',
            'oferta' => $oferta->load('rubro')
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $oferta = Oferta::where('empresa_id', $empresaId)
            ->with(['rubro', 'cupones'])
            ->findOrFail($id);

        // Estadísticas
        $cuponesVendidos = $oferta->cupones->count();
        $ingresosTotales = $cuponesVendidos * $oferta->precio_oferta;
        $empresa = EmpresaModel::find($empresaId);
        $cargoPorServicio = $ingresosTotales * ($empresa->porcentaje_comision / 100);

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

    public function update(Request $request, $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $oferta = Oferta::where('empresa_id', $empresaId)->findOrFail($id);

        if (!in_array($oferta->estado, ['rechazada', 'en_espera'])) {
            return response()->json([
                'message' => 'Solo se pueden editar ofertas rechazadas o en espera'
            ], 400);
        }

        $request->validate([
            'titulo' => 'sometimes|string|max:255',
            'precio_regular' => 'sometimes|numeric|min:0',
            'precio_oferta' => 'sometimes|numeric|min:0',
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'sometimes|date',
            'fecha_limite_cupon' => 'sometimes|date',
            'cantidad_limite' => 'nullable|integer|min:1',
            'descripcion' => 'sometimes|string',
            'otros_detalles' => 'nullable|string',
            'rubro_id' => 'sometimes|exists:rubros,id',
        ]);

        $oferta->update(array_merge(
            $request->only([
                'titulo',
                'precio_regular',
                'precio_oferta',
                'fecha_inicio',
                'fecha_fin',
                'fecha_limite_cupon',
                'cantidad_limite',
                'descripcion',
                'otros_detalles',
                'rubro_id'
            ]),
            ['estado' => 'en_espera']
        ));

        return response()->json([
            'message' => 'Oferta actualizada. Enviada nuevamente a aprobación.',
            'oferta' => $oferta->load('rubro')
        ]);
    }

    public function descartar(Request $request, $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $oferta = Oferta::where('empresa_id', $empresaId)->findOrFail($id);

        if ($oferta->estado !== 'rechazada') {
            return response()->json([
                'message' => 'Solo se pueden descartar ofertas rechazadas'
            ], 400);
        }

        $oferta->update(['estado' => 'descartada']);

        return response()->json([
            'message' => 'Oferta descartada exitosamente',
            'oferta' => $oferta
        ]);
    }
}
