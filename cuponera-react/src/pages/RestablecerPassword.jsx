import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { Notification } from '../components/Notification';

export default function RestablecerPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [formData, setFormData] = useState({ 
        token: '', 
        email: '', 
        password: '', 
        password_confirmation: '' 
    });
    const [userType, setUserType] = useState('cliente'); // 'cliente' | 'user'
    
    const [loading, setLoading] = useState(false);
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });

    const [verClave1, setVerClave1] = useState(false);
    const [verClave2, setVerClave2] = useState(false);

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const email = params.get('email');
        const type  = params.get('type'); // 'user' o 'cliente'
        
        if (token && email) {
            setFormData(prev => ({ 
                ...prev, 
                token: token, 
                email: decodeURIComponent(email) 
            }));
        }
        if (type) {
            setUserType(type); // guarda el tipo para saber qué endpoint usar
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password.length < 6) {
            return lanzarNotificacion('error', 'la clave debe tener al menos 6 caracteres.');
        }

        if (formData.password !== formData.password_confirmation) {
            return lanzarNotificacion('error', 'las contraseñas no coinciden.');
        }
        
        setLoading(true);

        // dependiendo si es cliente o empresa, le pegamos a la ruta que toca
        const endpoint = userType === 'user'
            ? '/password/reset-user'
            : '/password/reset-cliente';

        try {
            await api.post(endpoint, formData);
            lanzarNotificacion('success', 'contraseña actualizada correctamente.');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            const msg = err.response?.data?.message || 'enlace inválido o expirado.';
            lanzarNotificacion('error', msg);
        } finally {
            setLoading(false);
        }
    };

    const IconoOjo = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const IconoOjoCerrado = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
    );

    return (
        <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl mt-16 border border-gray-50">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">NUEVA CLAVE</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">crea tu nueva contraseña de acceso.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Contraseña Nueva</label>
                    <div className="relative">
                        <input
                            required
                            className="w-full bg-gray-50 border-none p-4 pr-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            type={verClave1 ? "text" : "password"}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button type="button" onClick={() => setVerClave1(!verClave1)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                            {verClave1 ? <IconoOjoCerrado /> : <IconoOjo />}
                        </button>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
                    <div className="relative">
                        <input
                            required
                            className="w-full bg-gray-50 border-none p-4 pr-12 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            type={verClave2 ? "text" : "password"}
                            onChange={e => setFormData({ ...formData, password_confirmation: e.target.value })}
                        />
                        <button type="button" onClick={() => setVerClave2(!verClave2)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors">
                            {verClave2 ? <IconoOjoCerrado /> : <IconoOjo />}
                        </button>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg uppercase text-xs tracking-[0.2em] mt-4">
                    {loading ? 'Procesando...' : 'Actualizar Contraseña'}
                </button>
            </form>
            
            <p className="mt-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">
                <Link to="/login" className="text-blue-600 hover:text-black transition-colors underline underline-offset-4 decoration-2">Volver al Login</Link>
            </p>

            {notificacion.mostrar && (
                <Notification type={notificacion.tipo} message={notificacion.mensaje} onClose={() => setNotificacion({mostrar:false})} />
            )}
        </div>
    );
}