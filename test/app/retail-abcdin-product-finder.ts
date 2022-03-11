import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { Abcdin } from '../../src/Infrastructure/Retail/Abcdin';
import { AbcdinPageFetcher } from '../../src/Infrastructure/Retail/AbcdinPageFetcher';
import { AbcdinProductParser } from '../../src/Infrastructure/Retail/AbcdinProductParser';
import { FakeDirectBroker } from '../Infrastructure/FakeDirectBroker';

const main = async () => {
    const broker = new FakeDirectBroker();
    await broker.setup();
    const httpClient = new FetchHttpClient();
    const promises = [];
    for (const department of Abcdin.DEPARTMENTS) {
        const pageFetcher = new AbcdinPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const productParser = new AbcdinProductParser(department);
        const paginator = new Paginator(Abcdin.ITEMS_PER_PAGE, totalCount);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();