import { Department } from "../Domain/Department";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";
import { Retail } from "../Domain/Retail";
import { cleanString } from "./Helper";

export class RipleyProductParser implements ProductParser {

    constructor(private department: Department) { }

    getAll(content: string): Product[] {
        const products: Product[] = [];

        const itemData = content.match(/__PRELOADED_STATE__ = ([\w\W]+?)</);
        if (null == itemData) {
            return products;
        }
        const jsonData = itemData[1].trim().slice(0, -1)
        const json = JSON.parse(jsonData);
        for (const obj of json.products) {

            const normalPrice = obj.prices.hasOwnProperty('listPrice') ? parseInt(obj.prices.listPrice) : 0;
            const currentPrice = obj.prices.hasOwnProperty('offerPrice') ? parseInt(obj.prices.offerPrice) : normalPrice;
            const exclusivePrice = obj.prices.hasOwnProperty('cardPrice') ? parseInt(obj.prices.cardPrice) : normalPrice;
            const minPrice = Math.min(currentPrice, normalPrice, exclusivePrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);

            products.push(
                {
                    retailId: Retail.Ripley,
                    productId: obj.uniqueID,
                    name: cleanString(obj.name.trim()),
                    imageUrl: obj.thumbnail ? "https://" + obj.thumbnail : undefined,
                    brand: cleanString(obj.manufacturer ? obj.manufacturer.trim() : '-'),
                    productUrl: obj.url,
                    valid: !obj.isMarketplaceProduct,
                    department: this.department,
                    timestamp: Date.now(),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                }
            );
        }

        return products;
    }

}