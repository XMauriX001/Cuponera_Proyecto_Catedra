import { useState } from 'react';
import  api  from '../api/axios';

export function Register() {
    const [formData, setFormData] = useState({
        nombres: '', apellidos: '', telefono: '', 
        correo: '', direccion: '', dui: '', password: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos para registro:", formData);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-black text-gray-800 mb-6 text-center">Crea tu cuenta</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres y Apellidos */}
                <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                       placeholder="Nombres" onChange={e => setFormData({...formData, nombres: e.target.value})} />
                <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                       placeholder="Apellidos" onChange={e => setFormData({...formData, apellidos: e.target.value})} />
                
                {/* DUI y Teléfono*/}
                <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                       placeholder="DUI (00000000-0)" onChange={e => setFormData({...formData, dui: e.target.value})} />
                <input className="border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                       placeholder="Teléfono" onChange={e => setFormData({...formData, telefono: e.target.value})} />
                
                {/* Correo y Dirección */}
                <input className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                       type="email" placeholder="Correo Electrónico" onChange={e => setFormData({...formData, correo: e.target.value})} />
                <textarea className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                       placeholder="Dirección Completa" onChange={e => setFormData({...formData, direccion: e.target.value})}></textarea>
                
                {/* Contraseña */}
                <input className="border p-3 rounded-lg md:col-span-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                       type="password" placeholder="Contraseña" onChange={e => setFormData({...formData, password: e.target.value})} />

                <button className="md:col-span-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all mt-4">
                    Registrarme ahora
                </button>
            </form>
        </div>
    );
}

export default Register;