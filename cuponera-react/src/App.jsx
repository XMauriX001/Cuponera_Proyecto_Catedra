import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/cliente/Home';
import Login from './pages/Login';
import { Register } from './pages/Register';
import Cupones from './pages/cliente/Cupones';
import { ProtectedRoute } from './components/ProtectedRoute';
import MisOfertas from './pages/empresa/MisOfertas';
import MisEmpleados from './pages/empresa/MisEmpleados';
import ValidarCupon from './pages/empleado/ValidarCupon';
import GestionEmpresas from './pages/admin/GestionEmpresas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* rutas publicas y de clientes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="mis-cupones" element={<Cupones />} />
        </Route>

        {/* rutas protegidas para administracion */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'empresa', 'empleado']} />}>
          <Route element={<DashboardLayout />}>
            
            {/* panel de administrador general */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="admin" element={<GestionEmpresas />} />
            </Route>

            {/* panel de empresa */}
            <Route element={<ProtectedRoute allowedRoles={['empresa']} />}>
              <Route path="empresa" element={<MisOfertas />} />
              <Route path="empresa/empleados" element={<MisEmpleados />} />
            </Route>

            {/* panel de empleado */}
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