import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevoEmpleadoModal from './NuevoEmpleadoModal';

export default function MisEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const cargarEmpleados = useCallback(() => {
    setLoading(true);
    api.get('/empresa/empleados')
      .then(res => {
        setEmpleados(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al traer empleados", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Mi Equipo</h1>
          <p className="text-sm text-gray-500 font-medium">Gestiona el personal encargado de validar cupones.</p>
        </div>
        
        <button 
          onClick={() => setModalAbierto(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-black transition-all active:scale-95"
        >
          + Registrar Empleado
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre del Empleado</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Correo Electrónico</th>
              <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan="3" className="p-10 text-center text-gray-400 uppercase text-[10px] font-black animate-pulse">Cargando personal...</td></tr>
            ) : empleados.length === 0 ? (
              <tr><td colSpan="3" className="p-10 text-center text-gray-400 font-medium italic">Aún no tienes empleados registrados</td></tr>
            ) : (
              empleados.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xs">
                        {emp.name.charAt(0)}
                      </div>
                      <p className="font-bold text-gray-900">{emp.name}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <p className="text-sm text-gray-500">{emp.email}</p>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-red-400 font-black text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <NuevoEmpleadoModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={cargarEmpleados} 
      />
    </div>
  );
}