import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { Notification } from '../../components/Notification';

export default function MiPerfil() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    const [loading, setLoading] = useState(false);
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: '', mensaje: '' });
    
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        telefono: '',
        direccion: '',
        password: '',
        password_confirmation: ''
    });

    // revisamos que este logueado apenas entre a su perfil
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (userString) {
            const user = JSON.parse(userString);
            setFormData({
                nombres: user.nombres || '',
                apellidos: user.apellidos || '',
                telefono: user.telefono || '',
                direccion: user.direccion || '',
                password: '',
                password_confirmation: ''
            });
        }
    }, [token, navigate, userString]);

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // mandamos los datos nuevos al back cuando le da guardar
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (formData.password && formData.password !== formData.password_confirmation) {
            lanzarNotificacion('error', 'Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        try {
            const dataToSubmit = { ...formData };
            if (!dataToSubmit.password) {
                delete dataToSubmit.password;
                delete dataToSubmit.password_confirmation;
            }

            const response = await api.put('/perfil', dataToSubmit);
            
            // guardamos la nueva info aca tambien para que siga actualizada en toda la pagina
            localStorage.setItem('user', JSON.stringify(response.data.cliente));
            
            lanzarNotificacion('success', 'Perfil actualizado exitosamente');
            setFormData({ ...formData, password: '', password_confirmation: '' });
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Error al actualizar el perfil';
            lanzarNotificacion('error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter">Mi Perfil</h1>
                    <p className="text-sm text-gray-500 font-medium mt-2">Actualiza tus datos personales y de cuenta.</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombres</label>
                            <input 
                                type="text"
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Apellidos</label>
                            <input 
                                type="text"
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Teléfono</label>
                        <input 
                            type="text"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Dirección</label>
                        <textarea 
                            name="direccion"
                            value={formData.direccion}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none resize-none"
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">Seguridad</p>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nueva Contraseña (Opcional)</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Dejar en blanco para no cambiar"
                                    className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                                />
                            </div>

                            {formData.password && (
                                <div className="space-y-2 animate-fade-in">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Confirmar Nueva Contraseña</label>
                                    <input 
                                        type="password"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required={!!formData.password}
                                        placeholder="Repite la nueva contraseña"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>

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
