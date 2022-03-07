import { ProductFoundSubscriber } from '../../src/Application/ProductFoundSubscriber';
import { RabbitExchangeType, RabbitMqBroker } from '../../src/Infrastructure/RabbitMqBroker';

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
    const app = new ProductFoundSubscriber(exchange);
    app.subscribe();
}

main();