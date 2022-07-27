import { FanoutBroker } from '../Domain/Broker';
import { Event } from '../Domain/Event';
import { Product } from '../Domain/Product';
import { ProductHandler } from '../Domain/ProductHandler';

export class ProductStoredSubscriber {
  constructor(private broker: FanoutBroker, private productHandler: ProductHandler) {}

  async subscribe() {
    await this.broker.subscribe<Product>(Event.ProductStored, async (product) => {
      await this.productHandler.handle(product);
    });
  }
}
