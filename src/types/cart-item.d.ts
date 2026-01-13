import { Decimal } from "@prisma/client/runtime/library";

export interface CartItem {
  cartId: number,
  productId: number,
  quantity: number,
  price: Decimal,
  subtotal: Decimal
}

export interface CartItemCreateRequest {
  cartId: number,
  productId: number,
  quantity: number,
  price: Decimal,
  subtotal: Decimal
}

export interface CartItemUpdateQuantity {
  quantity: number,
  price: Decimal,
  subtotal: Decimal
}

export interface CartItemUpdateRequest {
  price: Decimal,
  subtotal: Decimal
}