import config from "../../app/config";
import { FanoutBroker } from "../Domain/Broker";
import { Event } from "../Domain/Event";
import { Product } from "../Domain/Product";
import { ProductHandler } from "../Domain/ProductHandler";
import { ProductRepository } from "../Domain/ProductRepository";

export class ProductPersister implements ProductHandler {
    constructor(
        private broker: FanoutBroker,
        private repository: ProductRepository
    ) { }

    async handle(product: Product) {

        if (product.productUrl == undefined) {
            console.log(`product without url: ${product.retailId}`);
            return Promise.resolve();
        }

        const productAlreadyExists = await this.repository.find(product.productId, product.retailId, product.minPrice);
        if (productAlreadyExists == undefined && product.shouldStore) {
            console.log(`storing product: ${product.discountPercentage};${product.shouldNotify};${product.retailId};${product.name};${product.productUrl}`);
            await this.repository.save(product);
            await this.broker.publish<Product>(Event.ProductStored, product);
        }
        return Promise.resolve();
    }
}