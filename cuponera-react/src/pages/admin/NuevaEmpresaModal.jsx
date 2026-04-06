import { useState, useEffect } from 'react';
import api from '../../api/axios';

export default function NuevaEmpresaModal({ isOpen, onClose, onSave, empresaParaEditar }) {
  const estadoInicial = {
    nombre: '',
    codigo: '',
    direccion: '',
    nombre_contacto: '',
    telefono: '',
    correo: '',
    password: '',
    rubro_id: '',
    porcentaje_comision: ''
  };

  const [formData, setFormData] = useState(estadoInicial);
  const [rubros, setRubros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Si empresaParaEditar tiene datos, los cargamos en el formulario
  useEffect(() => {
    if (isOpen) {
      api.get('admin/rubros').then(res => setRubros(res.data));
      
      if (empresaParaEditar) {
        setFormData({
          ...empresaParaEditar,
          password: '' // No mostramos la contraseña por seguridad
        });
      } else {
        setFormData(estadoInicial);
      }
    }
  }, [isOpen, empresaParaEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (empresaParaEditar) {
        // Modo Edición: Usamos PUT y el ID de la empresa
        await api.put(`admin/empresas/${empresaParaEditar.id}`, formData);
      } else {
        // Modo Creación: Usamos POST
        await api.post('admin/empresas', formData);
      }
      onSave();
      onClose();
    } catch (error) {
      console.error("Error al procesar empresa", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100">
        
        <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
              {empresaParaEditar ? 'Editar Empresa' : 'Alta de Socio Comercial'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-black">✕</button>
        </div>

        <div className="overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <form id="empresaForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nombre</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Código</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.codigo}
                onChange={e => setFormData({...formData, codigo: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Contacto</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.nombre_contacto}
                onChange={e => setFormData({...formData, nombre_contacto: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Teléfono</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Correo</label>
              <input 
                type="email" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.correo}
                onChange={e => setFormData({...formData, correo: e.target.value})}
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">
                Contraseña {empresaParaEditar && '(Opcional)'}
              </label>
              <input 
                type="password" required={!empresaParaEditar}
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Dirección</label>
              <input 
                type="text" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.direccion}
                onChange={e => setFormData({...formData, direccion: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Comisión %</label>
              <input 
                type="number" step="0.01" required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.porcentaje_comision}
                onChange={e => setFormData({...formData, porcentaje_comision: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Rubro</label>
              <select 
                required
                className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm outline-none"
                value={formData.rubro_id}
                onChange={e => setFormData({...formData, rubro_id: e.target.value})}
              >
                <option value="">Seleccionar...</option>
                {rubros.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 md:p-8 bg-gray-50/50 border-t border-gray-50 flex flex-col md:flex-row gap-3">
          <button type="button" onClick={onClose} className="w-full md:flex-1 bg-white text-gray-400 font-bold py-4 rounded-2xl border border-gray-200">
            Cerrar
          </button>
          <button 
            form="empresaForm" type="submit" disabled={loading}
            className="w-full md:flex-2 bg-blue-600 text-white font-black py-4 rounded-2xl disabled:opacity-50"
          >
            {loading ? 'Guardando...' : (empresaParaEditar ? 'Guardar Cambios' : 'Registrar Empresa')}
          </button>
        </div>
      </div>
    </div>
  );
}