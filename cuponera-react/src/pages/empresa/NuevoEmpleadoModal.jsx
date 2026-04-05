import { useState } from 'react';
import api from '../../api/axios';

export default function NuevoEmpleadoModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/empresa/empleados', formData);
      onSave();
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error("Error al registrar empleado", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Nuevo Empleado</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Nombre Completo</label>
            <input 
              type="text" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              placeholder="Ej: Juan Pérez"
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Correo de Acceso</label>
            <input 
              type="email" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              placeholder="correo@empresa.com"
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contraseña Temporal</label>
            <input 
              type="password" required
              className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
              placeholder="Mínimo 8 caracteres"
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className="flex gap-4 pt-4">
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
              Dar de Alta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}