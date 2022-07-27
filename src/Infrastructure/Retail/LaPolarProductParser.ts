import { Product } from '../../Domain/Product';
import { ProductParser } from '../../Domain/ProductParser';
import { Retail } from '../../Domain/Retail';
import { RetailDepartment } from '../../Domain/RetailDepartment';
import { cleanString } from '../Helper';

export class LaPolarProductParser implements ProductParser {
  constructor(private department: RetailDepartment) {}

  getAll(content: string): Product[] {
    const products: Product[] = [];

    const itemArray = content.match(/(<div id="tile-\d+[\W\w]+?data-pwr-itemid="\d+")/gm);
    if (null == itemArray) {
      return products;
    }

    itemArray.forEach((str) => {
      const itemData = str.match(
        /id="tile-(\d+)?"[\W\w]+?href="([\W\w]+?)"[\W\w]+?src="([\W\w]+?)"[\W\w]+?data-trunk-lines="2">([\w\W]+?)<\/p>[\W\w]+?data-product-name="([\w\W]+?)"/
      );
      if (null == itemData) {
        return;
      }
      const productId = itemData[1];
      const productUrl = `https://www.lapolar.cl` + cleanString(itemData[2]);
      const imageUrl = itemData[3];
      const productBrand = cleanString(itemData[4]).trim();
      const productName = cleanString(itemData[5]).trim();
      const normalPriceMatch = str.match(/normal-price[\w\W]+?data-value="([\w\W]+?)">/);
      let normalPrice = 0;
      if (null !== normalPriceMatch) {
        normalPrice = parseInt(normalPriceMatch[1]);
      }

      let currentPrice = 0;
      const currentPriceMatch = str.match(/internet-price[\w\W]+?data-value="([\w\W]+?)">/);
      if (null !== currentPriceMatch) {
        currentPrice = parseInt(currentPriceMatch[1]);
      } else {
        currentPrice = normalPrice;
      }

      let cardPrice = 0;
      const cardPriceMatch = str.match(/tlp-price[\w\W]+?data-value="([\w\W]+?)">/);
      if (null !== cardPriceMatch) {
        cardPrice = parseInt(cardPriceMatch[1]);
      } else {
        cardPrice = normalPrice;
      }

      if (normalPrice == 0) {
        normalPrice = currentPrice;
      }

      if (cardPrice == 0) {
        cardPrice = currentPrice;
      }

      const minPrice = Math.min(currentPrice, normalPrice, cardPrice);
      const discountPercentage = Math.round(100 - (minPrice * 100) / normalPrice);

      products.push({
        retailId: Retail.LaPolar,
        productId: productId,
        name: productName,
        imageUrl: imageUrl,
        brand: productBrand,
        currentPrice: currentPrice,
        normalPrice: normalPrice,
        exclusivePrice: cardPrice,
        minPrice: minPrice,
        discountPercentage: discountPercentage,
        productUrl: productUrl,
        department: this.department.department,
        timestamp: Date.now(),
        valid: minPrice > 0,
        shouldStore: discountPercentage >= 50,
        shouldNotify: discountPercentage >= this.department.minDiscount
      });
    });

    return products;
  }
}
