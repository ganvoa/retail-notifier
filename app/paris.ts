import { GetProductsByDepartment } from '../src/Application/GetProductsByDepartment';
import { Paginator } from '../src/Domain/Paginator';
import { DepartmentParis } from '../src/Domain/DepartmentParis';
import { FetchHttpClient } from '../src/Infrastructure/FecthHttpClient';
import { ParisPageFetcher } from '../src/Infrastructure/ParisPageFetcher';
import { ParisProductParser } from '../src/Infrastructure/ParisProductParser';
import { TelegramNotifier } from '../src/Infrastructure/TelegramNotifier';
import { ElasticsearchProductRepository } from '../src/Infrastructure/ElasticsearchProductRepository';
import config from './config';

const httpClient = new FetchHttpClient();
const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);

let notifier = undefined;
if (config.SHOULD_NOTIFY) {
    notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
}

for (let key in DepartmentParis) {
    const paginator = new Paginator(60, Number.POSITIVE_INFINITY, 0);
    const pageFetcher = new ParisPageFetcher(key, httpClient);
    const productParser = new ParisProductParser(DepartmentParis[key]);
    const app = new GetProductsByDepartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, repository, notifier);
    app.start();
}