import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function Navbar() {
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
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight" onClick={cerrarMenu}>
                        LA CUPONERA<span className="text-orange-500">.sv</span>
                    </Link>

                    {/* Menú desktop */}
                    <div className="hidden md:flex space-x-8 items-center font-medium text-sm">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">Ofertas</Link>

                        {token ? (
                            <>
                                <Link to="/mis-cupones" className="text-gray-700 hover:text-blue-600">Mis Cupones</Link>
                                <span className="text-gray-700">Hola, {user?.nombres}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-700 hover:text-blue-600">Iniciar Sesión</Link>
                                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Botón hamburguesa móvil */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            className="text-gray-600 hover:text-blue-600 focus:outline-none p-2">
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

            {/* Menú móvil desplegable */}
            {menuAbierto && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
                    <div className="px-4 pt-2 pb-6 space-y-1 shadow-lg">
                        <Link to="/" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                            Ofertas
                        </Link>

                        {token ? (
                            <>
                                <Link to="/mis-cupones" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                                    Mis Cupones
                                </Link>
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    Hola, {user?.nombres}
                                </div>
                                <button
                                    onClick={() => { handleLogout(); cerrarMenu(); }}
                                    className="block w-full text-left px-3 py-4 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl">
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                                    Iniciar Sesión
                                </Link>
                                <div className="pt-4">
                                    <Link to="/register" onClick={cerrarMenu} className="block w-full text-center bg-blue-600 text-white px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                                        Registrarse
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;