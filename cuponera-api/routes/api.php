<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CuponController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\EmpresaController as AdminEmpresaController;
use App\Http\Controllers\Admin\RubroController as AdminRubroController;
use App\Http\Controllers\Admin\OfertaController as AdminOfertaController;
use App\Http\Controllers\Admin\ClienteController as AdminClienteController;
use App\Http\Controllers\adminEmpresa\OfertaController as EmpresaOfertaController;
use App\Http\Controllers\adminEmpresa\EmpleadoController;
use App\Http\Controllers\adminEmpresa\DashboardController;
use App\Http\Controllers\Empleado\CanjeController;
use App\Http\Controllers\PasswordResetController;

// Rutas públicas 
Route::get('/ofertas', [OfertaController::class, 'index']);
Route::get('/ofertas/{id}', [OfertaController::class, 'show']);
Route::get('/rubros', [AdminRubroController::class, 'index']);
Route::post('/register', [ClienteController::class, 'register']);
Route::post('/login', [ClienteController::class, 'login']);
Route::post('/password/forgot-user', [PasswordResetController::class, 'sendResetLinkUser']);
Route::post('/password/reset-user', [PasswordResetController::class, 'resetUser']);
Route::post('/password/forgot-cliente', [PasswordResetController::class, 'sendResetLinkCliente']);
Route::post('/password/reset-cliente', [PasswordResetController::class, 'resetCliente']);

// Rutas protegidas para clientes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [ClienteController::class, 'perfil']);
    Route::post('/logout', [ClienteController::class, 'logout']);
    Route::get('/cupones', [CuponController::class, 'index']);
    Route::post('/cupones', [CuponController::class, 'store']);
});

// Rutas de autenticación para usuarios (administrador, administrador de empresa, empleado)
Route::prefix('users')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

// Rutas de administración
Route::middleware(['auth:sanctum', 'role:administrador'])->prefix('admin')->group( function () {
    // Empresas
    Route::apiResource('empresas', AdminEmpresaController::class);
    
    // Rubros
    Route::apiResource('rubros', AdminRubroController::class);
    
    // Ofertas
    Route::get('ofertas', [AdminOfertaController::class, 'index']);
    Route::get('ofertas/{id}', [AdminOfertaController::class, 'show']);
    Route::post('ofertas/{id}/aprobar', [AdminOfertaController::class, 'aprobar']);
    Route::post('ofertas/{id}/rechazar', [AdminOfertaController::class, 'rechazar']);
    
    // Clientes
    Route::get('clientes', [AdminClienteController::class, 'index']);
    Route::get('clientes/{id}', [AdminClienteController::class, 'show']);
});

// Rutas para administradores de empresa
Route::middleware(['auth:sanctum', 'role:admin_empresa'])->prefix('empresa')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    
    // Ofertas
    Route::get('ofertas', [EmpresaOfertaController::class, 'index']);
    Route::post('ofertas', [EmpresaOfertaController::class, 'store']);
    Route::get('ofertas/{id}', [EmpresaOfertaController::class, 'show']);
    Route::put('ofertas/{id}', [EmpresaOfertaController::class, 'update']);
    Route::post('ofertas/{id}/descartar', [EmpresaOfertaController::class, 'descartar']);
    
    // Empleados
    Route::apiResource('empleados', EmpleadoController::class);
});

// Rutas para empleados
Route::middleware(['auth:sanctum', 'role:empleado'])->prefix('empleado')->group(function () {
    Route::post('canje/verificar', [CanjeController::class, 'verificar']);
    Route::post('canje/canjear', [CanjeController::class, 'canjear']);
});

Route::get('/reset-password/{token}', function ($token) {
    return redirect("http://localhost:5173/reset-password?token=$token");
})->name('password.reset');