
import { Burger, SupplyItem } from './types';

export const BURGERS_DATA: Burger[] = [
  {
    id: 'smash',
    name: 'SMASH',
    composition: 'Pain brioché • Deux steaks smashés (2x45g) • Cheddar fondu • Batavia, tomate, pickles, oignons',
    ingredients: [
      { id: '1', name: 'Pain Martins', quantityLabel: '1 unité', cost: 0.53, supplyId: 'pain-martins', quantityValue: 1 },
      { id: '9', name: 'Sauce Smash', quantityLabel: '18ml', cost: 0.068, supplyId: 'sauce-smash-dps', quantityValue: 18 },
      { id: '2', name: 'Viande Smash (Boule)', quantityLabel: '2 boules', cost: 1.035, supplyId: 'steak-vrac', quantityValue: 2 },
      { id: '3', name: 'Cheddar', quantityLabel: '2 tranches', cost: 0.15, supplyId: 'cheddar-tranche', quantityValue: 2 },
      { id: '4', name: 'Compoté d\'oignons', quantityLabel: '15g', cost: 0.053, supplyId: 'oignons-dps', quantityValue: 15 },
      { id: '5', name: 'Sauce barbecue', quantityLabel: '20g', cost: 0.04, supplyId: 'sauce-bbq-dps', quantityValue: 20 },
      { id: '6', name: 'Salade Batavia', quantityLabel: '2 feuilles', cost: 0, supplyId: 'batavia-unite', quantityValue: 2 },
      { id: '7', name: 'Tomate', quantityLabel: '1 tranche (10g)', cost: 0, supplyId: 'tomate-cagette', quantityValue: 10 },
      { id: '8', name: 'Cornichons (Pickles)', quantityLabel: '3 rondelles (10g)', cost: 0, supplyId: 'cornichons-seau', quantityValue: 10 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: 'https://i.ibb.co/pBf6mpnh/Smash.jpg',
    menuSideId: 'frites-portion',
    menuDrinkId: 'coca-33cl'
  },
  {
    id: 'doublecheese',
    name: 'DOUBLECHEESE',
    composition: 'Pain Martins • Double Steak • Double Cheddar • Oignons crus • Cornichons • Ketchup/Moutarde',
    ingredients: [
      { id: '1', name: 'Pain Martins', quantityLabel: '1 unité', cost: 0.53, supplyId: 'pain-martins', quantityValue: 1 },
      { id: '2', name: 'Viande Smash (Boule)', quantityLabel: '2 boules', cost: 1.035, supplyId: 'steak-vrac', quantityValue: 2 },
      { id: '3', name: 'Cheddar', quantityLabel: '2 tranches', cost: 0.15, supplyId: 'cheddar-tranche', quantityValue: 2 },
      { id: '4', name: 'Oignons Crus (Ciselés)', quantityLabel: '10g', cost: 0.02 },
      { id: '5', name: 'Cornichons (Pickles)', quantityLabel: '3 rondelles (10g)', cost: 0, supplyId: 'cornichons-seau', quantityValue: 10 },
      { id: '6', name: 'Ketchup', quantityLabel: '1 trait (10g)', cost: 0.03 },
      { id: '7', name: 'Moutarde Américaine', quantityLabel: '1 trait (5g)', cost: 0.02 },
    ],
    sellingPrices: { single: 6.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: 'https://i.ibb.co/pBf6mpnh/Smash.jpg',
    menuSideId: 'frites-portion',
    menuDrinkId: 'coca-33cl'
  },
  {
    id: 'crunchy',
    name: 'CRUNCHY',
    composition: 'Pain brioché • Poulet frit croustillant • Cheddar • Coleslaw • Sauce Mayo-Spicy',
    ingredients: [
      { id: '1', name: 'Pain Brioché', quantityLabel: '1 unité', cost: 0.55 },
      { id: '2', name: 'Filet Poulet Pané', quantityLabel: '150g', cost: 1.90 },
      { id: '3', name: 'Cheddar', quantityLabel: '1 tranche', cost: 0.08, supplyId: 'cheddar-tranche', quantityValue: 1 },
      { id: '4', name: 'Coleslaw Maison', quantityLabel: 'Portion', cost: 0.35 },
      { id: '5', name: 'Sauce Mayo-Spicy', quantityLabel: 'Portion', cost: 0.15 },
      { id: '6', name: 'Pickles Oignons Rouges', quantityLabel: 'Portion', cost: 0.10 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: '',
    menuSideId: 'frites-portion',
    menuDrinkId: 'coca-33cl'
  },
  {
    id: 'red-smoky',
    name: 'RED SMOKY',
    composition: 'Pain Red Bun • Steak Black Angus • Bacon fumé • Cheddar • Sauce Fumée',
    ingredients: [
      { id: '1', name: 'Red Bun (Paprika)', quantityLabel: '1 unité', cost: 0.70 },
      { id: '2', name: 'Steak Angus', quantityLabel: '150g', cost: 2.10 },
      { id: '3', name: 'Bacon Fumé', quantityLabel: '2 tranches', cost: 0.60 },
      { id: '4', name: 'Cheddar Affiné', quantityLabel: '1 tranche', cost: 0.08, supplyId: 'cheddar-tranche', quantityValue: 1 },
      { id: '5', name: 'Oignons Caramélisés', quantityLabel: 'Portion', cost: 0.20 },
      { id: '6', name: 'Sauce Smoky BBQ', quantityLabel: 'Portion', cost: 0.15, supplyId: 'sauce-bbq-dps', quantityValue: 20 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: '',
    menuSideId: 'frites-portion',
    menuDrinkId: 'coca-33cl'
  },
  {
    id: 'truffle',
    name: 'TRUFFLE',
    composition: 'Pain Brioché • Steak • Gouda à la truffe • Champignons • Sauce Truffe',
    ingredients: [
      { id: '1', name: 'Pain Brioché', quantityLabel: '1 unité', cost: 0.60 },
      { id: '2', name: 'Viande Smash (Boule)', quantityLabel: '150g', cost: 1.725, supplyId: 'steak-vrac', quantityValue: 3.33 },
      { id: '3', name: 'Gouda Truffé', quantityLabel: '1 tranche', cost: 0.80 },
      { id: '4', name: 'Champignons sautés', quantityLabel: 'Portion', cost: 0.40 },
      { id: '5', name: 'Sauce Mayonnaise Truffe', quantityLabel: 'Portion', cost: 0.50 },
      { id: '6', name: 'Roquette', quantityLabel: 'Poignée', cost: 0.20 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: '',
    menuSideId: 'frites-portion',
    menuDrinkId: 'lemonaid-passion'
  },
  {
    id: 'crispy',
    name: 'CRISPY',
    composition: 'Pain Brioché • Galette de Pomme de terre • Steak • Raclette • Oignons frits',
    ingredients: [
      { id: '1', name: 'Pain Brioché', quantityLabel: '1 unité', cost: 0.60 },
      { id: '2', name: 'Viande Smash (Boule)', quantityLabel: '150g', cost: 1.725, supplyId: 'steak-vrac', quantityValue: 3.33 },
      { id: '3', name: 'Rosti Pdt', quantityLabel: '1 unité', cost: 0.45 },
      { id: '4', name: 'Fromage Raclette', quantityLabel: '1 tranche', cost: 0.50 },
      { id: '5', name: 'Oignons Frits', quantityLabel: 'Portion', cost: 0.15 },
      { id: '6', name: 'Sauce Poivre', quantityLabel: 'Portion', cost: 0.15 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: '',
    menuSideId: 'frites-portion',
    menuDrinkId: 'coca-33cl'
  },
  {
    id: 'hot-mango',
    name: 'HOT MANGO',
    composition: 'Pain Brioché • Poulet • Chutney Mangue • Piments Jalapeños • Cheddar',
    ingredients: [
      { id: '1', name: 'Pain Brioché', quantityLabel: '1 unité', cost: 0.60 },
      { id: '2', name: 'Poulet Grillé', quantityLabel: '1 filet', cost: 1.80 },
      { id: '3', name: 'Chutney Mangue', quantityLabel: 'Portion', cost: 0.40 },
      { id: '4', name: 'Jalapeños', quantityLabel: '3 rondelles', cost: 0.15 },
      { id: '5', name: 'Cheddar', quantityLabel: '1 tranche', cost: 0.08, supplyId: 'cheddar-tranche', quantityValue: 1 },
      { id: '6', name: 'Sauce Hot', quantityLabel: 'Portion', cost: 0.15 },
    ],
    sellingPrices: { single: 8.90, menu: 12.90, student: 9.90 },
    imagePlaceholder: '',
    menuSideId: 'frites-portion',
    menuDrinkId: 'oasis-33cl'
  },
];

export const INITIAL_SUPPLIES: SupplyItem[] = [
  { id: 'steak-vrac', name: 'Viande Smash (Boule)', packagePrice: 11.50, packageQuantity: 22.22, unitLabel: 'boule', supplier: 'Boucherie Osmanli' },
  { id: 'cheddar-tranche', name: 'Cheddar en tranches', packagePrice: 6.49, packageQuantity: 88, unitLabel: 'tranche', supplier: 'DPS Market' },
  { id: 'pain-martins', name: "Pain Martin's", packagePrice: 31.99, packageQuantity: 60, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'sauce-smash-dps', name: 'Sauce Smash', packagePrice: 3.39, packageQuantity: 900, unitLabel: 'ml', supplier: 'DPS Market' },
  { id: 'sauce-bbq-dps', name: 'Sauce Barbecue', packagePrice: 9.99, packageQuantity: 5000, unitLabel: 'ml', supplier: 'DPS Market' },
  { id: 'oignons-dps', name: 'Oignons surgelés', packagePrice: 4.99, packageQuantity: 2500, unitLabel: 'g', supplier: 'DPS Market' },
  { id: 'tomate-cagette', name: 'Tomate (Cagette 6kg)', packagePrice: 11.99, packageQuantity: 6000, unitLabel: 'g', supplier: 'DPS Market' },
  { id: 'batavia-unite', name: 'Salade Batavia (60f)', packagePrice: 1.28, packageQuantity: 60, unitLabel: 'feuille', supplier: 'DPS Market' },
  { id: 'cornichons-seau', name: 'Cornichons (Seau 2kg)', packagePrice: 15.39, packageQuantity: 2000, unitLabel: 'g', supplier: 'DPS Market' },
  
  // ACCOMPAGNEMENTS (Portions)
  // 10kg de frites / 275g par portion = ~36.36 portions
  { id: 'frites-portion', name: 'Frites', packagePrice: 22.39, packageQuantity: 36.36, unitLabel: 'portion', supplier: 'DPS Market' },
  { id: 'frites-cheddar', name: 'Frites Cheddar', packagePrice: 15.00, packageQuantity: 16.66, unitLabel: 'portion', supplier: 'DPS Market' },
  { id: 'frites-cheddar-bacon', name: 'Frites Cheddar Bacon', packagePrice: 22.00, packageQuantity: 16.66, unitLabel: 'portion', supplier: 'DPS Market' },
  { id: 'frites-cheddar-oignons', name: 'Frites Cheddar Oignons Frits', packagePrice: 18.00, packageQuantity: 16.66, unitLabel: 'portion', supplier: 'DPS Market' },
  
  // BOISSONS CLASSIQUES (Packs de 24)
  { id: 'coca-33cl', name: 'Coca-Cola (33cl)', packagePrice: 15.99, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'coca-zero-33cl', name: 'Coca Zéro (33cl)', packagePrice: 15.19, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'fuzetea-33cl', name: 'Fuzetea Pêche (33cl)', packagePrice: 12.79, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'oasis-33cl', name: 'Oasis Tropical (33cl)', packagePrice: 13.99, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'hawai-33cl', name: 'Hawai (33cl)', packagePrice: 16.85, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'san-pelle-50cl', name: 'San Pellegrino (50cl)', packagePrice: 12.00, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'capri-sun-20cl', name: 'Capri-Sun (20cl)', packagePrice: 3.59, packageQuantity: 10, unitLabel: 'unité', supplier: 'DPS Market' },
  { id: 'cristalline-50cl', name: 'Cristalline (50cl)', packagePrice: 4.04, packageQuantity: 24, unitLabel: 'unité', supplier: 'DPS Market' },

  // BOISSONS PREMIUM (LEMONAID)
  { id: 'lemonaid-passion', name: 'Lemonaid Passion (33cl)', packagePrice: 17.88, packageQuantity: 12, unitLabel: 'unité', supplier: 'Le Comptoir' },
  { id: 'lemonaid-citron', name: 'Lemonaid Citron Vert (33cl)', packagePrice: 17.88, packageQuantity: 12, unitLabel: 'unité', supplier: 'Le Comptoir' },
  { id: 'lemonaid-orange', name: 'Lemonaid Orange Sanguine (33cl)', packagePrice: 17.88, packageQuantity: 12, unitLabel: 'unité', supplier: 'Le Comptoir' },
  { id: 'charitea', name: 'ChariTea (33cl)', packagePrice: 17.88, packageQuantity: 12, unitLabel: 'unité', supplier: 'Le Comptoir' },
];

export const INITIAL_BURGER = BURGERS_DATA[0];
