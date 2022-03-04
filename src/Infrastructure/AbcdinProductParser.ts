import { Department } from "../Domain/Department";
import { Product } from "../Domain/Product";
import { ProductParser } from "../Domain/ProductParser";
import { Retail } from "../Domain/Retail";

export class AbcdinProductParser implements ProductParser {

    constructor(private department: Department) { }

    private cleanString(str: string): string {
        return str.replace(/&quot;/g, '"')
            .replace(/&aacute;/g, 'á')
            .replace(/&Aacute;/g, 'Á')
            .replace(/&eacute;/g, 'é')
            .replace(/&Eacute;/g, 'É')
            .replace(/&iacute;/g, 'í')
            .replace(/&Iacute;/g, 'Í')
            .replace(/&oacute;/g, 'ó')
            .replace(/&Oacute;/g, 'Ó')
            .replace(/&uacute;/g, 'ú')
            .replace(/&Uacute;/g, 'Ú')
            .replace(/&ntilde;/g, 'ñ')
            .replace(/&Ntilde;/g, 'Ñ')
            .replace(/&amp;/g, '&')
            ;
    }

    getAll(content: string): Product[] {
        const products: Product[] = [];

        const itemArray = content.match(/(<li class="item product product-item"[\w\W]+?\/li>)/gm)
        if (null == itemArray) {
            return products;
        }

        itemArray.forEach(str => {
            const itemData = str.match(/data-id="(\d+?)"[\w\W]+?href="([\w\W]+?)"[\w\W]+?product-image-photo[\w\W]+?src="([\w\W]+?)"[\w\W]+?product-item-brand">([\w\W]+?)<[\w\W]+?product-item-name"><a[\w\W]+?href="[\w\W]+?">([\w\W]+?)<\/a>/);
            if (null == itemData) {
                return;
            }

            const productId = itemData[1];
            const productUrl = itemData[2];
            const imageUrl = itemData[3];
            const brand = itemData[4];
            const name = itemData[5];

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
                    name: this.cleanString(name.trim()),
                    imageUrl: imageUrl,
                    brand: this.cleanString(brand.trim()),
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: exclusivePrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: productUrl,
                    department: this.department,
                    valid: true,
                    timestamp: Date.now()
                }
            );
        });

        return products;
    }

}