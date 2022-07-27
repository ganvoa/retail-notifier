import { ProductNotifier } from '../../../src/Application/ProductNotifier';
import { ProductStoredSubscriber } from '../../../src/Application/ProductStoredSubscriber';
import { FetchHttpClient } from '../../../src/Infrastructure/FecthHttpClient';
import { RabbitFanoutBroker } from '../../../src/Infrastructure/RabbitFanoutBroker';
import { TelegramNotifier } from '../../../src/Infrastructure/TelegramNotifier';
import config from '../config';

const main = async () => {
  const broker = new RabbitFanoutBroker({ fqdn: config.RABBIT_FQDN, exchangeName: config.RABBIT_EXCHANGE_NAME });
  await broker.setup();
  const httpClient = new FetchHttpClient();
  const notifier = new TelegramNotifier(config.TELEGRAM_BOT_TOKEN, config.TELEGRAM_CHANNEL_ID, httpClient);
  const productNotifier = new ProductNotifier(notifier);
  const app = new ProductStoredSubscriber(broker, productNotifier);
  await app.subscribe();
};

main();
