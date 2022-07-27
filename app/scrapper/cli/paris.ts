import { ProductFinder } from '../../../src/Application/ProductFinder';
import { Paginator } from '../../../src/Domain/Paginator';
import { FetchHttpClient } from '../../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../../src/Infrastructure/RabbitDirectBroker';
import { Paris } from '../../../src/Infrastructure/Retail/Paris';
import { ParisPageFetcher } from '../../../src/Infrastructure/Retail/ParisPageFetcher';
import { ParisProductParser } from '../../../src/Infrastructure/Retail/ParisProductParser';
import config from '../config';

const main = async () => {
  const broker = new RabbitDirectBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
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
  try {
    await Promise.all(promises);
  } catch (e) {
    console.error(e);
  }
  await broker.close();
};

main();
