import { Apartment } from "../Domain/Apartment";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";
import { Retail } from "../Domain/Retail";

export class AbcdinProductParser implements ProductParser {
    
    constructor(private apartment: Apartment) {}

    getAll(content: string): Product[] {
        const products: Product[] = [];

        const itemArray = content.match(/(<li class="item product product-item"[\w\W]+?\/li>)/gm)
        if (null == itemArray) {
            return products;
        }

        itemArray.forEach(str => {
            const itemData = str.match(/data-id="(\d+?)"[\w\W]+?href="([\w\W]+?)"[\w\W]+?<span class="product-item-brand">([\w\W]+?)<\/span>[\w\W]+?product-item-name"><a[\w\W]+?href="[\w\W]+?">([\w\W]+?)<\/a>/);
            if (null == itemData) {
                return;
            }

            const productId = itemData[1];
            const productUrl = itemData[2];
            const brand = itemData[3];
            const name = itemData[4];

            const internetPriceMatch = str.match(/internet-price"[\w\W]+?data-price-amount="(\d+?)"/);
            let currentPrice = 0;
            if (null !== internetPriceMatch) {
                currentPrice = parseInt(internetPriceMatch[1]);
            }

            const normalPriceMatch = str.match(/normal-price"[\w\W]+?data-price-amount="(\d+?)"/);
            let normalPrice = 0;
            if (null !== normalPriceMatch) {
                normalPrice = parseInt(normalPriceMatch[1]);
            } else {
                normalPrice = currentPrice;
            }

            const cardPriceMatch = str.match(/card-price"[\w\W]+?data-price-amount="(\d+?)"/);
            let cardPrice = 0;
            if (null !== cardPriceMatch) {
                cardPrice = parseInt(cardPriceMatch[1]);
            } else {
                cardPrice = currentPrice;
            }

            const exclusivePrice = cardPrice;
            const minPrice = Math.min(currentPrice, normalPrice, exclusivePrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);

            products.push(
                {
                    retailId: Retail.Abcdin,
                    productId: productId,
                    name: name.trim(),
                    imageUrl: undefined,
                    brand: brand.trim(),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: productUrl,
                    apartment: this.apartment,
                    valid: true
                }
            );
        });

        return products;
    }

}