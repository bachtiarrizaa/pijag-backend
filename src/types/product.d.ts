export interface Product {
    categoryId: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
}
export interface ProductCreateRequest {
    categoryId: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
}
export interface ProductUpdateRequest {
    categoryId: number;
    name: string;
    description: string;
    price: string;
    stock: number;
    image: string;
}