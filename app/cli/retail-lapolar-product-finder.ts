import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { LaPolarPageFetcher } from '../../src/Infrastructure/Retail/LaPolarPageFetcher';
import { LaPolarProductParser } from '../../src/Infrastructure/Retail/LaPolarProductParser';
import config from '../config';
import { LaPolar } from '../../src/Infrastructure/Retail/LaPolar';

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
    for (const department of LaPolar.DEPARTMENTS) {
        const pageFetcher = new LaPolarPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(LaPolar.ITEMS_PER_PAGE, totalCount);
        const productParser = new LaPolarProductParser(department);
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