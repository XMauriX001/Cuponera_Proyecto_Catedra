import React from 'react';

const Cupones = () => {
    // Datos de ejemplo 
    const cuponesEjemplo = [
        { id: 1, titulo: 'Pizza Familiar 2x1', empresa: 'Pizza Hut', codigo: 'PHU-9823712', estado: 'Disponible', fecha: '20/02/2026' },
        { id: 2, titulo: 'Corte cabello + limpieza facial', empresa: 'Pao Salon', codigo: 'PAS-1122334', estado: 'Canjeado', fecha: '10/02/2026' },
        { id: 3, titulo: '3 pupusas + Cafe + Quesadilla', empresa: 'Vivero Arco El Cafe', codigo: 'VAC-0099887', estado: 'Vencido', fecha: '01/01/2026' },
    ];

    const categorias = ['Disponible', 'Canjeado', 'Vencido'];

    return (
        <div className="space-y-10">
            <header className="border-b pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Mis Cupones</h1>
                <p className="text-gray-500 mt-1">Administra y revisa el estado de tus compras.</p>
            </header>

            {categorias.map((cat) => (
                <section key={cat}>
                    <h2 className={`text-xl font-bold mb-4 flex items-center ${
                        cat === 'Disponible' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                        <span className={`w-3 h-3 rounded-full mr-2 ${
                            cat === 'Disponible' ? 'bg-green-600' : 'bg-gray-400'
                        }`}></span>
                        Cupones {cat}s
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cuponesEjemplo.filter(c => c.estado === cat).map(cupon => (
                            <div key={cupon.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-black text-blue-600 uppercase tracking-tighter mb-1">
                                            {cupon.empresa}
                                        </p>
                                        <h3 className="text-lg font-bold text-gray-800">{cupon.titulo}</h3>
                                        <p className="text-sm font-mono text-gray-500 mt-2 bg-gray-50 p-1 rounded inline-block">
                                            Código: {cupon.codigo}
                                        </p>
                                    </div>
                                    
                                    {cat === 'Disponible' && (
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all shadow-lg shadow-blue-100">
                                            Descargar PDF
                                        </button>
                                    )}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 text-[10px] text-gray-400 font-bold uppercase">
                                    {cat === 'Vencido' ? 'Expiró el' : 'Comprado el'}: {cupon.fecha}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Cupones; 