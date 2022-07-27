import { Product } from './Product';

export interface Notifier {
  notify(product: Product): Promise<void>;
}
