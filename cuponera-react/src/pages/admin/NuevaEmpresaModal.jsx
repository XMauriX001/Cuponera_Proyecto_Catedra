import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function NuevaEmpresaModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    direccion: '',
    comision: '',
    rubro_id: ''
  });

  const [rubros, setRubros] = useState([]);

  useEffect(() => {
    if (isOpen) {
      api.get('/admin/rubros').then(res => setRubros(res.data));
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/empresas', formData);
      onSave();
      onClose();
      setFormData({ nombre: '', correo: '', telefono: '', direccion: '', comision: '', rubro_id: '' });
    } catch (error) {
      console.error("Error al registrar empresa", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Registrar Socio Comercial</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre de la Empresa</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Ej: Pizza Hut El Salvador"
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Correo de Contacto</label>
            <input 
              type="email" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="admin@empresa.com"
              onChange={e => setFormData({...formData, correo: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Teléfono</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="2222-2222"
              onChange={e => setFormData({...formData, telefono: e.target.value})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Dirección Fiscal</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Calle principal, San Salvador..."
              onChange={e => setFormData({...formData, direccion: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Comisión (%)</label>
            <input 
              type="number" step="0.01" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Ej: 10.5"
              onChange={e => setFormData({...formData, comision: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Rubro</label>
            <select 
              required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none appearance-none"
              onChange={e => setFormData({...formData, rubro_id: e.target.value})}
            >
              <option value="">Seleccionar rubro...</option>
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
              className="flex-1 bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-black transition-all shadow-lg shadow-orange-100 uppercase text-[10px] tracking-widest"
            >
              Dar de Alta Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}