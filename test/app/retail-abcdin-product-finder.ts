import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { Abcdin } from '../../src/Infrastructure/Retail/Abcdin';
import { AbcdinPageFetcher } from '../../src/Infrastructure/Retail/AbcdinPageFetcher';
import { AbcdinProductParser } from '../../src/Infrastructure/Retail/AbcdinProductParser';
import { FakeDirectBroker } from '../Infrastructure/FakeDirectBroker';
import { Department } from '../../src/Domain/Department';

const main = async (minToShow: number, slug: string) => {
    const broker = new FakeDirectBroker(minToShow);
    await broker.setup();
    const httpClient = new FetchHttpClient();
    let department = {
        iterable: true,
        department: Department.Muebles,
        minDiscount: 50,
        slug: slug
    };
    const pageFetcher = new AbcdinPageFetcher(department, httpClient);
    const totalCount = await pageFetcher.getTotalCount();
    const productParser = new AbcdinProductParser(department);
    const paginator = new Paginator(Abcdin.ITEMS_PER_PAGE, totalCount);
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