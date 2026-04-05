import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = ({ allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Si no hay token, no ha iniciado sesión, mándalo al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const userRole = user?.roles?.[0]?.name;

    if (!allowedRoles.includes(userRole)) {
        // Si el rol no está en la lista permitida, se manda al Home de clientes
        return <Navigate to="/" replace />;
    }

    // Si todo está bien, pasa a la página
    return <Outlet />;
};