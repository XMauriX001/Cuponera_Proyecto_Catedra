import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function NuevaOfertaModal({ isOpen, onClose, onSave, ofertaParaEditar }) {
  const estadoInicial = {
    titulo: '',
    descripcion: '',
    precio_regular: '',
    precio_oferta: '',
    fecha_inicio: '',
    fecha_fin: '',
    fecha_limite_cupon: '',
    cantidad_limite: '',
    rubro_id: '',
    otros_detalles: ''
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('rubros')
        .then(res => setRubros(res.data))
        .catch(err => console.error(err));

      if (ofertaParaEditar) {
        setFormData({
          titulo: ofertaParaEditar.titulo || '',
          descripcion: ofertaParaEditar.descripcion || '',
          precio_regular: ofertaParaEditar.precio_regular || '',
          precio_oferta: ofertaParaEditar.precio_oferta || '',
          fecha_inicio: ofertaParaEditar.fecha_inicio || '',
          fecha_fin: ofertaParaEditar.fecha_fin || '',
          fecha_limite_cupon: ofertaParaEditar.fecha_limite_cupon || '',
          cantidad_limite: ofertaParaEditar.cantidad_limite || '',
          rubro_id: ofertaParaEditar.rubro_id || '',
          otros_detalles: ofertaParaEditar.otros_detalles || ''
        });
      } else {
        setFormData(estadoInicial);
      }
    }
  }, [isOpen, ofertaParaEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const dataToSend = {
        ...formData,
        empresa_id: user?.empresa_id,
        estado: ofertaParaEditar ? ofertaParaEditar.estado : 'espera'
      };

      if (ofertaParaEditar) {
        await api.put(`empresa/ofertas/${ofertaParaEditar.id}`, dataToSend);
      } else {
        await api.post('empresa/ofertas', dataToSend);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col rounded-[2.5rem] shadow-2xl border border-gray-100 animate-fade-in-up">
        
        <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              {ofertaParaEditar ? 'Editar Oferta' : 'Publicar Oferta'}
            </h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Gestiona los detalles del cupón</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400 hover:text-black">✕</button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <form id="ofertaForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Título</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
                value={formData.titulo}
                onChange={e => setFormData({...formData, titulo: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Descripción</label>
              <textarea 
                required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm h-20 outline-none resize-none focus:ring-2 focus:ring-blue-100"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Precio Regular ($)</label>
              <input 
                type="number" step="0.01" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.precio_regular}
                onChange={e => setFormData({...formData, precio_regular: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Precio Oferta ($)</label>
              <input 
                type="number" step="0.01" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.precio_oferta}
                onChange={e => setFormData({...formData, precio_oferta: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Fecha Inicio</label>
              <input 
                type="date" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.fecha_inicio}
                onChange={e => setFormData({...formData, fecha_inicio: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Fecha Fin</label>
              <input 
                type="date" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.fecha_fin}
                onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Límite Canje</label>
              <input 
                type="date" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.fecha_limite_cupon}
                onChange={e => setFormData({...formData, fecha_limite_cupon: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Cantidad Límite</label>
              <input 
                type="number" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.cantidad_limite}
                onChange={e => setFormData({...formData, cantidad_limite: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Rubro</label>
              <div className="relative">
                <select 
                  required
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none appearance-none cursor-pointer"
                  value={formData.rubro_id}
                  onChange={e => setFormData({...formData, rubro_id: e.target.value})}
                >
                  <option value="">Seleccionar...</option>
                  {rubros.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
              </div>
            </div>

            <div className="md:col-span-1 space-y-1">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Otros Detalles</label>
              <input 
                type="text"
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.otros_detalles}
                onChange={e => setFormData({...formData, otros_detalles: e.target.value})}
              />
            </div>
          </form>
        </div>

        <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row gap-3">
          <button 
            type="button" onClick={onClose}
            className="w-full md:flex-1 bg-white text-gray-400 font-bold py-4 rounded-2xl border border-gray-200 uppercase text-[10px] tracking-widest"
          >
            Cancelar
          </button>
          <button 
            form="ofertaForm"
            type="submit"
            disabled={loading}
            className="w-full md:flex-2 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase text-[10px] tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (ofertaParaEditar ? 'Guardar Cambios' : 'Publicar Ahora')}
          </button>
        </div>
      </div>
    </div>
  );
}