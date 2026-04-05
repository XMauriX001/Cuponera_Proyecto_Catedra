import { Outlet, Link, useNavigate } from 'react-router-dom';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.roles?.[0]?.name;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Menu lateral */}
      <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="text-xl font-black text-blue-600 tracking-tighter">
            LA CUPONERA<span className="text-orange-500">.sv</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {role === 'admin' && (
            <>
              <Link to="/admin" className="block p-4 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">Estadísticas Globales</Link>
              <Link to="/admin/empresas" className="block p-4 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">Empresas</Link>
            </>
          )}

          {role === 'empresa' && (
            <>
              <Link to="/empresa" className="block p-4 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">Mis Ofertas</Link>
              <Link to="/empresa/empleados" className="block p-4 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">Mis Empleados</Link>
            </>
          )}

          {role === 'empleado' && (
            <Link to="/empleado" className="block p-4 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all">Validar Cupón</Link>
          )}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={handleLogout}
            className="w-full text-left p-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido*/}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div>
            <h2 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Gestión</h2>
            <p className="text-sm font-bold text-gray-900 capitalize">Panel de {role}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-none">{user?.name}</p>
              <p className="text-[9px] font-bold text-blue-600 uppercase mt-1">
                {user?.empresa_id ? `ID Empresa: ${user.empresa_id}` : 'Admin General'}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Contenido Dinamico */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}