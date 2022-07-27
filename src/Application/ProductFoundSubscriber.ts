import { DirectBroker } from '../Domain/Broker';
import { Event } from '../Domain/Event';
import { Product } from '../Domain/Product';
import { ProductHandler } from '../Domain/ProductHandler';

export class ProductFoundSubscriber {
  constructor(private broker: DirectBroker, private productHandler: ProductHandler) {}

  async subscribe() {
    await this.broker.subscribe<Product>(Event.ProductFound, async (product) => {
      await this.productHandler.handle(product);
    });
  }
}
