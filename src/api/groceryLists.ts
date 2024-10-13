import { config } from "src/config";
import {
  JsonServerPaginationResult,
  PaginationParams,
  PaginationResult,
} from "src/types/common";
import { GroceryList } from "src/types/domain";

interface GetGroceryListParams {
  id: string;
}

export const createGroceryList = async (
  params: GroceryList,
): Promise<GroceryList> => {
  const response = await fetch(`${config.apiUrl}/grocery-lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return response.json();
};

export const getGroceryList = async ({
  id,
}: GetGroceryListParams): Promise<GroceryList> => {
  const response = await fetch(`${config.apiUrl}/grocery-lists/${id}`);
  return response.json();
};

export const getGroceryLists = async ({
  limit,
  offset = 0,
}: PaginationParams): Promise<PaginationResult<GroceryList>> => {
  const page = offset / limit + 1;
  const params = `_page=${page}&_per_page=${limit}&_sort=-number`;
  const response = await fetch(`${config.apiUrl}/grocery-lists?${params}`);
  const result: JsonServerPaginationResult<GroceryList> = await response.json();
  return {
    data: result.data,
    limit,
    offset: limit * (result.prev || 0),
    total: result.items,
  };
};
