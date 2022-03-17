import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { Falabella } from '../../src/Infrastructure/Retail/Falabella';
import { FalabellaPageFetcher } from '../../src/Infrastructure/Retail/FalabellaPageFetcher';
import { FalabellaProductParser } from '../../src/Infrastructure/Retail/FalabellaProductParser';
import { FakeDirectBroker } from '../Infrastructure/FakeDirectBroker';
import { Department } from '../../src/Domain/Department';

const main = async (minToShow: number, slug: string) => {
    const broker = new FakeDirectBroker(minToShow);
    await broker.setup();
    const httpClient = new FetchHttpClient();
    let department = {
        iterable: true,
        department: Department.Muebles,
        minDiscount: 60,
        slug: slug
    };
    const pageFetcher = new FalabellaPageFetcher(department, httpClient);
    const totalCount = await pageFetcher.getTotalCount();
    const productParser = new FalabellaProductParser(department);
    const paginator = new Paginator(Falabella.ITEMS_PER_PAGE, totalCount);
    const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
    await app.start()
    await broker.close();
}

const args = process.argv.slice(2);
if (args.length != 2) {
    console.error(`should specify args: <minToShow> <slug>`);
    process.exit(1);
}

const minToShow: number = parseInt(args[0]);
const slug: string = args[1];

main(minToShow, slug);