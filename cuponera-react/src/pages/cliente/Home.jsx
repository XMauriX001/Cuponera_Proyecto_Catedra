import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import ModoPago from "../ModoPago";
import { Notification } from '../../components/Notification';

export function Home() {
    const navigate = useNavigate();

    // Aquí recibimos lo que el usuario escribe en el Navbar
    const { busqueda } = useOutletContext();

    const [rubros, setRubros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [ofertaSeleccionada, setOfertaSeleccionada] = useState(null);
    const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });

    const imagenesRubros = {
        'Restaurantes': '/images/respaldo-restaurant.jpeg',
        'Talleres': '/images/respaldo-talleres.jpeg',
        'Salones de Belleza': '/images/respaldo-belleza.jpeg',
        'Entretenimiento': '/images/respaldo-entretenimiento.jpeg',
        'Default': '/images/default-oferta.jpg'
    };

    const imagenesPorOferta = {
        '2x1 en Pizzas Medianas': '/images/pizza-2x1.png',
        'Combo Familiar Gigante': '/images/pizza-familiar.jpeg',
        // 'Almuerzo Ejecutivo': '/images/pizza-personal.jpeg', // Comentado intencionalmente para que aparezca "Pronto"

        'Corte + Tinte Global': '/images/corte-tinte.png',
        'Manicure y Pedicure Spa': '/images/manicure-pedicuree.jpeg',
        // 'Alisado de Keratina': '/images/alisado-corte.jpeg', // Comentado intencionalmente para que aparezca "Pronto"

        'Pack 2 Entradas + Combo': '/images/boletos-palomitas.jpeg',
        'Cumpleaños en el Cine': '/images/boletos-familiar.jpeg',
        'Pase Anual VIP': '/images/vip-pass.jpeg'
    };

    useEffect(() => {
        api.get('/ofertas')
            .then(response => {
                setRubros(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar ofertas:', error);
                setLoading(false);
            });
    }, []);

    const lanzarNotificacion = (tipo, mensaje) => {
        setNotificacion({ mostrar: true, tipo, mensaje });
    };

    // filtramos la lista en vivo dependiendo de lo que pongan en la barra
    const rubrosFiltrados = rubros.map(rubro => {
        return {
            ...rubro,
            ofertas: rubro.ofertas.filter(oferta =>
                oferta.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                oferta.descripcion.toLowerCase().includes(busqueda.toLowerCase())
            )
        };
    }).filter(rubro => rubro.ofertas.length > 0);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    // proceso de compra normal, avisa que se ocupe login si no hay token
    const comprarCupon = async (ofertaId, precioOferta) => {
        const token = localStorage.getItem('token');
        if (!token) {
            lanzarNotificacion('info', 'Debes iniciar sesión para comprar');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }
        try {
            await api.post('/cupones', {
                oferta_id: ofertaId,
                precio_pagado: precioOferta
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            lanzarNotificacion('success', '¡Cupón comprado con éxito!');
            setTimeout(() => navigate('/mis-cupones'), 2000);
        } catch (error) {
            lanzarNotificacion('error', error.response?.data?.message || 'Error al comprar cupón');
        }
    };

    // si le da ok al modal de pago, procedemos a hacer el cobro
    const confirmarPagoYComprar = () => {
        if (!ofertaSeleccionada) return;
        comprarCupon(ofertaSeleccionada.id, ofertaSeleccionada.precio_oferta);
        setMostrarPago(false);
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="bg-blue-600 py-16 px-6 text-center mb-12">
                <div className="max-w-3xl mx-auto space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Ahorra en grande <br /> <span className="text-blue-200">vive mejor</span>
                    </h1>
                    <p className="text-blue-100 text-lg font-medium">
                        Encuentra las mejores experiencias en El Salvador con descuentos exclusivos.
                    </p>
                </div>
            </div>

            {/* renderizamos las ofertas agrupadas por rubro */}

            <div className="max-w-7xl mx-auto px-4 space-y-16">
                {rubrosFiltrados.length > 0 ? (
                    rubrosFiltrados.map(rubro => (
                        <section key={rubro.id} className="animate-fade-in">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">
                                    {rubro.nombre}
                                </h2>
                                <span className="text-[10px] font-black bg-gray-100 px-3 py-1 rounded-full text-gray-400">
                                    {rubro.ofertas.length} OFERTAS
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rubro.ofertas.map(oferta => {
                                    const esPronto = !imagenesPorOferta[oferta.titulo];
                                    return (
                                        <div key={oferta.id} className={`flex flex-col bg-white rounded-3xl border-2 shadow-sm transition-all duration-300 overflow-hidden ${esPronto ? 'border-dashed border-gray-200 opacity-90' : 'border-gray-50 hover:shadow-xl hover:-translate-y-1'}`}>
                                            <div className="aspect-video relative bg-gray-200">
                                                <img
                                                    src={imagenesPorOferta[oferta.titulo] || imagenesRubros[rubro.nombre] || imagenesRubros['Default']}
                                                    alt={oferta.titulo}
                                                    className={`w-full h-full object-cover ${esPronto ? 'opacity-80' : ''}`}
                                                />
                                            </div>

                                            <div className="p-6 flex flex-col flex-1 space-y-4">
                                                <div className="min-h-[60px]">
                                                    <h3 className={`text-lg font-bold leading-tight ${esPronto ? 'text-gray-400' : 'text-gray-900'}`}>{oferta.titulo}</h3>
                                                    <p className={`text-xs mt-1 italic ${esPronto ? 'text-gray-300' : 'text-gray-400'}`}>{oferta.descripcion}</p>
                                                </div>

                                                <div className="flex items-center justify-between pt-2">
                                                    <div className="flex flex-col">
                                                        <span className={`text-[10px] line-through font-bold uppercase ${esPronto ? 'text-gray-200' : 'text-gray-300'}`}>${oferta.precio_regular}</span>
                                                        <span className={`text-3xl font-black tracking-tighter ${esPronto ? 'text-gray-300' : 'text-green-500'}`}>${oferta.precio_oferta}</span>
                                                    </div>
                                                    <button
                                                        disabled={esPronto}
                                                        onClick={() => {
                                                            setOfertaSeleccionada(oferta);
                                                            setMostrarPago(true);
                                                        }}
                                                        className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                                                            esPronto 
                                                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                                                            : 'bg-blue-600 text-white hover:bg-black shadow-lg shadow-blue-100'
                                                        }`}
                                                    >
                                                        {esPronto ? 'Próximamente' : 'Comprar'}
                                                    </button>
                                                </div>
                                                <div className={`pt-4 border-t flex justify-between text-[9px] font-black uppercase ${esPronto ? 'border-gray-100 text-gray-200' : 'border-gray-50 text-gray-300'}`}>
                                                    <span className="flex items-center">
                                                        Vence: {oferta.fecha_fin}
                                                    </span>
                                                    <span className={esPronto ? 'text-gray-300' : 'text-orange-400'}>
                                                        {esPronto ? 'En Preparación' : 'Disponible'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))
                ) : (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No hay ofertas para esa búsqueda</p>
                    </div>
                )}
            </div>

            {mostrarPago && ofertaSeleccionada && (
                <ModoPago
                    oferta={ofertaSeleccionada}
                    onClose={() => setMostrarPago(false)}
                    onConfirmarPago={confirmarPagoYComprar}
                />
            )}

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

export default Home;