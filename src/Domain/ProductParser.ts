import { Product } from "./Product";

export interface ProductParser {
    getAll(content: string): Product[]
}