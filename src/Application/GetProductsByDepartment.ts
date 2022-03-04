import { Notifier } from "../Domain/Notifier";
import { Paginator } from "../Domain/Paginator";
import { ProductParser } from "../Domain/ProductParser";
import { PorductRepository } from "../Domain/ProductRepository";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";

export class GetProductsByDepartment {
    constructor(
        private discount: number,
        private pageFetcher: RetailPageFetcher,
        private productParser: ProductParser,
        private paginator: Paginator,
        private repository: PorductRepository,
        private notifier?: Notifier
    ) { }

    async start() {

        try {
            let currentProductsFound = 0;
            let totalProductsFound = 0;
            do {
                const page = await this.pageFetcher.getPage(
                    this.paginator.limit,
                    this.paginator.getOffset(),
                    this.paginator.getPage()
                );
                const products = this.productParser.getAll(page);
                currentProductsFound = products.length;
                totalProductsFound += products.length;
                console.log(`page ${this.paginator.getPage()}: ${currentProductsFound} products`);

                for (const product of products) {
                    if (product.valid && product.discountPercentage >= this.discount) {
                        try {
                            const productAlreadyExists = await this.repository.find(product.productId, product.retailId, product.minPrice);
                            if (productAlreadyExists === undefined) {
                                if (this.notifier) {
                                    await this.notifier.notify(product);
                                }
                                console.log(`${product.retailId};${product.department};${product.productId};${product.minPrice};${product.discountPercentage};${product.productUrl}`);
                                await this.repository.save(product);
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            } while (this.paginator.next() && currentProductsFound > 0 && this.paginator.getNumberOfPages() >= this.paginator.getPage());
            console.log(`total products found: ${totalProductsFound}`);
        } catch (e) {
            console.error(e);
        }
    }
}