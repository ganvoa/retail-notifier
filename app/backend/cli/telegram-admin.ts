import { ElasticsearchProductRepository } from '../../../src/Infrastructure/ElasticsearchProductRepository';
import { FetchHttpClient } from '../../../src/Infrastructure/FecthHttpClient';
import { RabbitFanoutBroker } from '../../../src/Infrastructure/RabbitFanoutBroker';
import { TelegramUpdateListener } from '../../../src/Infrastructure/TelegramUpdateListener';
import config from '../config';

const main = async () => {
  const httpClient = new FetchHttpClient();
  const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);
  const broker = new RabbitFanoutBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  await broker.setup();
  const telegram = new TelegramUpdateListener(config.TELEGRAM_BOT_TOKEN, httpClient, repository, broker);
  await telegram.listen();
};

main();
