<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{

    public function sendResetLinkUser(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::broker('users')->sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Enlace de recuperación enviado'])
            : response()->json(['message' => 'No se pudo enviar el enlace'], 400);
    }

    public function resetUser(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

        $status = Password::broker('users')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Contraseña actualizada exitosamente'])
            : response()->json(['message' => 'Token inválido o expirado'], 400);
    }

    public function sendResetLinkCliente(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::broker('clientes')->sendResetLink([
            'correo' => $request->email
        ]);

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Enlace de recuperación enviado'])
            : response()->json(['message' => 'No se pudo enviar el enlace'], 400);
    }

    public function resetCliente(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6|confirmed',
        ]);

       
        $status = Password::broker('clientes')->reset(
            [
                'token' => $request->token,
                'correo' => $request->email,
                'password' => $request->password,
                'password_confirmation' => $request->password_confirmation
            ],
            function ($cliente, $password) {
                $cliente->forceFill([
                    'password' => Hash::make($password)
                ])->save();
            }
        );

        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => 'Contraseña actualizada exitosamente'])
            : response()->json(['message' => 'Token inválido o expirado'], 400);
    }
}
