import { Product } from "../Domain/Product";
import { ProductRepository } from "../Domain/ProductRepository";
import { Retail } from "../Domain/Retail";
import { Client } from '@elastic/elasticsearch'

export class ElasticsearchProductRepository implements ProductRepository {

    private client: Client;

    constructor(private index: string, host: string) {
        this.client = new Client({ node: host });
    }

    async save(product: Product): Promise<void> {
        await this.client.index({
            index: this.index,
            document: product,
            id: `${product.retailId}-${product.productId}-${product.minPrice}`
        });
        return Promise.resolve();
    }

    async find(productId: string, retail: Retail, minPrice: number): Promise<Product | undefined> {
        try {
            const result = await this.client.get<Product>({
                index: this.index,
                id: `${retail}-${productId}-${minPrice}`
            });

            if (result.found) {
                return Promise.resolve(result._source as Product)
            } else {
                return Promise.resolve(undefined)
            }
        } catch (error) {
            return Promise.resolve(undefined)
        }
    }

}