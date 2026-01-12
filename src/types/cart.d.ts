export interface Cart {
  productId: number;
  quantity: number;
}

export interface CartCreateRequest {
  productId: number;
  quantity: number;
}

export interface CartUpdateRequest {
  // productId: number;
  quantity: number;
}