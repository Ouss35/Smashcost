import { db, storage } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Burger, SupplyItem } from '../types';

// Sauvegarder les burgers
export const saveBurgers = async (userId: string, burgers: Burger[]) => {
  try {
    await setDoc(doc(db, 'users', userId), { burgers }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Erreur sauvegarde burgers:', error);
    return { success: false, error: error.message };
  }
};

// Charger les burgers
export const loadBurgers = async (userId: string): Promise<Burger[] | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data().burgers || null;
    }
    return null;
  } catch (error) {
    console.error('Erreur chargement burgers:', error);
    return null;
  }
};

// Sauvegarder le stock
export const saveSupplies = async (userId: string, supplies: SupplyItem[]) => {
  try {
    await setDoc(doc(db, 'users', userId), { supplies }, { merge: true });
    return { success: true };
  } catch (error: any) {
    console.error('Erreur sauvegarde stock:', error);
    return { success: false, error: error.message };
  }
};

// Charger le stock
export const loadSupplies = async (userId: string): Promise<SupplyItem[] | null> => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return docSnap.data().supplies || null;
    }
    return null;
  } catch (error) {
    console.error('Erreur chargement stock:', error);
    return null;
  }
};

// Uploader une photo de burger
export const uploadBurgerImage = async (userId: string, burgerId: string, file: File): Promise<string | null> => {
  try {
    const storageRef = ref(storage, `users/${userId}/burgers/${burgerId}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Erreur upload image:', error);
    return null;
  }
};
