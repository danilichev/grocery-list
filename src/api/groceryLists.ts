interface GetGroceryListParams {
  id: number;
}

export const getGroceryList = async ({ id }: GetGroceryListParams) => {
  console.log("getGroceryList", id);
  return [];
};
