<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmpresaController extends Controller
{
    public function index()
    {
        $empresas = Empresa::with('rubro')->get();
        return response()->json($empresas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'codigo' => 'required|string|unique:empresas,codigo|regex:/^[A-Z]{3}\d{3}$/',
            'direccion' => 'required|string',
            'nombre_contacto' => 'required|string',
            'telefono' => 'required|string',
            'correo' => 'required|email|unique:empresas,correo',
            'password' => 'required|string|min:6',
            'rubro_id' => 'required|exists:rubros,id',
            'porcentaje_comision' => 'required|numeric|min:0|max:100',
        ]);

        $empresa = Empresa::create([
            'nombre' => $request->nombre,
            'codigo' => $request->codigo,
            'direccion' => $request->direccion,
            'nombre_contacto' => $request->nombre_contacto,
            'telefono' => $request->telefono,
            'correo' => $request->correo,
            'password' => Hash::make($request->password),
            'rubro_id' => $request->rubro_id,
            'porcentaje_comision' => $request->porcentaje_comision,
        ]);

        return response()->json([
            'message' => 'Empresa creada exitosamente',
            'empresa' => $empresa->load('rubro'),

        ], 201);
    }

    public function show($id)
    {
        $empresa = Empresa::with(['rubro', 'ofertas'])->findOrFail($id);
        return response()->json($empresa);
    }

    public function update(Request $request, $id)
    {
        $empresa = Empresa::findOrFail($id);

        $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'codigo' => 'sometimes|string|unique:empresas,codigo,' . $id . '|regex:/^[A-Z]{3}\d{3}$/',
            'direccion' => 'sometimes|string',
            'nombre_contacto' => 'sometimes|string',
            'telefono' => 'sometimes|string',
            'correo' => 'sometimes|email|unique:empresas,correo,' . $id,
            'password' => 'sometimes|string|min:6',
            'rubro_id' => 'sometimes|exists:rubros,id',
            'porcentaje_comision' => 'sometimes|numeric|min:0|max:100',
        ]);

        $data = $request->except('password');
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $empresa->update($data);

        return response()->json([
            'message' => 'Empresa actualizada exitosamente',
            'empresa' => $empresa->load('rubro')
        ]);
    }

    public function destroy($id)
    {
        $empresa = Empresa::findOrFail($id);
        $empresa->delete();

        return response()->json([
            'message' => 'Empresa eliminada exitosamente'
        ]);
    }
}
