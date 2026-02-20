import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Cupones = () => {
    const navigate = useNavigate();
    const [cupones, setCupones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        api.get('/cupones')
            .then(response => {
                console.log('Cupones recibidos:', response.data); // Para debug
                setCupones(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar cupones:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                setLoading(false);
            });
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    const categorias = [
        { valor: 'disponible', titulo: 'Disponibles' },
        { valor: 'canjeado', titulo: 'Canjeados' },
        { valor: 'vencido', titulo: 'Vencidos' }
    ];

    return (
        <div className="space-y-10">
            <header className="border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Mis Cupones</h1>
                <p className="text-gray-500 mt-1">Administra y revisa el estado de tus compras.</p>
            </header>

            {categorias.map((cat) => {
                const cuponesCategoria = cupones.filter(c => c.estado === cat.valor);

                return (
                    <section key={cat.valor}>
                        <h2 className={`text-xl font-bold mb-4 flex items-center ${cat.valor === 'disponible' ? 'text-green-600' : 'text-gray-500'
                            }`}>
                            <span className={`w-3 h-3 rounded-full mr-2 ${cat.valor === 'disponible' ? 'bg-green-600' : 'bg-gray-400'
                                }`}></span>
                            Cupones {cat.titulo}
                        </h2>

                        {cuponesCategoria.length === 0 ? (
                            <p className="text-gray-400 text-sm italic">No tienes cupones {cat.titulo.toLowerCase()}</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {cuponesCategoria.map(cupon => (
                                    <div key={cupon.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-1">
                                                    {cupon.oferta?.empresa?.nombre || 'Empresa'}
                                                </p>
                                                <h3 className="text-lg font-bold text-gray-800">{cupon.oferta?.titulo}</h3>
                                                <p className="text-sm font-mono text-gray-500 mt-2 bg-gray-50 p-1 rounded inline-block">
                                                    Código: {cupon.codigo}
                                                </p>
                                            </div>

                                            {cat.valor === 'disponible' && (
                                                <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-blue-100">
                                                    Descargar PDF
                                                </button>
                                            )}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase">
                                            {cat.valor === 'vencido' ? 'Expiró el' : 'Comprado el'}: {new Date(cupon.fecha_compra).toLocaleDateString('es-SV')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
};

export default Cupones;