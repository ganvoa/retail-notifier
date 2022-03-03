import { json } from "stream/consumers";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";

export class ParisProductParser implements ProductParser {
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

            if (productSeller !== "Paris.cl") {
                return;
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

            const jsonData = itemData[1]
                .replace(/&quot;/g, '"')
                .replace(/&aacute;/g, 'á')
                .replace(/&eacute;/g, 'é')
                .replace(/&iacute;/g, 'í')
                .replace(/&oacute;/g, 'ó')
                .replace(/&uacute;/g, 'ú')
                ;
            const json = JSON.parse(jsonData);

            const currentPrice = parseInt(json.price);
            const normalPrice = parseInt(json.dimension19);
            const exclusivePrice = parseInt(json.dimension20) == 0 ? parseInt(json.price) : parseInt(json.dimension20);
            const minPrice = Math.min(currentPrice, normalPrice, exclusivePrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);
            products.push(
                {
                    productId: json.id,
                    name: json.name.trim(),
                    imageUrl: undefined,
                    brand: json.brand.trim(),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: itemUrl
                }
            );
        });

        return products;
    }

}