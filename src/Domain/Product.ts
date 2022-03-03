import { Apartment } from "./Apartment";

export type Product = {
    retailId: string,
    productId: string,
    name: string,
    imageUrl?: string,
    brand: string,
    normalPrice: number,
    currentPrice: number,
    exclusivePrice: number,
    minPrice: number,
    discountPercentage: number,
    productUrl?: string,
    valid: boolean,
    apartment: Apartment
}