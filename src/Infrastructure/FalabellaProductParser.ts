import { Department } from "../Domain/Department";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";
import { Retail } from "../Domain/Retail";
import { cleanString } from "./Helper";

export class FalabellaProductParser implements ProductParser {

    constructor(private department: Department) { }

    getAll(content: string): Product[] {
        const products: Product[] = [];
        const json = JSON.parse(JSON.stringify(content, null, 8));

        for (const obj of json.data.results) {

            let currentPrice = 0;
            let normalPrice = 0;
            let exclusivePrice = 0;

            for (const price of obj.prices) {
                if (price.type == "normalPrice") {
                    normalPrice = parseInt(price.price[0].replace('.', ''));
                } else if (price.type == "internetPrice" || price.type == "eventPrice") {
                    currentPrice = parseInt(price.price[0].replace('.', ''));
                } else if (price.type == "cmrPrice") {
                    exclusivePrice = parseInt(price.price[0].replace('.', ''));
                }
            }

            if (exclusivePrice == 0) {
                exclusivePrice = currentPrice;
            }

            if (normalPrice == 0) {
                normalPrice = currentPrice;
            }

            const minPrice = Math.min(currentPrice, normalPrice, exclusivePrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);
            products.push(
                {
                    retailId: Retail.Falabella,
                    productId: obj.productId,
                    name: cleanString(obj.displayName.trim()),
                    imageUrl: obj.mediaUrls ? obj.mediaUrls[0] : undefined,
                    brand: cleanString(obj.brand ? obj.brand.trim() : '-'),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: obj.url,
                    valid: true,
                    department: this.department,
                    timestamp: Date.now()
                }
            );
        }

        return products;
    }

}