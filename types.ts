
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface Ingredient {
  id: string;
  name: string;
  quantityLabel: string; // e.g., "1 unité", "2 tranches"
  cost: number; // Final calculated cost or manual override
  supplyId?: string; // Link to Stock item
  quantityValue?: number; // Numerical value for dynamic calculation (e.g., 90)
}

export interface SellingPrice {
  label: string;
  price: number;
}

export interface Burger {
  id: string;
  name: string;
  composition: string;
  ingredients: Ingredient[];
  sellingPrices: {
    single: number;
    menu: number;
    student: number;
  };
  imagePlaceholder?: string;
  menuSideId?: string; // Stock item ID for the side (fries)
  menuDrinkId?: string; // Stock item ID for the drink
}

export interface AnalysisResult {
  profitability: string;
  suggestions: string[];
  score: number;
}

export interface SupplyItem {
  id: string;
  name: string;
  packagePrice: number; // Price of the bulk package (HT)
  packageQuantity: number; // Amount in the package
  unitLabel: string; // e.g. "kg", "tranche", "litre"
  supplier: string;
}
