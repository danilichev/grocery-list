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
  const params = `_page=${offset / limit + 1}&_per_page=${limit}`;
  const response = await fetch(`${config.apiUrl}/grocery-lists?${params}`);
  const result: JsonServerPaginationResult<GroceryList> = await response.json();
  return {
    data: result.data,
    limit,
    offset: limit * (result.prev || 0),
    total: result.items,
  };
};
