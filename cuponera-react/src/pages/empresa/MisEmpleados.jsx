import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevoEmpleadoModal from './NuevoEmpleadoModal';
import { Notification } from '../../components/Notification';

export default function MisEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });

  const cargarEmpleados = useCallback(() => {
    setLoading(true);
    api.get('empresa/empleados')
      .then(res => {
        setEmpleados(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const lanzarNotificacion = (tipo, mensaje) => {
    setNotificacion({ mostrar: true, tipo, mensaje });
  };

  const cerrarNotificacion = () => {
    setNotificacion({ mostrar: false, tipo: '', mensaje: '' });
  };

  const eliminarEmpleado = async (id) => {
    if (!confirm('¿Estás seguro de eliminar a este empleado?')) return;
    
    try {
      await api.delete(`empresa/empleados/${id}`);
      lanzarNotificacion('success', 'Empleado eliminado correctamente.');
      cargarEmpleados();
    } catch (error) {
      lanzarNotificacion('error', 'No se pudo eliminar el registro.');
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return (
    <div className="p-4 md:p-0 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Mi Equipo</h1>
          <p className="text-sm text-gray-500 font-medium">Gestión de personal de la sucursal.</p>
        </div>
        
        <button 
          onClick={() => setModalAbierto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-95"
        >
          + Registrar Empleado
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Empleado</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Correo</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center text-[10px] font-black uppercase text-gray-300">Cargando...</td></tr>
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
                    <td className="p-6 text-sm text-gray-500">{emp.email}</td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => eliminarEmpleado(emp.id)}
                        className="text-red-400 font-black text-[10px] uppercase tracking-widest hover:text-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-10 text-center text-[10px] font-black uppercase text-gray-300">Cargando...</div>
          ) : (
            empleados.map((emp) => (
              <div key={emp.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{emp.name}</p>
                    <p className="text-[10px] text-gray-400">{emp.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => eliminarEmpleado(emp.id)}
                  className="bg-red-50 text-red-500 w-10 h-10 rounded-xl flex items-center justify-center"
                >
                  <span className="text-xs font-black">✕</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <NuevoEmpleadoModal 
        isOpen={modalAbierto} 
        onClose={() => setModalAbierto(false)} 
        onSave={() => {
          cargarEmpleados();
          lanzarNotificacion('success', '¡Empleado registrado con éxito!');
        }} 
      />

      {notificacion.mostrar && (
        <Notification 
          type={notificacion.tipo} 
          message={notificacion.mensaje} 
          onClose={cerrarNotificacion} 
        />
      )}
    </div>
  );
}