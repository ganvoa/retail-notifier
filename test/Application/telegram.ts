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
    retailId: Retail.Abcdin,
    productId: 'abcdin-59538-69990',
    name: 'Parlante Bluetooth Huawei Sound AIS-BW80-00 Negro',
    imageUrl: 'https://www.abcdin.cl/media/catalog/product/1/1/1147871f13_3.jpg?optimize=high&amp;fit=bounds&amp;height=240&amp;width=240&amp;canvas=240:240',
    brand: 'HUAWEI',
    currentPrice: 69990,
    normalPrice: 199990,
    exclusivePrice: 69990,
    minPrice: 69990,
    discountPercentage: 65,
    productUrl: 'https://www.abcdin.cl/parlante-bluetooth-huawei-sound-ais-bw80-00-negro-1147871',
    valid: true,
    department: Department.Tecnologia,
    timestamp: Date.now()
});