export interface PaginationParams {
  limit: number;
  offset?: number;
}

export interface PaginationResult<T> extends PaginationParams {
  data: T[];
  total: number;
}

export interface JsonServerPaginationParams {
  _page: number;
  _per_page: number;
}

export interface JsonServerPaginationResult<T> {
  data: T[];
  first: number;
  items: number;
  last: number;
  next: null | number;
  pages: number;
  prev: null | number;
}
