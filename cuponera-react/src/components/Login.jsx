import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    //Conexión con el backend y api
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const reponse = await api.post('/login', formData);
            localStorage.setItem('token', reponse.data.token);
            localStorage.setItem('user', JSON.stringify(reponse.data.cliente));
            navigate('/mis-cupones');
        }
        catch (error) {
            setError('Correo o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-8">¡Bienvenido de vuelta!</h2>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="w-full border p-3 rounded-lg"
                    type="email"
                    placeholder="Tu correo"
                    required
                    onChange={e => setFormData({ ...formData, correo: e.target.value })}
                />
                <input
                    className="w-full border p-3 rounded-lg"
                    type="password"
                    placeholder="Tu contraseña"
                    required
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-50">
                    {loading ? 'Ingresando...' : 'Ingresar'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">
                ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-bold cursor-pointer">Regístrate</Link>
            </p>
        </div>
    );
}

export default Login;