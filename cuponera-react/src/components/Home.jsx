import { useState, useEffect } from 'react';
import api from '../api/axios';

export function Home() {
    const [rubros, setRubros] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Respaldo general para ofertas 
    const imagenesRubros = {
        'Restaurantes': '/images/respaldo-restaurant.jpeg', 
        'Talleres': '/images/respaldo-talleres.jpeg',
        'Salones de Belleza': '/images/respaldo-belleza.jpeg',
        'Entretenimiento': '/images/respaldo-entretenimiento.jpeg',
        'Default': '/images/default-oferta.jpg' 
    };

    // 2. Diccionario de fotos de las promociones existentes 
    
    const imagenesPorOferta = {
        '2x1 en Pizzas Medianas': '/images/pizza-2x1.png',
        'Combo Familiar': '/images/pizza-familiar.jpeg',
        'Combo Personal': '/images/pizza-personal.jpeg',
        'Corte + Tinte': '/images/corte-tinte.png',       
        'Manicure + Pedicure': '/images/manicure-pedicuree.jpeg',
        'Alisado Permanente + Corte' : '/images/alisado-corte.jpeg',
        '2 Boletos + Palomitas' : '/images/boletos-palomitas.jpeg',
        '4 Boletos + Combo Familiar' : '/images/boletos-familiar.jpeg',
        'Pase VIP Todo el Día' : '/images/vip-pass.jpeg'
    };

    //Se creó para completar la simetría del diseño
    const ofertasExtra = {
        'Restaurantes': [
            { id: 'temp-1', titulo: 'Combo Personal', descripcion: '1 Pizza personal + bebida + acompañamiento', precio_regular: 10.00, precio_oferta: 4.99, fecha_limite: '2026-03-01' }
        ],
        'Salones de Belleza': [
            { id: 'temp-2', titulo: 'Alisado Permanente + Corte', descripcion: 'Tratamiento completo de hidratación y corte de puntas', precio_regular: 60.00, precio_oferta: 29.99, fecha_limite: '2026-03-05' }
        ],
        'Entretenimiento': [
            { id: 'temp-3', titulo: '4 Boletos + Combo Familiar', descripcion: 'Entradas válidas para cualquier función 2D + combo gigante', precio_regular: 40.00, precio_oferta: 25.00, fecha_limite: '2026-03-10' },
            { id: 'temp-4', titulo: 'Pase VIP Todo el Día', descripcion: 'Acceso ilimitado a juegos mecánicos y área de comida', precio_regular: 30.00, precio_oferta: 15.00, fecha_limite: '2026-03-12' }
        ]
    };

    useEffect(() => {
        api.get('/ofertas')
            .then(response => {
                const datosConRelleno = response.data.map(rubro => ({
                    ...rubro,
                    ofertas: [...rubro.ofertas, ...(ofertasExtra[rubro.nombre] || [])]
                }));
                setRubros(datosConRelleno);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar ofertas:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sección bienvenida */}
            <div className="py-12 px-6 sm:py-20 text-center space-y-4">
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tighter italic uppercase">
                    Explora las Ofertas
                </h1>
                <p className="text-gray-500 text-sm sm:text-lg max-w-xl mx-auto">
                    Ahorra con los mejores cupones en El Salvador. Calidad garantizada en cada compra.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-20 space-y-16">
                {rubros.map(rubro => (
                    <section key={rubro.id} className="animate-fade-in">
                        {/* Los headers que indican el rubro */}
                        <div className="flex items-center mb-8">
                            <h2 className="text-xl sm:text-2xl font-black text-gray-800 uppercase tracking-widest mr-4">
                                {rubro.nombre}
                            </h2>
                            <div className="flex-1 h-0.5 bg-blue-600/10 rounded-full"></div>
                        </div>

                        {/* Diseño de las tarjetas*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
                            {rubro.ofertas.map(oferta => (
                                <div key={oferta.id} className="flex flex-col bg-white rounded-3xl sm:rounded-4xl border-2 border-gray-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                    
                                    
                                    <div className="aspect-16/10 sm:h-56 relative bg-gray-200">
                                        <img 
                                            // Se utiliza en caso que no descubra ninguna imagen y ponga un fondo vacio
                                            src={imagenesPorOferta[oferta.titulo] || imagenesRubros[rubro.nombre] || imagenesRubros['Default']} 
                                            alt={oferta.titulo}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.style.display = 'none'; 
                                                e.target.parentNode.style.backgroundColor = '#e5e7eb';
                                            }}
                                        />
                                        
                                    </div>

                                    {/* Datos de las ofertas */}
                                    <div className="p-5 sm:p-8 flex flex-col flex-1 space-y-4">
                                        <div className="min-h-[70px]">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
                                                {oferta.titulo}
                                            </h3>
                                            <p className="text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2 italic">
                                                {oferta.descripcion}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-gray-300 line-through font-bold">ANTES ${oferta.precio_regular}</span>
                                                <span className="text-2xl sm:text-3xl font-black text-green-500 tracking-tighter">
                                                    ${oferta.precio_oferta}
                                                </span>
                                            </div>
                                            <button className="bg-blue-600 hover:bg-black text-white px-5 py-3 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all active:scale-95">
                                                Comprar
                                            </button>
                                        </div>

                                        <div className="pt-4 border-t border-gray-50 flex justify-between text-[9px] font-black text-gray-300 uppercase">
                                            <span className="flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                Vence: {oferta.fecha_limite}
                                            </span>
                                            <span className="text-orange-400">Vigente</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

export default Home;