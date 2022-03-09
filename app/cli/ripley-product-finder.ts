import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { DepartmentRipley } from '../../src/Domain/DepartmentRipley';
import { RipleyPageFetcher } from '../../src/Infrastructure/RipleyPageFetcher';
import { RipleyProductParser } from '../../src/Infrastructure/RipleyProductParser';
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
    for (let key in DepartmentRipley) {
        const pageFetcher = new RipleyPageFetcher(key, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(48, totalCount, 0);
        const productParser = new RipleyProductParser(DepartmentRipley[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();