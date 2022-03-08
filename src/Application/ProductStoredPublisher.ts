import { FanoutBroker } from "../Domain/Broker";
import { Event } from "../Domain/Event";
import { Product } from "../Domain/Product";

export class ProductStoredPublisher {
    constructor(
        private broker: FanoutBroker
    ) { }

    async publish(product: Product) {
        await this.broker.publish<Product>(Event.ProductStored, product);
    }
}