import { Product } from './Product';
import { Retail } from './Retail';

export interface ProductRepository {
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  find(productId: string, retail: Retail, minPrice: number): Promise<Product | undefined>;
}
