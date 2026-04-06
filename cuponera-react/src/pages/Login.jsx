import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Notification } from '../components/Notification';

export function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });
    const [loading, setLoading] = useState(false);

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    const cerrarNotificacion = () => {
        setNotificacion({ mostrar: false, tipo: '', mensaje: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/users/login', formData);
            const user = response.data.user; 
            const token = response.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            lanzarNotificacion('success', '¡Acceso concedido! Preparando tu panel...');

            const role = user.roles?.[0]?.name;

            setTimeout(() => {
                if (role === 'administrador') navigate('/admin');
                else if (role === 'admin_empresa') navigate('/empresa');
                else if (role === 'empleado') navigate('/empleado');
                else navigate('/');
            }, 1000);

        } catch (error) {
            lanzarNotificacion('error', 'Vaya, parece que los datos no coinciden. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl shadow-blue-50 mt-20 border border-gray-50">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">¡HOLA DE NUEVO!</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">Ingresa tus credenciales para acceder.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tu Correo</label>
                    <input
                        className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        type="email" placeholder="admin@pizzahut.sv" required
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tu Contraseña</label>
                    <input
                        className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                        type="password" placeholder="••••••••" required
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:opacity-50 uppercase text-xs tracking-[0.2em] mt-4">
                    {loading ? 'Verificando...' : 'Ingresar al Sistema'}
                </button>
            </form>

            <p className="mt-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                ¿Eres un cliente? <Link to="/" className="text-blue-600 hover:text-black transition-colors ml-1 underline decoration-2 underline-offset-4">Regresar al Inicio</Link>
            </p>

            {notificacion.mostrar && (
                <Notification type={notificacion.tipo} message={notificacion.mensaje} onClose={cerrarNotificacion} />
            )}
        </div>
    );
}
export default Login;