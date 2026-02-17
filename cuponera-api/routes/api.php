<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OfertaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CuponController;

// Rutas públicas 
Route::get('/ofertas', [OfertaController::class, 'index']);
Route::get('/ofertas/{id}', [OfertaController::class, 'show']);
Route::post('/register', [ClienteController::class, 'register']);
Route::post('/login', [ClienteController::class, 'login']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/perfil', [ClienteController::class, 'perfil']);
    Route::post('/logout', [ClienteController::class, 'logout']);
    Route::get('/cupones', [CuponController::class, 'index']);
    Route::post('/cupones', [CuponController::class, 'store']);
});
