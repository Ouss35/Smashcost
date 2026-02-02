import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { User } from '../types';

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user: User = {
      uid: result.user.uid,
      email: result.user.email || email,
      displayName: result.user.displayName || email.split('@')[0]
    };
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user: User = {
      uid: result.user.uid,
      email: result.user.email || email,
      displayName: result.user.displayName || email.split('@')[0]
    };
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || ''
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};
