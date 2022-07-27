import { ProductNotifier } from '../../../src/Application/ProductNotifier';
import { ProductStoredSubscriber } from '../../../src/Application/ProductStoredSubscriber';
import { RabbitFanoutBroker } from '../../../src/Infrastructure/RabbitFanoutBroker';
import { TwitterNotifier } from '../../../src/Infrastructure/TwitterNotifier';
import config from '../config';

const main = async () => {
  const broker = new RabbitFanoutBroker({
    fqdn: config.RABBIT_FQDN,
    exchangeName: config.RABBIT_EXCHANGE_NAME
  });
  await broker.setup();
  const notifier = new TwitterNotifier({
    consumerKey: config.TWITTER_API_KEY,
    consumerSecret: config.TWITTER_API_KEY_SECRET,
    accessTokenKey: config.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: config.TWITTER_ACCESS_TOKEN_SECRET
  });
  const productNotifier = new ProductNotifier(notifier);
  const app = new ProductStoredSubscriber(broker, productNotifier);
  await app.subscribe();
};

main();
