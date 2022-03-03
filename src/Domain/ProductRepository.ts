import { Product } from "./Product";
import { Retail } from "./Retail";

export interface PorductRepository {
    exists(product: Product): boolean;
    save(product: Product): void;
    find(productId: string, retail: Retail): Product | undefined;
}