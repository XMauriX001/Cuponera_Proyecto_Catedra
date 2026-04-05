import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevaEmpresaModal from './NuevaEmpresaModal';

export default function GestionEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarEmpresas = useCallback(() => {
    setLoading(true);
    api.get('/admin/empresas')
      .then(res => {
        setEmpresas(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al traer empresas", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargarEmpresas();
  }, [cargarEmpresas]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Directorio de Empresas</h1>
          <p className="text-sm text-gray-500 font-medium">Control total sobre los socios comerciales y sus rubros.</p>
        </div>
        
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-orange-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-black transition-all active:scale-95"
        >
          + Registrar Nueva Empresa
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ubicación</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400 uppercase text-[10px] font-black animate-pulse">Sincronizando con la base de datos...</td></tr>
            ) : empresas.length === 0 ? (
              <tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium italic">Aún no hay empresas registradas en el sistema</td></tr>
            ) : (
              empresas.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{emp.nombre}</p>
                    <p className="text-[10px] text-blue-600 uppercase font-black">{emp.rubro?.nombre}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-medium text-gray-700">{emp.telefono}</p>
                    <p className="text-[10px] text-gray-400">{emp.correo}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{emp.direccion}</p>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:text-black transition-colors">Configurar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NuevaEmpresaModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={cargarEmpresas} 
      />
    </div>
  );
}