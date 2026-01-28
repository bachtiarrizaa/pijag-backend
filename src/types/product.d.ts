import { Decimal } from "@prisma/client/runtime/library";

export interface Product {
    categoryId: number;
    name: string;
    description: string;
    price: Decimal;
    stock: number;
    image: string;
}
export interface ProductCreateRequest {
    categoryId: number;
    name: string;
    description: string;
    price: Decimal;
    stock: number;
    image: string;
}
export interface ProductUpdateRequest {
    categoryId: number;
    name: string;
    description: string;
    price: Decimal;
    stock: number;
    image: string;
}