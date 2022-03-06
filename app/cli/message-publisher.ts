import { MessagePublisher } from '../../src/Application/MessagePublisher';
import { Department } from '../../src/Domain/Department';
import { Product } from '../../src/Domain/Product';
import { Retail } from '../../src/Domain/Retail';
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
    console.log('setup');
    await exchange.setup();
    const app = new MessagePublisher(exchange);
    const product: Product = {
        productId: '1234567',
        brand: 'generic',
        currentPrice: 10000,
        exclusivePrice: 5000,
        normalPrice: 10000,
        minPrice: 5000,
        department: Department.Tecnologia,
        discountPercentage: 50,
        name: 'Generic Product',
        retailId: Retail.Ripley,
        timestamp: Date.now(),
        valid: true,
        imageUrl: undefined,
        productUrl: undefined
    }
    console.log('publish');
    await app.publish(product);
    console.log('after publish');
    await exchange.close();
}

main();