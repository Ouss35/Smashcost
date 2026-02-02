import { User } from '../types';

const STORAGE_KEY = 'smash_eats_user';

let authListener: ((user: User | null) => void) | null = null;

const notifyAuthChange = (user: User | null) => {
  if (authListener) {
    authListener(user);
  }
};

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  // Mock signup - simulate success
  const user: User = { 
    uid: `user-${Date.now()}`, 
    email,
    displayName: email.split('@')[0]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange(user);
  return { success: true, user };
};

export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  // Mock signin - simulate success
  const user: User = { 
    uid: 'user-demo-123', 
    email,
    displayName: email.split('@')[0]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notifyAuthChange(user);
  return { success: true, user };
};

export const logOut = async () => {
  localStorage.removeItem(STORAGE_KEY);
  notifyAuthChange(null);
  return { success: true };
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  authListener = callback;
  
  // Check initial state
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const user = JSON.parse(stored);
      setTimeout(() => callback(user), 0);
    } catch (e) {
      setTimeout(() => callback(null), 0);
    }
  } else {
    setTimeout(() => callback(null), 0);
  }

  return () => {
    authListener = null;
  };
};