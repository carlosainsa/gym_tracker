import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase
// Credenciales del proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrjiBuZe172_vN0qOQD-0-6poonDdMLjU",
  authDomain: "gym-tracker-f2321.firebaseapp.com",
  projectId: "gym-tracker-f2321",
  storageBucket: "gym-tracker-f2321.firebasestorage.app",
  messagingSenderId: "166633406018",
  appId: "1:166633406018:web:038b18b0674b68539837db",
  measurementId: "G-6428TPHGEB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Inicializar Analytics - solo en entorno de producción (no en localhost)
let analytics = null;
if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
