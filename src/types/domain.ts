export interface GroceryItem {
  id: string;
  isChecked: boolean;
  name: string;
  quantity: number;
  unit?: string;
}

export interface GroceryList {
  id: string;
  items: GroceryItem[];
  name: string;
}
