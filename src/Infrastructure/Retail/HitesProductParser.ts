import { Product } from '../../Domain/Product';
import { ProductParser } from '../../Domain/ProductParser';
import { Retail } from '../../Domain/Retail';
import { RetailDepartment } from '../../Domain/RetailDepartment';
import { cleanString } from '../Helper';

export class HitesProductParser implements ProductParser {
  constructor(private department: RetailDepartment) {}

  getAll(content: string): Product[] {
    const products: Product[] = [];

    const itemArray = content.match(/(<div class="h-100" data-pid[\w\W]+?<div class="compare-section">)/gm);
    if (null == itemArray) {
      return products;
    }

    itemArray.forEach((str) => {
      const itemData = str.match(
        /data-pid="([\w\W]+?)"[\w\W]+?src="([\w\W]+?)"[\w\W]+?product-brand">([\w\W]+?)<\/[\w\W]+?type="hidden" value="([\w\W]+?)"[\w\W]+?goto-product" href="([\w\W]+?)"/
      );
      if (null == itemData) {
        return;
      }
      const productId = itemData[1];
      const imageUrl = itemData[2];
      const productBrand = cleanString(itemData[3]);
      const productName = cleanString(itemData[4]);
      const productUrl = `https://www.hites.com` + cleanString(itemData[5]);

      let valid = true;
      const outOfStock = str.match(/availability-secondary-message"[\w\W]+?d-none[\w\W]+?prices-section/);
      if (null !== outOfStock) {
        valid = false;
      }

      const normalPriceMatch = str.match(/price-item[\w\W]+?list[\w\W]+?content="(\d+)"/);
      let normalPrice = 0;
      if (null !== normalPriceMatch) {
        normalPrice = parseInt(normalPriceMatch[1]);
      }

      let currentPrice = 0;
      const currentPriceMatch = str.match(/price-item[\w\W]+?sales[\w\W]+?content="(\d+)"/);
      if (null !== currentPriceMatch) {
        currentPrice = parseInt(currentPriceMatch[1]);
      } else {
        currentPrice = normalPrice;
      }
      let cardPrice = currentPrice;

      const minPrice = Math.min(currentPrice, normalPrice, cardPrice);
      const discountPercentage = Math.round(100 - (minPrice * 100) / normalPrice);

      products.push({
        retailId: Retail.Hites,
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
        valid: valid && minPrice > 0,
        shouldStore: discountPercentage >= 50,
        shouldNotify: discountPercentage >= this.department.minDiscount
      });
    });

    return products;
  }
}
