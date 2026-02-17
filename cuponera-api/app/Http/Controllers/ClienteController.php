<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClienteController extends Controller
{
    // Registro de cliente
    public function register(Request $request)
    {
        $request->validate([
            'nombres'    => 'required|string|max:255',
            'apellidos'  => 'required|string|max:255',
            'telefono'   => 'required|string|max:20',
            'correo'     => 'required|email|unique:clientes,correo',
            'password'   => 'required|string|min:6',
            'direccion'  => 'required|string',
            'dui'        => 'required|string|unique:clientes,dui',
        ]);

        $cliente = Cliente::create([
            'nombres'           => $request->nombres,
            'apellidos'         => $request->apellidos,
            'telefono'          => $request->telefono,
            'correo'            => $request->correo,
            'password'          => Hash::make($request->password),
            'direccion'         => $request->direccion,
            'dui'               => $request->dui,
            'cuenta_verificada' => true,
        ]);

        $token = $cliente->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Cliente registrado exitosamente',
            'cliente' => $cliente,
            'token'   => $token,
        ], 201);
    }

    // Login de cliente
    public function login(Request $request)
    {
        $request->validate([
            'correo'   => 'required|email',
            'password' => 'required|string',
        ]);

        $cliente = Cliente::where('correo', $request->correo)->first();

        if (!$cliente || !Hash::check($request->password, $cliente->password)) {
            return response()->json([
                'message' => 'Correo o contraseña incorrectos'
            ], 401);
        }

        $token = $cliente->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'cliente' => $cliente,
            'token'   => $token,
        ]);
    }

    // Logout de cliente
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente'
        ]);
    }

    // Ver perfil del cliente autenticado
    public function perfil(Request $request)
    {
        return response()->json($request->user());
    }
}
