import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import NuevoEmpleadoModal from './NuevoEmpleadoModal';
import { Notification } from '../../components/Notification';

export default function MisEmpleados() {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [notificacion, setNotificacion] = useState({ mostrar: false, tipo: 'success', mensaje: '' });
  
  // estados del modal de borrado
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [idAEliminar, setIdAEliminar] = useState(null);

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

  // abre el modal
  const abrirConfirmacion = (id) => {
    setIdAEliminar(id);
    setMostrarConfirmacion(true);
  };

  // borra al empleado
  const confirmarEliminacion = async () => {
    setMostrarConfirmacion(false);
    if (!idAEliminar) return;
    
    try {
      await api.delete(`empresa/empleados/${idAEliminar}`);
      lanzarNotificacion('success', 'empleado eliminado correctamente.');
      cargarEmpleados();
    } catch (error) {
      lanzarNotificacion('error', 'no se pudo eliminar el registro.');
    } finally {
      setIdAEliminar(null);
    }
  };

  // cierra el modal
  const cancelarEliminacion = () => {
    setMostrarConfirmacion(false);
    setIdAEliminar(null);
  };

  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  return (
    <div className="p-4 md:p-0 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Mi Equipo</h1>
          <p className="text-sm text-gray-500 font-medium">gestión de personal de la sucursal.</p>
        </div>
        
        <button 
          onClick={() => setModalAbierto(true)}
          className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-black transition-all active:scale-95"
        >
          + Registrar Empleado
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {/* tabla desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nombre</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Correo</th>
                <th className="p-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="3" className="p-10 text-center text-[10px] font-black uppercase text-gray-300">cargando datos...</td></tr>
              ) : (
                empleados.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-xs uppercase">
                          {emp.name.charAt(0)}
                        </div>
                        <p className="font-bold text-gray-900">{emp.name}</p>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-gray-500">{emp.email}</td>
                    <td className="p-6 text-right">
                      <button 
                        onClick={() => abrirConfirmacion(emp.id)}
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

        {/* tarjetas movil */}
        <div className="md:hidden divide-y divide-gray-100">
          {loading ? (
            <div className="p-10 text-center text-[10px] font-black uppercase text-gray-300">cargando...</div>
          ) : (
            empleados.map((emp) => (
              <div key={emp.id} className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-black uppercase">
                    {emp.name.charAt(0)}
                  </div>
                  <div className="max-w-[150px]">
                    <p className="font-bold text-lg text-gray-900 truncate leading-tight">{emp.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{emp.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => abrirConfirmacion(emp.id)}
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
          lanzarNotificacion('success', '¡empleado registrado con éxito!');
        }} 
      />

      {/* modal confirmacion */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100 space-y-6 text-center animate-bounce-in">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto border-4 border-red-100">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">¿Eliminar empleado?</h3>
                <p className="text-sm text-gray-500 mt-2 font-medium">esta acción no se puede deshacer.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button 
                onClick={cancelarEliminacion} 
                className="flex-1 bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all uppercase text-[10px] tracking-widest"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmarEliminacion} 
                className="flex-1 bg-red-500 text-white font-black py-3 rounded-xl hover:bg-black transition-all shadow-lg shadow-red-100 uppercase text-[10px] tracking-widest"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

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