import { resolvePtr } from "dns";
import { Exchange } from "../Domain/Exchange";
import { Product } from "../Domain/Product";

export class MessageSubscriber {
    constructor(
        private exchange: Exchange
    ) { }

    subscribe() {
        let counter = 0;
        this.exchange.subscribe<Product>(async product => {
            counter++;
            console.log(`${counter} - product received: ${product.imageUrl ? 'true' : 'false'};${product.minPrice};${product.discountPercentage};${product.brand};${product.name};`);
            return Promise.resolve();
        });
    }
}