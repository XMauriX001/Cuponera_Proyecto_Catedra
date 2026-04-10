import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';

export default function GestionOfertas() {
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('en_espera');
  const [procesando, setProcesando] = useState(null);
  const [modalRechazo, setModalRechazo] = useState({ abierto: false, ofertaId: null });
  const [justificacion, setJustificacion] = useState('');

  // cargamos las ofertas dependiendo del filtro que elija el admin
  const cargarOfertas = useCallback(() => {
    setLoading(true);
    const url = filtro ? `admin/ofertas?estado=${filtro}` : 'admin/ofertas';
    api.get(url)
      .then(res => {
        setOfertas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [filtro]);

  useEffect(() => {
    cargarOfertas();
  }, [cargarOfertas]);

  // funcion sencilla para dar luz verde a una oferta
  const aprobar = async (id) => {
    setProcesando(id);
    try {
      await api.post(`admin/ofertas/${id}/aprobar`);
      cargarOfertas();
    } catch (err) {
      console.error(err);
    } finally {
      setProcesando(null);
    }
  };

  const abrirModalRechazo = (id) => {
    setModalRechazo({ abierto: true, ofertaId: id });
    setJustificacion('');
  };

  // en caso de rechazar, se exige que justifiquen el motivo un poco
  const rechazar = async () => {
    if (justificacion.length < 10) return;
    setProcesando(modalRechazo.ofertaId);
    try {
      await api.post(`admin/ofertas/${modalRechazo.ofertaId}/rechazar`, {
        justificacion_rechazo: justificacion
      });
      setModalRechazo({ abierto: false, ofertaId: null });
      cargarOfertas();
    } catch (err) {
      console.error(err);
    } finally {
      setProcesando(null);
    }
  };

  const estiloEstado = (estado) => {
    switch (estado) {
      case 'aprobada': return 'bg-green-50 text-green-600';
      case 'rechazada': return 'bg-red-50 text-red-600';
      case 'en_espera': return 'bg-yellow-50 text-yellow-600';
      case 'descartada': return 'bg-gray-100 text-gray-400';
      default: return 'bg-gray-50 text-gray-500';
    }
  };

  // estos son los botones de arriba para filtrar visualmente 
  const filtros = [
    { valor: 'en_espera', label: 'En Espera' },
    { valor: 'aprobada', label: 'Aprobadas' },
    { valor: 'rechazada', label: 'Rechazadas' },
    { valor: '', label: 'Todas' },
  ];

  return (
    <div className="space-y-8 animate-fade-in p-4 md:p-0">
      <div>
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Revisión de Ofertas</h1>
        <p className="text-sm text-gray-500 font-medium">Aprueba o rechaza las ofertas de los socios comerciales.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        {filtros.map(f => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
              filtro === f.valor 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' 
                : 'bg-white text-gray-400 border border-gray-200 hover:border-blue-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Oferta</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-300 uppercase text-[10px] font-black animate-pulse">Cargando...</td></tr>
              ) : ofertas.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium italic">No hay ofertas con este filtro.</td></tr>
              ) : (
                ofertas.map((oferta) => (
                  <tr key={oferta.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <p className="font-bold text-gray-900">{oferta.titulo}</p>
                      <p className="text-[9px] text-blue-600 uppercase font-black">{oferta.rubro?.nombre || 'General'}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-gray-700">{oferta.empresa?.nombre}</p>
                    </td>
                    <td className="p-6">
                      <span className="text-green-600 font-black text-lg">${oferta.precio_oferta}</span>
                      <span className="text-[10px] text-gray-300 line-through ml-2 font-bold">${oferta.precio_regular}</span>
                    </td>
                    <td className="p-6">
                      <span className={`${estiloEstado(oferta.estado)} text-[9px] font-black px-3 py-1 rounded-full uppercase`}>
                        {oferta.estado?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-6 text-right">
                      {oferta.estado === 'en_espera' && (
                        <div className="flex gap-2 justify-end">
                          <button
                            disabled={procesando === oferta.id}
                            onClick={() => aprobar(oferta.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-green-600 transition-all disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            disabled={procesando === oferta.id}
                            onClick={() => abrirModalRechazo(oferta.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase hover:bg-red-600 transition-all disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}
                      {oferta.estado !== 'en_espera' && (
                        <span className="text-[9px] text-gray-300 font-bold uppercase">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-10 text-center uppercase text-[10px] font-black text-gray-300">Cargando...</div>
          ) : ofertas.map((oferta) => (
            <div key={oferta.id} className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg text-gray-900 leading-tight">{oferta.titulo}</p>
                  <p className="text-[9px] text-blue-600 uppercase font-black">{oferta.empresa?.nombre}</p>
                </div>
                <span className={`${estiloEstado(oferta.estado)} text-[8px] font-black px-2 py-1 rounded-full uppercase`}>
                  {oferta.estado?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-black text-green-500">${oferta.precio_oferta}</span>
                <span className="text-xs text-gray-300 line-through mb-1">${oferta.precio_regular}</span>
              </div>
              {oferta.estado === 'en_espera' && (
                <div className="flex gap-2">
                  <button
                    disabled={procesando === oferta.id}
                    onClick={() => aprobar(oferta.id)}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-black text-[10px] uppercase disabled:opacity-50"
                  >
                    Aprobar
                  </button>
                  <button
                    disabled={procesando === oferta.id}
                    onClick={() => abrirModalRechazo(oferta.id)}
                    className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase disabled:opacity-50"
                  >
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Rechazo */}
      {modalRechazo.abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 p-8 space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Rechazar Oferta</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Indica el motivo del rechazo</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Justificación (mín. 10 caracteres)</label>
              <textarea
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm h-28 outline-none resize-none focus:ring-2 focus:ring-red-100"
                value={justificacion}
                onChange={e => setJustificacion(e.target.value)}
                placeholder="Describe por qué se rechaza esta oferta..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModalRechazo({ abierto: false, ofertaId: null })}
                className="flex-1 bg-white text-gray-400 font-bold py-4 rounded-2xl border border-gray-200 uppercase text-[10px] tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={rechazar}
                disabled={justificacion.length < 10 || procesando}
                className="flex-1 bg-red-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] tracking-widest disabled:opacity-50"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
