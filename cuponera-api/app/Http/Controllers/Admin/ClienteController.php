<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::withCount('cupones')->get();
        return response()->json($clientes);
    }

    public function show($id)
    {
        $cliente = Cliente::with(['cupones.oferta.empresa'])->findOrFail($id);

        return response()->json($cliente);
    }
}
