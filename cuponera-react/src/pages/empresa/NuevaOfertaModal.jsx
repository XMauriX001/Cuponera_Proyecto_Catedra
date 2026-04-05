import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function NuevaOfertaModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio_regular: '',
    precio_oferta: '',
    fecha_fin: '',
    cantidad_limite: '',
    rubro_id: ''
  });

  const [rubros, setRubros] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/rubros').then(res => setRubros(res.data));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/empresa/ofertas', formData);
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al crear oferta", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Crear Nueva Oferta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Título de la Oferta</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              placeholder="Ej: 2x1 en Pizzas Medianas"
              onChange={e => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
            <textarea 
              required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all h-24 outline-none resize-none"
              placeholder="Detalla qué incluye el cupón..."
              onChange={e => setFormData({...formData, descripcion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Regular ($)</label>
            <input 
              type="number" step="0.01" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              onChange={e => setFormData({...formData, precio_regular: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Precio Oferta ($)</label>
            <input 
              type="number" step="0.01" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              onChange={e => setFormData({...formData, precio_oferta: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fecha Límite</label>
            <input 
              type="date" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              onChange={e => setFormData({...formData, fecha_fin: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categoría (Rubro)</label>
            <select 
              required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
              onChange={e => setFormData({...formData, rubro_id: e.target.value})}
            >
              <option value="">Seleccionar...</option>
              {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>

          <div className="md:col-span-2 pt-4 flex gap-4">
            <button 
              type="button" onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-blue-100 uppercase text-[10px] tracking-widest"
            >
              Publicar Oferta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}