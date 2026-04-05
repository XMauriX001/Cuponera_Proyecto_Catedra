import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Notification } from '../components/Notification';

export function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ correo: '', password: '' });
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });
    const [loading, setLoading] = useState(false);

    //Conexión con el backend y api
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const reponse = await api.post('/login', formData);
        const user = reponse.data.user; // El usuario que manda tu amigo con Spatie
        const token = reponse.data.token;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        lanzarNotificacion('success', '¡Bienvenido de nuevo!');

        // Lo direcciona en base a su rol
        const role = user.roles[0].name;

        setTimeout(() => {
            if (role === 'admin') navigate('/admin');
            else if (role === 'empresa') navigate('/empresa');
            else if (role === 'empleado') navigate('/empleado');
            else navigate('/'); // Por defecto al home de cliente
        }, 1500);

    } catch (error) {
        lanzarNotificacion('error', 'Correo o contraseña incorrectos');
    } finally {
        setLoading(false);
    }
};

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    const cerrarNotificacion = () => {
        setNotificacion({ mostrar: false, tipo: '', mensaje: '' });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg mt-10">
            <h2 className="text-2xl font-bold text-center mb-8">¡Bienvenido de vuelta!</h2>

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

            {notificacion.mostrar && (
                <Notification 
                    type={notificacion.tipo} 
                    message={notificacion.mensaje} 
                    onClose={cerrarNotificacion} 
                />
            )}
        </div>
    );
}

export default Login;