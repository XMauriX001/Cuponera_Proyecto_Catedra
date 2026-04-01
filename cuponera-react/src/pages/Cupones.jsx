import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Notification } from '../components/Notification';

const Cupones = () => {
    const navigate = useNavigate();
    const [cupones, setCupones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        api.get('/cupones')
            .then(response => {
                setCupones(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, [navigate]);

    const categorias = [
        { valor: 'disponible', titulo: 'Disponibles', color: 'text-green-600', bg: 'bg-green-600' },
        { valor: 'canjeado', titulo: 'Canjeados', color: 'text-gray-400', bg: 'bg-gray-400' },
        { valor: 'vencido', titulo: 'Vencidos', color: 'text-red-400', bg: 'bg-red-400' }
    ];

    if (loading) return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
            <header className="space-y-2">
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Mis Cupones</h1>
                <p className="text-gray-400 font-medium">Gestiona tus beneficios y códigos de canje.</p>
            </header>

            {categorias.map((cat) => {
                const cuponesCategoria = cupones.filter(c => c.estado === cat.valor);

                return (
                    <section key={cat.valor} className="space-y-6">
                        <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-3 ${cat.bg}`}></span>
                            <h2 className={`text-lg font-black uppercase tracking-widest ${cat.color}`}>
                                {cat.titulo}
                            </h2>
                            <div className="flex-1 h-px bg-gray-100 ml-4"></div>
                        </div>

                        {cuponesCategoria.length === 0 ? (
                            <div className="bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-3xl py-10 text-center">
                                <p className="text-gray-400 text-sm italic">No hay registros en esta categoría</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {cuponesCategoria.map(cupon => (
                                    <div key={cupon.id} className={`relative bg-white border-2 border-gray-50 rounded-3xl p-6 shadow-sm overflow-hidden group transition-all ${cat.valor !== 'disponible' ? 'opacity-60 grayscale' : 'hover:shadow-xl hover:-translate-y-1'}`}>
                                        
                                        {/* Decoración de Ticket (Círculos laterales) */}
                                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full border-2 border-gray-50"></div>
                                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full border-2 border-gray-50"></div>

                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                                    {cupon.oferta?.empresa?.nombre || 'PROMO'}
                                                </p>
                                                <h3 className="text-xl font-bold text-gray-800 leading-tight">
                                                    {cupon.oferta?.titulo}
                                                </h3>
                                            </div>

                                            {cat.valor === 'disponible' && (
                                                <button className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter hover:bg-blue-600 transition-colors">
                                                    PDF
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-6 flex flex-col items-center bg-gray-50 rounded-2xl py-4 border-2 border-dashed border-gray-200">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Código de Canje</p>
                                            <p className="text-2xl font-black text-gray-900 tracking-[0.2em] font-mono">
                                                {cupon.codigo}
                                            </p>
                                        </div>

                                        <div className="mt-4 flex justify-between items-center text-[9px] font-black text-gray-300 uppercase tracking-widest">
                                            <span>
                                                {cat.valor === 'vencido' ? 'Venció' : 'Comprado'}: {new Date(cupon.fecha_compra).toLocaleDateString()}
                                            </span>
                                            <span className={cat.color}>
                                                Estado: {cat.titulo}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}

            {notificacion.mostrar && (
                <Notification 
                    type={notificacion.tipo} 
                    message={notificacion.mensaje} 
                    onClose={() => setNotificacion({ ...notificacion, mostrar: false })} 
                />
            )}
        </div>
    );
};

export default Cupones;