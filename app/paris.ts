import { GetProductsByApartment } from '../src/Application/GetProductsByApartment';
import { Paginator } from '../src/Domain/Paginator';
import { ApartmentParis } from '../src/Domain/ApartmentParis';
import { FetchHttpClient } from '../src/Infrastructure/FecthHttpClient';
import { ParisPageFetcher } from '../src/Infrastructure/ParisPageFetcher';
import { ParisProductParser } from '../src/Infrastructure/ParisProductParser';
import { TelegramNotifier } from '../src/Infrastructure/TelegramNotifier';
import config from './config';

const httpClient = new FetchHttpClient();

let notify = false;
let notifier = undefined;
if (notify) {
    notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
}

for (let key in ApartmentParis) {
    const paginator = new Paginator(60, Number.POSITIVE_INFINITY, 0);
    const pageFetcher = new ParisPageFetcher(key, httpClient);
    const productParser = new ParisProductParser(ApartmentParis[key]);
    const app = new GetProductsByApartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, notifier);
    app.start();
}