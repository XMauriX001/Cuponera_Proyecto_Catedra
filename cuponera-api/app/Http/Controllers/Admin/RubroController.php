<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rubro;
use Illuminate\Http\Request;

class RubroController extends Controller
{
    public function index()
    {
        $rubros = Rubro::withCount('ofertas')->get();
        return response()->json($rubros);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255|unique:rubros,nombre',
            'descripcion' => 'nullable|string',
        ]);

        $rubro = Rubro::create($request->all());

        return response()->json([
            'message' => 'Rubro creado exitosamente',
            'rubro' => $rubro
        ], 201);
    }

    public function show($id)
    {
        $rubro = Rubro::with('ofertas')->findOrFail($id);
        return response()->json($rubro);
    }

    public function update(Request $request, $id)
    {
        $rubro = Rubro::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|string|max:255|unique:rubros,nombre,' . $id,
            'descripcion' => 'nullable|string',
        ]);

        $rubro->update($request->all());

        return response()->json([
            'message' => 'Rubro actualizado exitosamente',
            'rubro' => $rubro
        ]);
    }

    public function destroy($id)
    {
        $rubro = Rubro::findOrFail($id);
        
        if ($rubro->empresas()->count() > 0 || $rubro->ofertas()->count() > 0) {
            return response()->json([
                'message' => 'No se puede eliminar el rubro porque tiene empresas u ofertas asociadas'
            ], 400);
        }

        $rubro->delete();

        return response()->json([
            'message' => 'Rubro eliminado exitosamente'
        ]);
    }
}