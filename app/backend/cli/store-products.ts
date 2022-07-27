import { ProductFoundSubscriber } from '../../../src/Application/ProductFoundSubscriber';
import { ProductPersister } from '../../../src/Application/ProductPersister';
import { ElasticsearchProductRepository } from '../../../src/Infrastructure/ElasticsearchProductRepository';
import { RabbitDirectBroker } from '../../../src/Infrastructure/RabbitDirectBroker';
import { RabbitFanoutBroker } from '../../../src/Infrastructure/RabbitFanoutBroker';
import config from '../config';

const main = async () => {
  const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);
  const brokerDirect = new RabbitDirectBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  const brokerFanout = new RabbitFanoutBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  await brokerDirect.setup();
  await brokerFanout.setup();
  const persister = new ProductPersister(brokerFanout, repository);
  const app = new ProductFoundSubscriber(brokerDirect, persister);
  await app.subscribe();
};

main();
