import { ProductNotifier } from '../../src/Application/ProductNotifier';
import { TelegramNotifier } from '../../src/Infrastructure/TelegramNotifier';
import config from '../../app/config';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { Retail } from '../../src/Domain/Retail';
import { Department } from '../../src/Domain/Department';

const httpClient = new FetchHttpClient();
const notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID, httpClient);
const productNotifier = new ProductNotifier(notifier);
productNotifier.handle({
    "retailId": Retail.Falabella,
    "productId": "15340890",
    "name": "Notebook 2 En 1 Touch Intel Celeron 4GB RAM 64GB SSD 13.3\" (Teclado y sistema en Inglés-configurable al español)",
    "imageUrl": "https://falabella.scene7.com/is/image/Falabella/15340890_1",
    "brand": "HYUNDAI",
    "currentPrice": 139990,
    "normalPrice": 319990,
    "exclusivePrice": 139990,
    "minPrice": 139990,
    "discountPercentage": 56,
    "productUrl": "https://www.falabella.com/falabella-cl/product/15340890/Notebook-2-En-1-Touch-Intel-Celeron-4GB-RAM-64GB-SSD-13.3-(Teclado-y-sistema-en-Ingles-configurable-al-espanol)",
    "valid": true,
    "department": Department.Tecnologia,
    "timestamp": 1646855224145,
    shouldNotify: false,
    shouldStore: true
});