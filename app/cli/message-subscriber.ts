import { MessageSubscriber } from '../../src/Application/MessageSubscriber';
import { RabbitExchangeType, RabbitMqExchange } from '../../src/Infrastructure/RabbitMqExchange';

const main = async () => {

    const exchange = new RabbitMqExchange(
        {
            fqdn: 'amqp://retail:retail@localhost:5672',
            exchangeName: 'retail',
            exchangeType: RabbitExchangeType.Direct,
            queueName: 'retail.product-found'
        }
    );
    await exchange.setup();
    const app = new MessageSubscriber(exchange);
    app.subscribe();
}

main();