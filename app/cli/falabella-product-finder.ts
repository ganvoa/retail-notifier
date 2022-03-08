import { Paginator } from '../../src/Domain/Paginator';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';
import { DepartmentFalabella } from '../../src/Domain/DepartmentFalabella';
import { FalabellaPageFetcher } from '../../src/Infrastructure/FalabellaPageFetcher';
import { FalabellaProductParser } from '../../src/Infrastructure/FalabellaProductParser';
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
    for (let key in DepartmentFalabella) {
        const paginator = new Paginator(60, Number.POSITIVE_INFINITY, 0);
        const pageFetcher = new FalabellaPageFetcher(key, httpClient);
        const productParser = new FalabellaProductParser(DepartmentFalabella[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        await app.start();
    }
    await broker.close();
}

main();