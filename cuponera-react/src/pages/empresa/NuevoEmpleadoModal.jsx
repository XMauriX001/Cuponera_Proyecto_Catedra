import { useState } from 'react';
import api from '../../api/axios';

export default function NuevoEmpleadoModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('empresa/empleados', formData);
      onSave();
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl border border-gray-100 animate-fade-in-up flex flex-col">
        
        <div className="p-8 border-b border-gray-50 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Nuevo Empleado</h2>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-gray-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre Completo</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Ej: Juan Pérez"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Correo</label>
            <input 
              type="email" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="correo@empresa.sv"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Password Temporal</label>
            <input 
              type="password" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              type="button" onClick={onClose}
              className="flex-1 bg-gray-50 text-gray-400 font-bold py-4 rounded-2xl uppercase text-[10px] tracking-widest order-2 sm:order-1"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg uppercase text-[10px] tracking-[0.2em] order-1 sm:order-2 disabled:opacity-50"
            >
              {loading ? 'Sincronizando...' : 'Dar de Alta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}