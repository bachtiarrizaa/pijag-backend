import { Review } from "@prisma/client";

export interface ReviewCreateRequest {
  productId: number;
  rating: number;
  comment?: string | null;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment: string;
}

