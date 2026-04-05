import { useState } from 'react';
import api from '../../api/axios';

export default function ValidarCupon() {
  const [codigo, setCodigo] = useState('');
  const [cupon, setCupon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const buscarCupon = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCupon(null);

    try {
      const res = await api.get(`/empleado/cupones/${codigo}`);
      setCupon(res.data);
    } catch (err) {
      setError('El código no existe o no pertenece a esta empresa');
    } finally {
      setLoading(false);
    }
  };

  const canjearCupon = async () => {
    try {
      await api.put(`/empleado/cupones/${codigo}/canjear`);
      alert('¡Cupón canjeado con éxito!');
      setCupon(null);
      setCodigo('');
    } catch (err) {
      alert('Error al canjear el cupón');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Validación de Cupones</h1>
        <p className="text-sm text-gray-500 font-medium">Ingresa el código único del cliente para procesar el canje.</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <form onSubmit={buscarCupon} className="flex gap-4">
          <input 
            type="text"
            required
            value={codigo}
            placeholder="Ej: CUP-123456"
            className="flex-1 bg-gray-50 border-none rounded-2xl p-4 text-lg font-bold tracking-widest focus:ring-2 focus:ring-blue-100 outline-none uppercase"
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-100 disabled:bg-gray-300"
          >
            {loading ? 'Buscando...' : 'Verificar'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-xs font-black uppercase tracking-widest text-center">{error}</p>
        )}
      </div>

      {cupon && (
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 animate-fade-in-up">
          <div className="space-y-6">
            <div className="border-b border-blue-400/50 pb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Oferta</p>
              <h2 className="text-2xl font-black">{cupon.oferta?.titulo}</h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Cliente</p>
                <p className="font-bold text-lg">{cupon.usuario?.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Estado</p>
                <p className="font-black text-lg uppercase">{cupon.estado}</p>
              </div>
            </div>

            {cupon.estado === 'disponible' ? (
              <button 
                onClick={canjearCupon}
                className="w-full bg-white text-blue-600 font-black py-4 rounded-2xl hover:bg-orange-500 hover:text-white transition-all uppercase text-xs tracking-widest shadow-xl"
              >
                Confirmar Entrega de Cupón
              </button>
            ) : (
              <div className="w-full bg-blue-800/50 text-white/50 font-black py-4 rounded-2xl text-center uppercase text-xs tracking-widest">
                Este cupón ya fue utilizado
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}