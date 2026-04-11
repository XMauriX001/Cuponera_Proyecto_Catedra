import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.roles?.[0]?.name;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // escondemos el menu si cambian de pag en movil
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      
      {/* fondito oscuro transparente cuando abren el menu en el cel */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* barra lateral donde esta todo el menu principal */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="p-8 flex justify-between items-center whitespace-nowrap">
          <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter" onClick={handleLinkClick}>
            LA CUPONERA<span className="text-orange-500">.sv</span>
          </Link>
          <button className="md:hidden text-gray-400 hover:text-black font-black" onClick={() => setIsMobileMenuOpen(false)}>
            ✕
          </button>
        </div>

        {/* mostramos u ocultamos opciones dependiendo del rol de la persona */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          
          {/* vistas solo para el admin dueño de todo */}
          {role === 'administrador' && (
            <>
              <Link to="/admin" onClick={handleLinkClick} className={`block p-4 text-sm font-bold rounded-2xl transition-all ${location.pathname === '/admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Directorio Empresas</Link>
              <Link to="/admin/ofertas" onClick={handleLinkClick} className={`block p-4 text-sm font-bold rounded-2xl transition-all ${location.pathname === '/admin/ofertas' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Revisión Ofertas</Link>
            </>
          )}

          {/* lo que pueden ver los dueños de sucursales */}
          {role === 'admin_empresa' && (
            <>
              <Link to="/empresa" onClick={handleLinkClick} className={`block p-4 text-sm font-bold rounded-2xl transition-all ${location.pathname === '/empresa' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Mis Ofertas</Link>
              <Link to="/empresa/empleados" onClick={handleLinkClick} className={`block p-4 text-sm font-bold rounded-2xl transition-all ${location.pathname === '/empresa/empleados' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Mis Empleados</Link>
            </>
          )}

          {/* vista para el trabajador que canjea la promo */}
          {role === 'empleado' && (
            <Link to="/empleado" onClick={handleLinkClick} className={`block p-4 text-sm font-bold rounded-2xl transition-all ${location.pathname === '/empleado' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}>Validar Cupón</Link>
          )}
        </nav>

        {/* boton de salida */}
        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full text-left p-4 text-sm font-bold flex items-center justify-between text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            Cerrar Sesión
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>
      </aside>

      {/* cuerpo principal */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* panel de arriba con el logo y botoncito movil */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-500 hover:text-black rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
            </button>
            <div>
              <h2 className="text-[10px] font-black text-gray-400 md:text-gray-300 uppercase tracking-[0.2em] leading-none">Gestión</h2>
              <p className="text-xs md:text-sm font-bold text-gray-900 capitalize mt-1 hidden sm:block">Panel de {role}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-none">{user?.name}</p>
              <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">
                {user?.empresa_id ? `ID Empresa: ${user.empresa_id}` : 'Admin General'}
              </p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="md:hidden flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl"
            >
              Salir
            </button>
            
            <div className="hidden md:flex w-10 h-10 bg-blue-600 rounded-2xl items-center justify-center text-white font-black shadow-lg shadow-blue-100 uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* vista de la pagina actual */}
        <div className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>

    </div>
  );
}