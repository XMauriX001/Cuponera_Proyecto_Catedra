import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Navbar({ busqueda, setBusqueda }) {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = token ? JSON.parse(localStorage.getItem('user')) : null;

    const cerrarMenu = () => setMenuAbierto(false);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error('Error al cerrar sesión');
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center gap-4">
                    <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter shrink-0" onClick={cerrarMenu}>
                        LA CUPONERA<span className="text-orange-500">.sv</span>
                    </Link>

                    {/* Buscador Global */}
                    <div className="hidden md:flex flex-1 max-w-md relative group">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input 
                            type="text"
                            placeholder="Busca tu próxima experiencia..."
                            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
                            value={busqueda}
                            onChange={(e) => {
                                setBusqueda(e.target.value);
                                if (window.location.pathname !== '/') navigate('/');
                            }}
                        />
                    </div>

                    <div className="hidden md:flex space-x-6 items-center font-bold text-xs uppercase tracking-widest">
                        <Link to="/" className="text-gray-500 hover:text-blue-600">Ofertas</Link>
                        {token ? (
                            <>
                                <Link to="/mis-cupones" className="text-gray-500 hover:text-blue-600">Mis Cupones</Link>
                                <button onClick={handleLogout} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-600 hover:text-white transition-all">
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-500 hover:text-blue-600">Ingresar</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-black transition-all shadow-lg shadow-blue-100">
                                    Registro
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setMenuAbierto(!menuAbierto)} className="text-gray-600 p-2">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {menuAbierto ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {menuAbierto && (
                <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
                    <input 
                        type="text"
                        placeholder="Buscar..."
                        className="w-full bg-gray-50 border-none rounded-xl py-3 px-4"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <div className="space-y-1">
                        <Link to="/" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700">Ofertas</Link>
                        {token ? (
                            <>
                                <Link to="/mis-cupones" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700">Mis Cupones</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-4 text-base font-bold text-red-600">Cerrar Sesión</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700">Iniciar Sesión</Link>
                                <Link to="/register" onClick={cerrarMenu} className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-black uppercase">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;