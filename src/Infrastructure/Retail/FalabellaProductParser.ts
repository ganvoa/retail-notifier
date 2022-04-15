import { Product } from "../../Domain/Product";
import { ProductParser } from "../../Domain/ProductParser";
import { Retail } from "../../Domain/Retail";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { cleanString } from "../Helper";

export class FalabellaProductParser implements ProductParser {

    constructor(private department: RetailDepartment) { }

    getAll(content: string): Product[] {
        const products: Product[] = [];
        const json = JSON.parse(JSON.stringify(content, null, 8));

        if (json === '') {
            return products;
        }

        for (const obj of json.data.results) {

            let currentPrice = 0;
            let normalPrice = 0;
            let exclusivePrice = 0;

            for (const price of obj.prices) {
                if (price.type == "normalPrice") {
                    normalPrice = parseInt(price.price[0].replace(/\./g, ""));
                } else if (price.type == "internetPrice" || price.type == "eventPrice") {
                    currentPrice = parseInt(price.price[0].replace(/\./g, ""));
                } else if (price.type == "cmrPrice") {
                    exclusivePrice = parseInt(price.price[0].replace(/\./g, ""));
                }
            }

            if (exclusivePrice == 0) {
                exclusivePrice = currentPrice;
            }

            if (normalPrice == 0) {
                normalPrice = currentPrice;
            }

            if (exclusivePrice == 0) {
                exclusivePrice = normalPrice;
            }

            if (currentPrice == 0) {
                currentPrice = normalPrice;
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
                    department: this.department.department,
                    timestamp: Date.now(),
                    valid: minPrice > 0,
                    shouldStore: discountPercentage >= 50,
                    shouldNotify: false,
                }
            );
        }

        return products;
    }

}