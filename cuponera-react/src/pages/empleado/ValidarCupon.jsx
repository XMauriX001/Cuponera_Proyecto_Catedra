import { useState } from 'react';
import api from '../../api/axios';

export default function ValidarCupon() {
  const [codigo, setCodigo] = useState('');
  const [duiIngresado, setDuiIngresado] = useState('');
  const [cupon, setCupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // nos traemos la info del cupon buscando que ese codigo exista
  const buscarCupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setCupon(null);

    try {
      const res = await api.post('/empleado/canje/verificar', { codigo });
      setCupon(res.data.cupon);
      setDuiIngresado('');
    } catch (err) {
      setError(err.response?.data?.message || 'El código no existe o no pertenece a esta empresa');
    } finally {
      setLoading(false);
    }
  };

  // si todo cuadra, canjeamos el cupon para que ya no lo usen despues
  const canjearCupon = async () => {
    setError('');
    if (!duiIngresado) {
      setError('Debes ingresar el DUI del cliente para verificar su identidad');
      return;
    }

    try {
      const res = await api.post('/empleado/canje/canjear', { 
        codigo: cupon.codigo,
        dui: duiIngresado 
      });
      setSuccess('¡Cupón canjeado con éxito!');
      setCupon(null);
      setCodigo('');
      setDuiIngresado('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al canjear el cupón');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 md:space-y-8 animate-fade-in px-4 sm:px-0">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Validación de Cupones</h1>
        <p className="text-xs md:text-sm text-gray-500 font-medium">Ingresa el código único del cliente para procesar el canje.</p>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <form onSubmit={buscarCupon} className="flex flex-col sm:flex-row gap-4">
          <input 
            type="text"
            required
            value={codigo}
            placeholder="Ej: PIZ0017R7FDTX"
            className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-base md:text-lg font-bold tracking-widest focus:ring-2 focus:ring-blue-100 outline-none uppercase text-center sm:text-left"
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 sm:py-0 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:bg-gray-300"
          >
            {loading ? 'Buscando...' : 'Verificar'}
          </button>
        </form>

        {error && (
           <div className="mt-6 bg-red-50 text-red-600 p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest">
             {error}
           </div>
        )}
        {success && (
           <div className="mt-6 bg-green-50 text-green-600 p-4 rounded-2xl text-center text-xs font-black uppercase tracking-widest">
             {success}
           </div>
        )}
      </div>

      {cupon && (
        <div className="bg-blue-600 rounded-[2rem] p-6 md:p-8 text-white shadow-2xl shadow-blue-200 animate-fade-in-up">
          <div className="space-y-6 md:space-y-8">
            <div className="border-b border-blue-400/50 pb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Oferta</p>
              <h2 className="text-xl md:text-2xl font-black leading-tight mt-1">{cupon.oferta}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Cliente</p>
                <p className="font-bold text-base md:text-lg mt-1">{cupon.cliente?.nombres} {cupon.cliente?.apellidos}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Estado</p>
                <p className="font-black text-base md:text-lg uppercase mt-1">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    cupon.estado === 'disponible' ? 'bg-green-500/20 text-green-100' : 
                    cupon.estado === 'canjeado' ? 'bg-orange-500/20 text-orange-100' : 'bg-red-500/20 text-red-100'
                  }`}>
                    {cupon.estado}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-blue-700/50 rounded-2xl p-6 space-y-4">
              {cupon.estado === 'disponible' ? (
                <>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 block mb-2">
                       Verificación de Identidad (DUI del cliente)
                    </label>
                    <input 
                      type="text"
                      className="w-full bg-white/10 border-2 border-white/20 rounded-xl p-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white transition-all text-center tracking-widest font-bold"
                      placeholder="00000000-0"
                      value={duiIngresado}
                      onChange={(e) => setDuiIngresado(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={canjearCupon}
                    className="w-full bg-white text-blue-600 font-black py-4 rounded-xl hover:bg-black hover:text-white transition-all uppercase text-xs tracking-widest shadow-xl mt-2"
                  >
                    Confirmar Entrega de Cupón
                  </button>
                </>
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-sm font-black text-white/50 uppercase tracking-widest">
                    Este cupón ya fue {cupon.estado}
                  </p>
                  {cupon.fecha_canje && (
                    <p className="text-xs text-white/40 font-bold uppercase tracking-wider">
                      Fecha: {new Date(cupon.fecha_canje).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}