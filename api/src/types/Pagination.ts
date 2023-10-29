export type Sort = "ASC" | "DESC";

export type Pagination = {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  search?: string;
  date?: string;
};
