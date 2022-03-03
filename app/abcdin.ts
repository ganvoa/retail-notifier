import { GetProductsByApartment } from '../src/Application/GetProductsByApartment';
import { ApartmentAbcdin } from '../src/Domain/ApartmentAbcdin';
import { Paginator } from '../src/Domain/Paginator';
import { AbcdinPageFetcher } from '../src/Infrastructure/AbcdinPageFetcher';
import { AbcdinProductParser } from '../src/Infrastructure/AbcdinProductParser';
import { FetchHttpClient } from '../src/Infrastructure/FecthHttpClient';
import { TelegramNotifier } from '../src/Infrastructure/TelegramNotifier';
import config from './config';

const main = async () => {

    const httpClient = new FetchHttpClient();

    let notify = false;
    let notifier = undefined;
    if (notify) {
        notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
    }

    for (let key in ApartmentAbcdin) {
        const pageFetcher = new AbcdinPageFetcher(key, httpClient);
        const productParser = new AbcdinProductParser(ApartmentAbcdin[key]);
        const total = await pageFetcher.getTotalCount();
        const paginator = new Paginator(16, total, 0);
        const app = new GetProductsByApartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, notifier);
        app.start();
    }
}

main();
