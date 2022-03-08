import { Product } from "./Product";

export interface ProductHandler {
    handle(product: Product): Promise<void>;
}