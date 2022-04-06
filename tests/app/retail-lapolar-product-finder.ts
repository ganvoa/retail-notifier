import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { LaPolar } from '../../src/Infrastructure/Retail/LaPolar';
import { LaPolarPageFetcher } from '../../src/Infrastructure/Retail/LaPolarPageFetcher';
import { LaPolarProductParser } from '../../src/Infrastructure/Retail/LaPolarProductParser';
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
    const pageFetcher = new LaPolarPageFetcher(department, httpClient);
    const totalCount = await pageFetcher.getTotalCount();
    const productParser = new LaPolarProductParser(department);
    const paginator = new Paginator(LaPolar.ITEMS_PER_PAGE, totalCount);
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