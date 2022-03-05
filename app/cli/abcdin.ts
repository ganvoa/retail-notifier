import { GetProductsByDepartment } from '../../src/Application/GetProductsByDepartment';
import { DepartmentAbcdin } from '../../src/Domain/DepartmentAbcdin';
import { Paginator } from '../../src/Domain/Paginator';
import { AbcdinPageFetcher } from '../../src/Infrastructure/AbcdinPageFetcher';
import { AbcdinProductParser } from '../../src/Infrastructure/AbcdinProductParser';
import { ElasticsearchProductRepository } from '../../src/Infrastructure/ElasticsearchProductRepository';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { TelegramNotifier } from '../../src/Infrastructure/TelegramNotifier';
import config from '../config';

const main = async () => {

    const httpClient = new FetchHttpClient();
    const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);

    let notifier = undefined;
    if (config.SHOULD_NOTIFY) {
        notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID);
    }

    for (let key in DepartmentAbcdin) {
        const pageFetcher = new AbcdinPageFetcher(key, httpClient);
        const productParser = new AbcdinProductParser(DepartmentAbcdin[key]);
        const total = await pageFetcher.getTotalCount();
        const paginator = new Paginator(16, total, 0);
        const app = new GetProductsByDepartment(config.APP_DISCOUNT, pageFetcher, productParser, paginator, repository, notifier);
        app.start();
    }
}

main();
