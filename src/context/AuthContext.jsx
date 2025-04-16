import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para registrar un nuevo usuario
  const signup = async (email, password, displayName) => {
    try {
      setError('');
      console.log('Intentando crear usuario con:', { email, password });
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario creado exitosamente:', userCredential.user);

      // Actualizar el perfil del usuario con el nombre
      if (displayName) {
        console.log('Actualizando perfil con nombre:', displayName);
        await updateProfile(userCredential.user, {
          displayName: displayName
        });
        console.log('Perfil actualizado exitosamente');
      }

      return userCredential.user;
    } catch (error) {
      console.error('Error en signup:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Función para iniciar sesión con Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      console.log('Intentando iniciar sesión con Google');
      const provider = new GoogleAuthProvider();
      // Añadir configuraciones adicionales al proveedor
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, provider);
      console.log('Inicio de sesión con Google exitoso:', result.user);
      return result.user;
    } catch (error) {
      console.error('Error en loginWithGoogle:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje de error:', error.message);
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setError('');
      await signOut(auth);
    } catch (error) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Función para restablecer la contraseña
  const resetPassword = async (email) => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(getErrorMessage(error.code));
      throw error;
    }
  };

  // Función para obtener mensajes de error legibles
  const getErrorMessage = (errorCode) => {
    console.log('Obteniendo mensaje para el código de error:', errorCode);
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este correo electrónico ya está en uso.';
      case 'auth/invalid-email':
        return 'El correo electrónico no es válido.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
      case 'auth/user-not-found':
        return 'No existe un usuario con este correo electrónico.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Inténtalo más tarde.';
      case 'auth/popup-closed-by-user':
        return 'Inicio de sesión cancelado.';
      case 'auth/operation-not-allowed':
        return 'La operación no está permitida. Contacta al administrador.';
      case 'auth/account-exists-with-different-credential':
        return 'Ya existe una cuenta con este correo electrónico pero con diferentes credenciales.';
      case 'auth/network-request-failed':
        return 'Error de red. Verifica tu conexión a internet.';
      case 'auth/invalid-credential':
        return 'Credencial inválida. Inténtalo de nuevo.';
      case 'auth/internal-error':
        return 'Error interno de autenticación. Inténtalo de nuevo más tarde.';
      default:
        return `Ocurrió un error (${errorCode}). Por favor, inténtalo de nuevo.`;
    }
  };

  // Efecto para escuchar cambios en el estado de autenticación
  useEffect(() => {
    // Suscripción real a Firebase Auth
    console.log('Configurando listener de autenticación de Firebase');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Estado de autenticación cambiado:', user ? `Usuario autenticado: ${user.email}` : 'No hay usuario autenticado');
      setCurrentUser(user);
      setLoading(false);
    });

    // Función de limpieza para desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Valor del contexto
  const value = {
    currentUser,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
