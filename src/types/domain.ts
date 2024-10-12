export interface GroceryItem {
  id: number;
  name: string;
}

export interface GroceryList {
  id: number;
  items: GroceryItem[];
}
