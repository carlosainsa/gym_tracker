import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';

// Esta función crea un usuario administrador predeterminado
// Solo debe ejecutarse una vez durante la configuración inicial
export const createAdminUser = async () => {
  try {
    // Credenciales del administrador
    const email = 'carlos.ainsa@gmail.com';
    const password = 'Admin123!';
    const displayName = 'Carlos Ainsa';

    // Crear el usuario
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Actualizar el perfil con el nombre
    await updateProfile(userCredential.user, {
      displayName: displayName
    });

    console.log('Usuario administrador creado exitosamente:', userCredential.user);
    return userCredential.user;
  } catch (error) {
    // Si el usuario ya existe, no es un error crítico
    if (error.code === 'auth/email-already-in-use') {
      console.log('El usuario administrador ya existe. Intentando iniciar sesión...');
      try {
        // Intentar iniciar sesión con las credenciales
        const userCredential = await signInWithEmailAndPassword(auth, adminCredentials.email, adminCredentials.password);
        console.log('Inicio de sesión exitoso:', userCredential.user);
        return userCredential.user;
      } catch (loginError) {
        console.error('Error al iniciar sesión con el usuario administrador:', loginError);
        return null;
      }
    }

    console.error('Error al crear usuario administrador:', error);
    throw error;
  }
};

// Exportar las credenciales para referencia
export const adminCredentials = {
  email: 'carlos.ainsa@gmail.com',
  password: 'Admin123!'
};
