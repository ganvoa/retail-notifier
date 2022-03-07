import { Paginator } from '../../src/Domain/Paginator';
import { DepartmentParis } from '../../src/Domain/DepartmentParis';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { ParisPageFetcher } from '../../src/Infrastructure/ParisPageFetcher';
import { ParisProductParser } from '../../src/Infrastructure/ParisProductParser';
import { RabbitExchangeType, RabbitMqBroker } from '../../src/Infrastructure/RabbitMqBroker';
import { ProductFinder } from '../../src/Application/ProductFinder';

const main = async () => {

    const exchange = new RabbitMqBroker(
        {
            fqdn: 'amqp://retail:retail@localhost:5672',
            exchangeName: 'retail',
            exchangeType: RabbitExchangeType.Direct,
            queueName: 'retail.product-found'
        }
    );

    await exchange.setup();
    const httpClient = new FetchHttpClient();
    for (let key in DepartmentParis) {
        const paginator = new Paginator(60, Number.POSITIVE_INFINITY, 0);
        const pageFetcher = new ParisPageFetcher(key, httpClient);
        const productParser = new ParisProductParser(DepartmentParis[key]);
        const app = new ProductFinder(pageFetcher, productParser, paginator, exchange);
        await app.start();
    }
    await exchange.close();
}

main();