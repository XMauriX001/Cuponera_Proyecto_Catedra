import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevaOfertaModal from './NuevaOfertaModal';

export default function MisOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarOfertas = useCallback(() => {
    setLoading(true);
    api.get('/empresa/ofertas')
      .then(res => {
        setOfertas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al traer ofertas", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargarOfertas();
  }, [cargarOfertas]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Mis Ofertas</h1>
          <p className="text-sm text-gray-500 font-medium">Gestiona los cupones activos de tu empresa.</p>
        </div>
        
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-black transition-all active:scale-95"
        >
          + Crear Nueva Oferta
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Oferta</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400 uppercase text-[10px] font-black animate-pulse">Cargando tus ofertas...</td></tr>
            ) : ofertas.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium italic">Aún no has publicado ofertas 😅</td></tr>
            ) : (
              ofertas.map((oferta) => (
                <tr key={oferta.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{oferta.titulo}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{oferta.rubro?.nombre || 'General'}</p>
                  </td>
                  <td className="p-6">
                    <span className="text-green-600 font-black text-lg">${oferta.precio_oferta}</span>
                    <span className="text-[10px] text-gray-300 line-through ml-2 font-bold">${oferta.precio_regular}</span>
                  </td>
                  <td className="p-6">
                    <span className="bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Activa</span>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-black transition-colors">Editar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NuevaOfertaModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={cargarOfertas} 
      />
    </div>
  );
}