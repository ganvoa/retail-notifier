import { Notifier } from "../Domain/Notifier";
import { Paginator } from "../Domain/Paginator";
import { ProductParser } from "../Domain/ProductParser";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";

export class GetProductsByApartment {
    constructor(
        private pageFetcher: RetailPageFetcher,
        private productParser: ProductParser,
        private paginator: Paginator,
        private notifier: Notifier
    ) { }

    async start() {

        try {
            let currentProductsFound = 0;
            let totalProductsFound = 0;
            do {
                const page = await this.pageFetcher.getPage(this.paginator.limit, this.paginator.getOffset());
                const products = this.productParser.getAll(page);
                currentProductsFound = products.length;
                totalProductsFound += products.length;
                products.forEach(async product => {
                    if (product.discountPercentage >= 50) {
                        try {
                            // await this.notifier.notify(product);
                            console.log(`${product.productId};${product.minPrice};${product.discountPercentage};${product.productUrl}`)
                        } catch (e: any) {
                            console.error(e.message);
                        }
                    }
                });
            } while (this.paginator.next() && currentProductsFound > 0);
            console.log(`total products found: ${totalProductsFound}`);
        } catch (e) {
            console.error(e);
        }
    }
}