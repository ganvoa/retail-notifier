import { Notifier } from "../Domain/Notifier";
import { Product } from "../Domain/Product";
import { ProductHandler } from "../Domain/ProductHandler";

export class ProductNotifier implements ProductHandler {
    constructor(
        private notifier: Notifier
    ) { }

    async handle(product: Product): Promise<void> {
        if (product.shouldNotify) {
            console.log(`product notifying: ${product.retailId};${product.name};${product.productUrl}`);
            await this.notifier.notify(product);
        }
        return Promise.resolve();
    }
}