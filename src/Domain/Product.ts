import { Department } from "./Department";
import { Retail } from "./Retail";

export type Product = {
    retailId: Retail,
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
    shouldStore: boolean,
    shouldNotify: boolean,
    department: Department,
    timestamp: number
}