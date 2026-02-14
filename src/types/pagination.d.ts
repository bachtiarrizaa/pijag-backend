export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface Metadata {
  totalItems: number,
  currentPage: number,
  itemsPerPage: number,
  itemCount: number
}