import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/cliente/Home';
import Login from './pages/Login';
import { Register } from './pages/Register';
import SolicitarRecuperacion from './pages/SolicitarRecuperacion';
import RestablecerPassword from './pages/RestablecerPassword';
import Cupones from './pages/cliente/Cupones';
import { ProtectedRoute } from './components/ProtectedRoute';
import MisOfertas from './pages/empresa/MisOfertas';
import MisEmpleados from './pages/empresa/MisEmpleados';
import ValidarCupon from './pages/empleado/ValidarCupon';
import GestionEmpresas from './pages/admin/GestionEmpresas';
import GestionOfertas from './pages/admin/GestionOfertas';
import MiPerfil from './pages/cliente/MiPerfil';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* rutas publicas y para clientes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="recuperar-password" element={<SolicitarRecuperacion />} />
          <Route path="reset-password" element={<RestablecerPassword />} />
          <Route path="mis-cupones" element={<Cupones />} />
          <Route path="mi-perfil" element={<MiPerfil />} />
        </Route>

        {/* rutas protegidas por roles */}
        <Route element={<ProtectedRoute allowedRoles={['administrador', 'admin_empresa', 'empleado']} />}>
          <Route element={<DashboardLayout />}>

            {/* panel super admin */}
            <Route element={<ProtectedRoute allowedRoles={['administrador']} />}>
              <Route path="admin" element={<GestionEmpresas />} />
              <Route path="admin/ofertas" element={<GestionOfertas />} />
            </Route>

            {/* panel administracion de empresa */}
            <Route element={<ProtectedRoute allowedRoles={['admin_empresa']} />}>
              <Route path="empresa" element={<MisOfertas />} />
              <Route path="empresa/empleados" element={<MisEmpleados />} />
            </Route>

            {/* panel para empleados canjeadores */}
            <Route element={<ProtectedRoute allowedRoles={['empleado']} />}>
              <Route path="empleado" element={<ValidarCupon />} />
            </Route>

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;