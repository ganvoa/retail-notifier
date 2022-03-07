import { Broker } from "../Domain/Broker";
import { Product } from "../Domain/Product";

export class ProductFoundSubscriber {
    constructor(
        private exchange: Broker
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