import { Product } from "../../Domain/Product";
import { ProductParser } from "../../Domain/ProductParser";
import { Retail } from "../../Domain/Retail";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { cleanString } from "../Helper";

export class AbcdinProductParser implements ProductParser {

    constructor(private department: RetailDepartment) { }

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

            const cardPriceMatch = str.match(/card-price"[\w\W]+?price">\$([\w\W]+?)</);
            let cardPrice = 0;
            if (null !== cardPriceMatch) {
                cardPrice = parseInt(cardPriceMatch[1].replace(/\./g, ""));
            } else {
                cardPrice = currentPrice;
            }

            const minPrice = Math.min(currentPrice, normalPrice, cardPrice);
            const discountPercentage = Math.round(100 - minPrice * 100 / normalPrice);
            let currentBrand = cleanString(brand.trim()).includes("span") ? "-" : cleanString(brand.trim());
            products.push(
                {
                    retailId: Retail.Abcdin,
                    productId: productId,
                    name: cleanString(name.trim()),
                    imageUrl: imageUrl,
                    brand: currentBrand,
                    currentPrice: currentPrice,
                    normalPrice: normalPrice,
                    exclusivePrice: cardPrice,
                    minPrice: minPrice,
                    discountPercentage: discountPercentage,
                    productUrl: productUrl,
                    department: this.department.department,
                    timestamp: Date.now(),
                    valid: true,
                    shouldStore: discountPercentage >= 50,
                    shouldNotify: discountPercentage >= this.department.minDiscount,
                }
            );
        });

        return products;
    }

}