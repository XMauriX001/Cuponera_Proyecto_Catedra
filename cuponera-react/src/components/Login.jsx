export function Login() {
    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-8">¡Bienvenido de vuelta!</h2>
            <div className="space-y-4">
                <input className="w-full border p-3 rounded-lg" type="email" placeholder="Tu correo" />
                <input className="w-full border p-3 rounded-lg" type="password" placeholder="Tu contraseña" />
                <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700">
                    Ingresar
                </button>
            </div>
            <p className="mt-6 text-center text-sm text-gray-500">
                ¿No tienes cuenta? <span className="text-blue-600 font-bold cursor-pointer">Regístrate</span>
            </p>
        </div>
    );
}

export default Login;