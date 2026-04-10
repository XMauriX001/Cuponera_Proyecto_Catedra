import { useState } from 'react';
import api from '../api/axios';
import { Notification } from '../components/Notification';
import { Link } from 'react-router-dom';

export default function SolicitarRecuperacion() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    // estado de la alerta
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });

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
            // probamos primero a ver si es un cliente normal buscando ayuda
            await api.post('/password/forgot-cliente', { email });
            lanzarNotificacion('success', '¡Enlace enviado! revisa tu correo de cliente.');
            setEmail('');
        } catch (error) {
            // si no sirvio, quizas es administrador, revisamos en la otra tabla
            try {
                await api.post('/password/forgot-user', { email });
                lanzarNotificacion('success', '¡Enlace enviado! revisa tu correo administrativo.');
                setEmail('');
            } catch (err) {
                // si no aparece en ninguno de los dos, lanzamos el error
                lanzarNotificacion('error', 'El correo no coincide con ningun registro activo.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-12 rounded-[2.5rem] shadow-2xl mt-20 border border-gray-50 animate-fade-in">
            {/* encabezado */}
            <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">RECUPERAR ACCESO</h2>
                <p className="text-gray-400 text-sm font-medium mt-2">ingresa tu correo para recibir instrucciones.</p>
            </div>

            {/* formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Tu Correo Registrado</label>
                    <input
                        className="w-full bg-gray-50 border-none p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        type="email" placeholder="ejemplo@correo.com" required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg uppercase text-xs tracking-[0.2em]">
                    {loading ? 'Sincronizando...' : 'Enviar instrucciones'}
                </button>
            </form>

            {/* enlace de regreso */}
            <p className="mt-8 text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                <Link to="/login" className="text-blue-600 hover:text-black transition-colors underline decoration-2 underline-offset-4">Regresar al Login</Link>
            </p>

            {/* notificacion personalizada */}
            {notificacion.mostrar && (
                <Notification type={notificacion.tipo} message={notificacion.mensaje} onClose={cerrarNotificacion} />
            )}
        </div>
    );
}