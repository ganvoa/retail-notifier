import { ProductFinder } from '../../../src/Application/ProductFinder';
import { Paginator } from '../../../src/Domain/Paginator';
import { FetchHttpClient } from '../../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../../src/Infrastructure/RabbitDirectBroker';
import { Abcdin } from '../../../src/Infrastructure/Retail/Abcdin';
import { AbcdinPageFetcher } from '../../../src/Infrastructure/Retail/AbcdinPageFetcher';
import { AbcdinProductParser } from '../../../src/Infrastructure/Retail/AbcdinProductParser';
import config from '../config';

const main = async () => {
  const httpClient = new FetchHttpClient();
  const broker = new RabbitDirectBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  await broker.setup();
  const promises = [];
  for (const department of Abcdin.DEPARTMENTS) {
    const pageFetcher = new AbcdinPageFetcher(department, httpClient);
    const totalCount = await pageFetcher.getTotalCount();
    const productParser = new AbcdinProductParser(department);
    const paginator = new Paginator(Abcdin.ITEMS_PER_PAGE, totalCount);
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
