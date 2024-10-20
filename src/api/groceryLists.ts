import { config } from "src/config";
import {
  JsonServerPaginationResult,
  PaginationParams,
  PaginationResult,
} from "src/types/common";
import { GroceryList } from "src/types/domain";
import { validateResponse } from "src/utils/api";

interface DeleteGroceryListParams {
  id: string;
}

interface GetGroceryListParams {
  id: string;
}

interface UpdateGroceryListParams {
  id: string;
  update: Partial<Omit<GroceryList, "id">>;
}

// TODO: add response type
export const deleteGroceryList = async ({ id }: DeleteGroceryListParams) => {
  const response = await fetch(`${config.apiUrl}/grocery-lists/${id}`, {
    method: "DELETE",
  });
  return response.json();
};

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

export const updateGroceryList = async (
  params: UpdateGroceryListParams,
): Promise<GroceryList> => {
  const response = await fetch(`${config.apiUrl}/grocery-lists/${params.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params.update),
  });

  await validateResponse(response);

  return response.json();
};
