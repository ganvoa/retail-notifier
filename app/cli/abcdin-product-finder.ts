import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { AbcdinPageFetcher } from '../../src/Infrastructure/AbcdinPageFetcher';
import { AbcdinProductParser } from '../../src/Infrastructure/AbcdinProductParser';
import { DepartmentAbcdin } from '../../src/Domain/DepartmentAbcdin';
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
    for (let key in DepartmentAbcdin) {
        const pageFetcher = new AbcdinPageFetcher(key, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(36, totalCount, 0);
        const productParser = new AbcdinProductParser(DepartmentAbcdin[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();