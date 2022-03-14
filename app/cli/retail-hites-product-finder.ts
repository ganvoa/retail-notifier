import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { HitesPageFetcher } from '../../src/Infrastructure/Retail/HitesPageFetcher';
import { HitesProductParser } from '../../src/Infrastructure/Retail/HitesProductParser';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import config from '../config';
import { Hites } from '../../src/Infrastructure/Retail/Hites';

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
    for (const department of Hites.DEPARTMENTS) {
        const pageFetcher = new HitesPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(Hites.ITEMS_PER_PAGE, totalCount);
        const productParser = new HitesProductParser(department);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    try {
        await Promise.all(promises);
    } catch(e) {
        console.error(e);
    }
    await broker.close();
}

main();