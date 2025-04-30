import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/models';

export class AuthService {
  private auth = getAuth();
  private googleProvider = new GoogleAuthProvider();

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const userData = await this.getUserData(userCredential.user.uid);
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const userData = await this.getUserData(result.user.uid);
      if (!userData) {
        // Si es la primera vez que el usuario inicia sesión con Google
        const newUser: User = {
          id: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Usuario',
          preferences: {
            darkMode: false,
            language: 'es',
            units: 'metric'
          }
        };
        await this.saveUserData(newUser);
        return newUser;
      }
      return userData;
    } catch (error: any) {
      console.error('Google login error:', error);
      throw this.handleAuthError(error);
    }
  }

  private handleAuthError(error: any): Error {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde.'
    };

    return new Error(errorMessages[error.code] || 'Error de autenticación.');
  }

  async register(email: string, password: string, displayName: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        displayName,
        preferences: {
          darkMode: false,
          language: 'es',
          units: 'metric'
        }
      };
      await this.saveUserData(newUser);
      return newUser;
    } catch (error) {
      throw new Error('Error al registrar usuario');
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  private async getUserData(uid: string): Promise<User> {
    // Implementar lógica para obtener datos del usuario de Firestore
    throw new Error('No implementado');
  }

  private async saveUserData(user: User): Promise<void> {
    // Implementar lógica para guardar datos del usuario en Firestore
    throw new Error('No implementado');
  }
}

export const authService = new AuthService();
