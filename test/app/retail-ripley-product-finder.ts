import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { RipleyPageFetcher } from '../../src/Infrastructure/Retail/RipleyPageFetcher';
import { RipleyProductParser } from '../../src/Infrastructure/Retail/RipleyProductParser';
import { Ripley } from '../../src/Infrastructure/Retail/Ripley';
import { FakeDirectBroker } from '../Infrastructure/FakeDirectBroker';

const main = async () => {

    const broker = new FakeDirectBroker();
    await broker.setup();
    const httpClient = new FetchHttpClient();
    const promises = [];
    for (const department of Ripley.DEPARTMENTS) {
        const pageFetcher = new RipleyPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(Ripley.ITEMS_PER_PAGE, totalCount);
        const productParser = new RipleyProductParser(department);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();