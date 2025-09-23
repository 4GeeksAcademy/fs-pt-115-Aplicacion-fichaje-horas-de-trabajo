import { Navigate, Outlet } from 'react-router-dom';
import { isTokenExpired } from '../services/comprobarToken';

const ProtectedRoutes = () => {
  const token = localStorage.getItem('token');

  const user = !!token && !isTokenExpired(token);

  if (!user) {
    localStorage.removeItem('token');
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;