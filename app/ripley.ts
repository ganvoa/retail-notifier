import { GetProductsByDepartment } from '../src/Application/GetProductsByDepartment';
import { DepartmentRipley } from '../src/Domain/DepartmentRipley';
import { Paginator } from '../src/Domain/Paginator';
import { ElasticsearchProductRepository } from '../src/Infrastructure/ElasticsearchProductRepository';
import { FetchHttpClient } from '../src/Infrastructure/FecthHttpClient';
import { RipleyPageFetcher } from '../src/Infrastructure/RipleyPageFetcher';
import { RipleyProductParser } from '../src/Infrastructure/RipleyProductParser';
import { TelegramNotifier } from '../src/Infrastructure/TelegramNotifier';
import config from './config';

const main = async () => {

    const httpClient = new FetchHttpClient();
    const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);

    let notifier = undefined;
    if (config.SHOULD_NOTIFY) {
        notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
    }

    for (let key in DepartmentRipley) {
        const pageFetcher = new RipleyPageFetcher(key, httpClient);
        const productParser = new RipleyProductParser(DepartmentRipley[key]);
        const total = await pageFetcher.getTotalCount();
        const paginator = new Paginator(48, total, 0);
        const app = new GetProductsByDepartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, repository, notifier);
        app.start();
    }
}

main();
