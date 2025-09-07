import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('token');

  return isLoggedIn ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;