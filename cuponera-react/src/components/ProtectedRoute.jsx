import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // si ni siquiera ha iniciado sesion lo mandamos al login al suave
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.roles?.[0]?.name;

  // si su rol no es de los permitidos, lo regresamos al inicio
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};