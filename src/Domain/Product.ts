export type Product = {
    productId: string,
    name: string,
    imageUrl?: string,
    brand: string,
    normalPrice: number,
    currentPrice: number,
    exclusivePrice: number,
    minPrice: number,
    discountPercentage: number,
    productUrl?: string
}