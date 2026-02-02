
import { Burger, SupplyItem } from '../types';

const STORAGE_PREFIX = 'smash_data_';

export const saveBurgers = async (userId: string, burgers: Burger[]) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}_burgers`, JSON.stringify(burgers));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loadBurgers = async (userId: string): Promise<Burger[] | null> => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${userId}_burgers`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const saveSupplies = async (userId: string, supplies: SupplyItem[]) => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${userId}_supplies`, JSON.stringify(supplies));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loadSupplies = async (userId: string): Promise<SupplyItem[] | null> => {
  try {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${userId}_supplies`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};
