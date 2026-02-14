import { Metadata, PaginationQuery } from "../types/pagination";

export class PaginateUtils {
  static parse(query: PaginationQuery) {
    const result: PaginationQuery = {};

    if (typeof query !== "object" || query === null) {
      return result;
    }

    const q = query as Record<string, unknown>;

    if (typeof q.page === "string") {
      const page = Number(q.page);
      if (!Number.isNaN(page)) {
        result.page = page;
      }
    }

    if (typeof q.limit === "string") {
      const limit = Number(q.limit);
      if (!Number.isNaN(limit)) {
        result.limit = limit;
      }
    }

    return result;
  }

  static paginate(query: PaginationQuery) {
    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? Math.min(query.limit, 100) : 10;

    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  static buildMeta(meta: Metadata) {
    const totalPages = Math.ceil(meta.totalItems / meta.itemsPerPage);

    return {
      totalItems: meta.totalItems,
      itemCount: meta.itemCount,
      itemsPerPage: meta.itemsPerPage,
      totalPages,
      currentPage: meta.currentPage,
      hasNextPage: meta.currentPage < totalPages,
      hasPreviousPage: meta.currentPage > 1,
    };
  }
}
