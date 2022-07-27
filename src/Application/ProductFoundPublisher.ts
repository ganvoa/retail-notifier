import { DirectBroker } from '../Domain/Broker';
import { Event } from '../Domain/Event';
import { Product } from '../Domain/Product';

export class ProductFoundPublisher {
  constructor(private broker: DirectBroker) {}

  async publish(product: Product) {
    await this.broker.publish(Event.ProductFound, product);
  }
}
