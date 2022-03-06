import { Exchange } from "../Domain/Exchange";
import { Product } from "../Domain/Product";

export class MessagePublisher {
    constructor(
        private exchange: Exchange
    ) { }

    async publish(product: Product) {
        await this.exchange.publish(product);
    }
}