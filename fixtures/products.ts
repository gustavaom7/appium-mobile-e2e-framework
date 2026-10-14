/** Catalog shipped with the app (src/data/inventoryData.ts): colors in display order, plus the preselected one. */
export const PRODUCTS = [
  { id: 1, name: 'Sauce Labs Backpack', price: 29.99, colors: ['black', 'blue', 'gray', 'red'], defaultColor: 'black' },
  { id: 2, name: 'Sauce Labs Bike Light', price: 9.99, colors: ['black'], defaultColor: 'black' },
  { id: 3, name: 'Sauce Labs Bolt T-Shirt', price: 15.99, colors: ['black'], defaultColor: 'black' },
  { id: 4, name: 'Sauce Labs Fleece Jacket', price: 49.99, colors: ['gray'], defaultColor: 'gray' },
  { id: 5, name: 'Sauce Labs Onesie', price: 7.99, colors: ['black', 'gray', 'red'], defaultColor: 'red' },
  { id: 6, name: 'Test.allTheThings() T-Shirt', price: 15.99, colors: ['black', 'gray', 'red'], defaultColor: 'red' },
] as const;

export type ProductColor = 'black' | 'blue' | 'gray' | 'red';

/** Sort options of the catalog's sort modal; the value is the option's accessibility id (src/utils/Sorting.ts). */
export type SortOption = 'nameAsc' | 'nameDesc' | 'priceAsc' | 'priceDesc';
