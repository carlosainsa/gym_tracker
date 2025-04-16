import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  // AUTENTICACIÓN TEMPORALMENTE DESACTIVADA
  // const { currentUser } = useAuth();

  // Simulamos un usuario autenticado
  const currentUser = { uid: 'temp-user-id', email: 'usuario@temporal.com', displayName: 'Usuario Temporal' };

  // Comentado temporalmente para permitir acceso sin autenticación
  // if (!currentUser) {
  //   console.log('Usuario no autenticado, redirigiendo a /login');
  //   return <Navigate to="/login" />;
  // }

  console.log('Autenticación desactivada temporalmente - Permitiendo acceso');
  return children;
};

export default PrivateRoute;
