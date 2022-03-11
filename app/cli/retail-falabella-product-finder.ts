import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { FalabellaPageFetcher } from '../../src/Infrastructure/Retail/FalabellaPageFetcher';
import { FalabellaProductParser } from '../../src/Infrastructure/Retail/FalabellaProductParser';
import config from '../config';
import { Falabella } from '../../src/Infrastructure/Retail/Falabella';

const main = async () => {

    const broker = new RabbitDirectBroker(
        {
            fqdn: config.RABBIT_FQDN,
            exchangeName: config.RABBIT_EXCHANGE_NAME
        }
    );

    await broker.setup();
    const httpClient = new FetchHttpClient();
    const promises = [];
    for (const department of Falabella.DEPARTMENTS) {
        const pageFetcher = new FalabellaPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(Falabella.ITEMS_PER_PAGE, totalCount);
        const productParser = new FalabellaProductParser(department);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();