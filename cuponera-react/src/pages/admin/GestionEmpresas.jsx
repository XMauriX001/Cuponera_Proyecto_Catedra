import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevaEmpresaModal from './NuevaEmpresaModal';

export default function GestionEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  // guardamos aca la empresa que hayan tocado para poder editarla despues
  const [empresaParaEditar, setEmpresaParaEditar] = useState(null);

  // traemos toda la lista de sucursales activas desde el back
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

  // abrimos el modal en blanco para que metan una sucursal nueva
  const manejarNuevaEmpresa = () => {
    setEmpresaParaEditar(null);
    setModalAbierto(true);
  };

  // preparamos el modal de edicion con los datos que ya teniamos
  const manejarEdicion = (empresa) => {
    setEmpresaParaEditar(empresa);
    setModalAbierto(true);
  };

  return (
    <div className="p-4 md:p-0 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">DIRECTORIO SUCURSALES</h1>
          <p className="text-sm text-gray-500 font-medium">Control administrativo de socios comerciales.</p>
        </div>
        
        <button 
          onClick={manejarNuevaEmpresa}
          className="w-full sm:w-auto bg-orange-500 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-orange-100 hover:bg-black transition-all active:scale-95"
        >
          + Nueva Empresa
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empresa / Código</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contacto</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-300 uppercase text-[10px] font-black animate-pulse">Cargando...</td></tr>
              ) : empresas.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-gray-900">{emp.nombre}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-black uppercase">{emp.rubro?.nombre}</span>
                      <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded font-black uppercase">{emp.codigo}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold text-gray-700">{emp.telefono}</p>
                    <p className="text-xs text-gray-400">{emp.correo}</p>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => manejarEdicion(emp)}
                      className="bg-gray-900 text-white px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-10 text-center">Cargando...</div>
          ) : empresas.map((emp) => (
            <div key={emp.id} className="p-6 space-y-4">
              <p className="font-bold text-lg text-gray-900">{emp.nombre}</p>
              <button 
                onClick={() => manejarEdicion(emp)}
                className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest"
              >
                Gestionar Sucursal
              </button>
            </div>
          ))}
        </div>
      </div>

      <NuevaEmpresaModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={cargarEmpresas} 
        empresaParaEditar={empresaParaEditar} // aca le pasamos la data al modal por si es edicion
      />
    </div>
  );
}