import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ParisPageFetcher } from '../../src/Infrastructure/Retail/ParisPageFetcher';
import { ParisProductParser } from '../../src/Infrastructure/Retail/ParisProductParser';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { Paris } from '../../src/Infrastructure/Retail/Paris';
import { FakeDirectBroker } from '../Infrastructure/FakeDirectBroker';

const main = async () => {

    const broker = new FakeDirectBroker();
    await broker.setup();
    const httpClient = new FetchHttpClient();
    const promises = [];
    for (const department of Paris.DEPARTMENTS) {
        const pageFetcher = new ParisPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const paginator = new Paginator(Paris.ITEMS_PER_PAGE, totalCount);
        const productParser = new ParisProductParser(department);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        promises.push(app.start());
    }
    await Promise.all(promises);
    await broker.close();
}

main();