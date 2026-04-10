import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevaOfertaModal from './NuevaOfertaModal';

export default function MisOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [ofertaParaEditar, setOfertaParaEditar] = useState(null);

  // traemos todas las ofertas de la empresa que esta con login activo
  const cargarOfertas = useCallback(() => {
    setLoading(true);
    api.get('empresa/ofertas')
      .then(res => {
        setOfertas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargarOfertas();
  }, [cargarOfertas]);

  // abrimos el modal vacio para empezar a crear una oferta desde cero
  const manejarNuevaOferta = () => {
    setOfertaParaEditar(null);
    setModalAbierto(true);
  };

  // preparamos el modal con los datos seleccionados para editar algo
  const manejarEdicion = (oferta) => {
    setOfertaParaEditar(oferta);
    setModalAbierto(true);
  };

  // solo dejamos que editen si todavia estan en espera o se la rechazaron
  const esEditable = (estado) => ['rechazada', 'en_espera'].includes(estado);

  const estiloEstado = (estado) => {
    switch (estado) {
      case 'aprobada': return 'bg-green-50 text-green-600';
      case 'rechazada': return 'bg-red-50 text-red-600';
      case 'en_espera': return 'bg-yellow-50 text-yellow-600';
      case 'descartada': return 'bg-gray-100 text-gray-400';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Mis Ofertas</h1>
          <p className="text-sm text-gray-500 font-medium">Gestiona los cupones activos de tu empresa.</p>
        </div>
        
        <button 
          onClick={manejarNuevaOferta}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-95"
        >
          + Crear Nueva Oferta
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
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
                <tr><td colSpan="4" className="p-10 text-center text-gray-300 uppercase text-[10px] font-black animate-pulse">Cargando...</td></tr>
              ) : ofertas.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium italic">Aún no hay ofertas publicadas</td></tr>
              ) : (
                ofertas.map((oferta) => (
                  <tr key={oferta.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-gray-900">{oferta.titulo}</p>
                      <p className="text-[9px] text-blue-600 uppercase font-black">{oferta.rubro?.nombre || 'General'}</p>
                    </td>
                    <td className="p-6">
                      <span className="text-green-600 font-black text-lg">${oferta.precio_oferta}</span>
                      <span className="text-[10px] text-gray-300 line-through ml-2 font-bold">${oferta.precio_regular}</span>
                    </td>
                    <td className="p-6">
                      <span className={`${estiloEstado(oferta.estado)} text-[9px] font-black px-3 py-1 rounded-full uppercase`}>{oferta.estado?.replace('_', ' ')}</span>
                    </td>
                    <td className="p-6 text-right">
                      {esEditable(oferta.estado) ? (
                        <button 
                          onClick={() => manejarEdicion(oferta)}
                          className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-blue-600 transition-all"
                        >
                          Editar
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-300 font-bold uppercase">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-10 text-center uppercase text-[10px] font-black text-gray-300">Cargando...</div>
          ) : ofertas.map((oferta) => (
            <div key={oferta.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">{oferta.titulo}</p>
                  <p className="text-[9px] text-blue-600 uppercase font-black">{oferta.rubro?.nombre || 'General'}</p>
                </div>
                <span className={`${estiloEstado(oferta.estado)} text-[8px] font-black px-2 py-1 rounded-full uppercase`}>{oferta.estado?.replace('_', ' ')}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-green-500">${oferta.precio_oferta}</span>
                <span className="text-xs text-gray-300 line-through mb-1">${oferta.precio_regular}</span>
              </div>
              {esEditable(oferta.estado) && (
                <button 
                  onClick={() => manejarEdicion(oferta)}
                  className="w-full bg-gray-50 text-gray-900 py-3 rounded-xl font-black text-[10px] uppercase border border-gray-100"
                >
                  Editar Oferta
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <NuevaOfertaModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={cargarOfertas} 
        ofertaParaEditar={ofertaParaEditar}
      />
    </div>
  );
}