import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { HitesPageFetcher } from '../../src/Infrastructure/Retail/HitesPageFetcher';
import { HitesProductParser } from '../../src/Infrastructure/Retail/HitesProductParser';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import config from '../config';
import { DepartmentHites } from '../../src/Domain/DepartmentHites';

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
    for (let key in DepartmentHites) {
        const paginator = new Paginator(48, Number.POSITIVE_INFINITY, 0);
        const pageFetcher = new HitesPageFetcher(key, httpClient);
        const productParser = new HitesProductParser(DepartmentHites[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();