import { useState } from 'react'; 
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Cupones from './components/Cupones';

function App() {
  //Estado para controlar el menú en celulares
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Función para cerrar el menú al hacer clic en un enlace
  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <nav className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight" onClick={cerrarMenu}>
                LA CUPONERA<span className="text-orange-500">.sv</span>
              </Link>
              
              {/* Menú de opciones */}
              <div className="hidden md:flex space-x-8 items-center font-medium text-sm">
                <Link to="/" className="text-gray-700 hover:text-blue-600">Ofertas</Link>
                <Link to="/mis-cupones" className="text-gray-700 hover:text-blue-600">Mis Cupones</Link>
                <Link to="/login" className="text-gray-700 hover:text-blue-600">Iniciar Sesión</Link>
                <Link to="/register" className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
                  Registrarse
                </Link>
              </div>

              {/*Botón para opciones en moviles */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setMenuAbierto(!menuAbierto)}
                  className="text-gray-600 hover:text-blue-600 focus:outline-none p-2"
                >
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
                <Link to="/mis-cupones" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                  Mis Cupones
                </Link>
                <Link to="/login" onClick={cerrarMenu} className="block px-3 py-4 text-base font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl">
                  Iniciar Sesión
                </Link>
                <div className="pt-4">
                  <Link to="/register" onClick={cerrarMenu} className="block w-full text-center bg-blue-600 text-white px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Contenido Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/mis-cupones" element={<Cupones />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
