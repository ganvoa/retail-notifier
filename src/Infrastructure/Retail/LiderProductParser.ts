import { Product } from "../../Domain/Product";
import { ProductParser } from "../../Domain/ProductParser";
import { Retail } from "../../Domain/Retail";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { cleanString } from "../Helper";

export class LiderProductParser implements ProductParser {

    constructor(private department: RetailDepartment) { }

    getAll(content: string): Product[] {
        const products: Product[] = [];
        const json = JSON.parse(JSON.stringify(content, null, 8));
        if (json === '') {
            return products;
        }

        for (const product of json.products) {
            let currentPrice = product.price.BasePriceSales;
            let normalPrice = product.price.BasePriceReference;
            let exclusivePrice = product.price.BasePriceTLMC;

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
                    retailId: Retail.Lider,
                    productId: product.sku,
                    name: cleanString(product.displayName.trim()),
                    imageUrl: `https://images.lider.cl/wmtcl?source=url[file:/productos/${product.sku}a.jpg]&scale=size[300x300]&&sink`,
                    brand: cleanString(product.brand ? product.brand.trim() : '-'),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: `https://www.lider.cl/catalogo/product/sku/${product.sku}/${product.slug}`,
                    department: this.department.department,
                    timestamp: Date.now(),
                    valid: product.available,
                    shouldStore: true,
                    shouldNotify: discountPercentage >= this.department.minDiscount,
                }
            );
        }
        return products;
    }

}