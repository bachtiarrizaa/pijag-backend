export type DiscountType = "percent" | "fixed";

export interface Discount {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date | null,
  endDate?: Date | null,
  isActive: boolean
}

export interface DiscountCreateRequest {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date | null,
  endDate?: Date | null,
  isActive: boolean
}

export interface DiscountUpdateRequest {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date | null,
  endDate?: Date | null,
  isActive: boolean
}