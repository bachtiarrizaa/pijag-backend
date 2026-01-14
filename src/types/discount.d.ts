export type DiscountType = "percent" | "fixed";

export interface Discount {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date,
  endDate?: Date,
  isActive: boolean
}

export interface DiscountCreateRequest {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date,
  endDate?: Date,
  isActive: boolean
}

export interface DiscountUpdateRequest {
  name: string,
  description: string,
  type: DiscountType,
  value: number,
  startDate?: Date,
  endDate?: Date,
  isActive: boolean
}