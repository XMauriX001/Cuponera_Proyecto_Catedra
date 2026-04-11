<?php

namespace App\Http\Controllers\adminEmpresa;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Empresa as EmpresaModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class EmpleadoController extends Controller
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

        $empleados = User::role('empleado')
            ->where('empresa_id', $empresaId)
            ->get();

        return response()->json($empleados);
    }

    public function store(Request $request)
    {
        $empresaId = $this->getEmpresaId($request);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        $empleado = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'empresa_id' => $empresaId,
            'email_verified_at' => now(),
        ]);

        $empleado->assignRole('empleado');

        return response()->json([
            'message' => 'Empleado creado exitosamente',
            'empleado' => $empleado
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $empleado = User::role('empleado')
            ->where('empresa_id', $empresaId)
            ->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:6',
        ]);

        $data = $request->except('password');
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $empleado->update($data);

        return response()->json([
            'message' => 'Empleado actualizado exitosamente',
            'empleado' => $empleado
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $empresaId = $this->getEmpresaId($request);

        $empleado = User::role('empleado')
            ->where('empresa_id', $empresaId)
            ->findOrFail($id);

        $empleado->delete();

        return response()->json([
            'message' => 'Empleado eliminado exitosamente'
        ]);
    }
}
