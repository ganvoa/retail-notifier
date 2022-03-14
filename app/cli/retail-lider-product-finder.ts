import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { LiderPageFetcher } from '../../src/Infrastructure/Retail/LiderPageFetcher';
import { LiderProductParser } from '../../src/Infrastructure/Retail/LiderProductParser';
import config from '../config';
import { Lider } from '../../src/Infrastructure/Retail/Lider';

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
    for (const department of Lider.DEPARTMENTS) {
        const pageFetcher = new LiderPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(Lider.ITEMS_PER_PAGE, totalCount);
        const productParser = new LiderProductParser(department);
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