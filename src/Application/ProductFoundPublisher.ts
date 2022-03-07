import { Broker } from "../Domain/Broker";
import { Product } from "../Domain/Product";

export class ProductFoundPublisher {
    constructor(
        private exchange: Broker
    ) { }

    async publish(product: Product) {
        await this.exchange.publish(product);
    }
}