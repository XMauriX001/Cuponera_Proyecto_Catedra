import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router';
import { Notification } from '../components/Notification';

export function Register() {
    const [formData, setFormData] = useState({
        nombres: '', apellidos: '', telefono: '',
        correo: '', direccion: '', dui: '', password: ''
    });

    const navigate = useNavigate();
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });
    const [loading, setLoading] = useState(false);

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    // Función para dar formato al Teléfono (0000-0000)
    const handleTelefono = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 8) val = val.slice(0, 8);
        if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4);
        setFormData({ ...formData, telefono: val });
    };

    // Función para dar formato al DUI (00000000-0)
    const handleDUI = (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 9) val = val.slice(0, 9);
        if (val.length > 8) val = val.slice(0, 8) + '-' + val.slice(8);
        setFormData({ ...formData, dui: val });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
       
        if (formData.dui.length !== 10) {
            return lanzarNotificacion('error', 'El DUI debe tener 9 dígitos y un guion');
        }
        if (formData.telefono.length !== 9) {
            return lanzarNotificacion('error', 'El teléfono debe ser de 8 dígitos');
        }
        if (formData.password.length < 8) {
            return lanzarNotificacion('error', 'La seguridad es primero: mínimo 8 caracteres');
        }

        setLoading(true);
        try {
            const reponse = await api.post('/register', formData);
            localStorage.setItem('token', reponse.data.token);
            localStorage.setItem('user', JSON.stringify(reponse.data.cliente));
            
            lanzarNotificacion('success', '¡Bienvenido a bordo! Cuenta creada.');
            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            lanzarNotificacion('error', error.response?.data?.message || 'Error en el registro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-50 mt-10">
            <h2 className="text-3xl font-black text-gray-900 mb-6 text-center tracking-tighter italic uppercase">Crea tu cuenta</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input className="border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Nombres" required value={formData.nombres} onChange={e => setFormData({ ...formData, nombres: e.target.value })} />
                
                <input className="border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Apellidos" required value={formData.apellidos} onChange={e => setFormData({ ...formData, apellidos: e.target.value })} />

                <input className="border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="DUI (00000000-0)" required value={formData.dui} onChange={handleDUI} />
                
                <input className="border-2 border-gray-100 p-4 rounded-2xl focus:border-blue-500 outline-none transition-all"
                    placeholder="Teléfono (7000-0000)" required value={formData.telefono} onChange={handleTelefono} />

                <input className="border-2 border-gray-100 p-4 rounded-2xl md:col-span-2 focus:border-blue-500 outline-none transition-all"
                    type="email" placeholder="Correo Electrónico" required value={formData.correo} onChange={e => setFormData({ ...formData, correo: e.target.value })} />
                
                <textarea className="border-2 border-gray-100 p-4 rounded-2xl md:col-span-2 focus:border-blue-500 outline-none transition-all"
                    placeholder="Dirección Completa" required value={formData.direccion} onChange={e => setFormData({ ...formData, direccion: e.target.value })}></textarea>

                <input className="border-2 border-gray-100 p-4 rounded-2xl md:col-span-2 focus:border-blue-500 outline-none transition-all"
                    type="password" placeholder="Contraseña (mín. 8 caracteres)" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                <button disabled={loading} className="md:col-span-2 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black uppercase tracking-widest transition-all mt-4 disabled:opacity-50 active:scale-95">
                    {loading ? 'Validando...' : 'Registrarme ahora'}
                </button>
            </form>

            {notificacion.mostrar && (
                <Notification 
                    type={notificacion.tipo} 
                    message={notificacion.mensaje} 
                    onClose={() => setNotificacion({ ...notificacion, mostrar: false })} 
                />
            )}
        </div>
    );
}