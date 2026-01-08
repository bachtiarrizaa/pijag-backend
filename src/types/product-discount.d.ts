export interface ProductDiscount {
  productId: number,
  discountId: number,
  isActive: boolean
}
export interface ProductDiscountCreateRequest {
  productId: number,
  discountId: number,
  isActive: boolean
}
export interface ProductDiscountUpdateRequest {
  productId: number,
  discountId: number,
  // isActive: boolean
}