import { Department } from "../Domain/Department";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";
import { Retail } from "../Domain/Retail";
import { cleanString } from "./Helper";

export class ParisProductParser implements ProductParser {

    constructor(private department: Department) { }

    getAll(content: string): Product[] {
        const products: Product[] = [];

        const itemArray = content.match(/(<li itemtype="http:\/\/schema\.org\/Product"[\w\W]+?\/li>)/gm)
        if (null == itemArray) {
            return products;
        }

        itemArray.forEach(str => {
            const itemData = str.match(/data-product="({[\w\W+]+?})"/);
            if (null == itemData) {
                return;
            }

            let productSeller = undefined;
            const productSellerRegex = str.match(/id="productSeller" value="([\w\W]+?)"/);
            if (null !== productSellerRegex) {
                productSeller = productSellerRegex[1];
            }

            let imageUrl = undefined;
            const imageUrlRegex = str.match(/image-primary[\w\W]+?data-src="([\w\W]+?)"/);
            if (null !== imageUrlRegex) {
                imageUrl = imageUrlRegex[1];
            }

            let itemUrl = undefined;
            const itemUrlRegex1 = str.match(/itemprop="url"[\w\W]+content="(.*)?">/);
            if (null !== itemUrlRegex1) {
                itemUrl = itemUrlRegex1[1];
            } else {
                const itemUrlRegex2 = str.match(/<a class="thumb-link js-product-layer" href="([\w\W]+?)"/);
                if (null !== itemUrlRegex2) {
                    itemUrl = itemUrlRegex2[1];
                }
            }

            if (itemUrl !== undefined) {
                itemUrl = itemUrl.replace(/&amp;/g, '&');
            }

            const jsonData = cleanString(itemData[1])
            const json = JSON.parse(jsonData);

            const currentPrice = parseInt(json.price);
            const normalPrice = parseInt(json.dimension19);
            const exclusivePrice = parseInt(json.dimension20) == 0 ? parseInt(json.price) : parseInt(json.dimension20);
            const minPrice = Math.min(currentPrice, normalPrice, exclusivePrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);
            products.push(
                {
                    retailId: Retail.Paris,
                    productId: json.id,
                    name: cleanString(json.name.trim()),
                    imageUrl: imageUrl,
                    brand: cleanString(json.brand.trim()),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: itemUrl,
                    valid: (productSeller === "Paris.cl"),
                    department: this.department,
                    timestamp: Date.now()
                }
            );
        });

        return products;
    }

}