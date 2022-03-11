import { Paginator } from '../../src/Domain/Paginator';
import { DepartmentParis } from '../../src/Domain/DepartmentParis';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ParisPageFetcher } from '../../src/Infrastructure/Retail/ParisPageFetcher';
import { ParisProductParser } from '../../src/Infrastructure/Retail/ParisProductParser';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import config from '../config';

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
    for (let key in DepartmentParis) {
        const paginator = new Paginator(60, Number.POSITIVE_INFINITY, 0);
        const pageFetcher = new ParisPageFetcher(key, httpClient);
        const productParser = new ParisProductParser(DepartmentParis[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();