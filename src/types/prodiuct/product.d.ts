export interface CreateProduct {
  category_id: number;
  name: string;
  description: string;
  price: string;
  stock: string;
  image: string;
}

export type UpdateProduct = Partial<CreateProduct>