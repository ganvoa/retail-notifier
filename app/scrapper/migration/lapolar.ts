import { ProductFinder } from '../../../src/Application/ProductFinder';
import { Paginator } from '../../../src/Domain/Paginator';
import { RetailDepartment } from '../../../src/Domain/RetailDepartment';
import { FetchHttpClient } from '../../../src/Infrastructure/FecthHttpClient';
import { RabbitDirectBroker } from '../../../src/Infrastructure/RabbitDirectBroker';
import { LaPolar } from '../../../src/Infrastructure/Retail/LaPolar';
import { LaPolarPageFetcher } from '../../../src/Infrastructure/Retail/LaPolarPageFetcher';
import { LaPolarProductParser } from '../../../src/Infrastructure/Retail/LaPolarProductParser';
import config from '../config';

const main = async () => {
  const broker = new RabbitDirectBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  await broker.setup();
  const httpClient = new FetchHttpClient();
  const promises = [];
  for (const department of LaPolar.DEPARTMENTS) {
    let departmentToMigrate: RetailDepartment = {
      department: department.department,
      slug: department.slug,
      minDiscount: 80,
      iterable: department.iterable
    };
    const pageFetcher = new LaPolarPageFetcher(departmentToMigrate, httpClient);
    const totalCount = await pageFetcher.getTotalCount();
    const paginator = new Paginator(LaPolar.ITEMS_PER_PAGE, totalCount);
    const productParser = new LaPolarProductParser(departmentToMigrate);
    const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
    promises.push(app.start());
  }
  await Promise.all(promises);
  await broker.close();
};

main();
