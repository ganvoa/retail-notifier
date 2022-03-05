import { GetProductsByDepartment } from '../../src/Application/GetProductsByDepartment';
import { DepartmentFalabella } from '../../src/Domain/DepartmentFalabella';
import { Paginator } from '../../src/Domain/Paginator';
import { ElasticsearchProductRepository } from '../../src/Infrastructure/ElasticsearchProductRepository';
import { FalabellaPageFetcher } from '../../src/Infrastructure/FalabellaPageFetcher';
import { FalabellaProductParser } from '../../src/Infrastructure/FalabellaProductParser';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { TelegramNotifier } from '../../src/Infrastructure/TelegramNotifier';
import config from './../config';

const main = async () => {

    const httpClient = new FetchHttpClient();
    const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);

    let notifier = undefined;
    if (config.SHOULD_NOTIFY) {
        notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
    }

    for (let key in DepartmentFalabella) {
        const pageFetcher = new FalabellaPageFetcher(key, httpClient);
        const productParser = new FalabellaProductParser(DepartmentFalabella[key]);
        const paginator = new Paginator(48, Number.POSITIVE_INFINITY, 0);
        const app = new GetProductsByDepartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, repository, notifier);
        app.start();
    }
}

main();
