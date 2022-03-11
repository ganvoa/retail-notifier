import { ProductFoundPublisher } from '../../src/Application/ProductFoundPublisher';
import { Department } from '../../src/Domain/Department';
import { Product } from '../../src/Domain/Product';
import { Retail } from '../../src/Domain/Retail';
import { RabbitDirectBroker } from '../../src/Infrastructure/RabbitDirectBroker';
import config from '../../app/config';

const main = async () => {

    const broker = new RabbitDirectBroker(
        {
            fqdn: config.RABBIT_FQDN,
            exchangeName: config.RABBIT_EXCHANGE_NAME
        }
    );
    await broker.setup();
    const app = new ProductFoundPublisher(broker);
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
        imageUrl: `https://home.ripley.cl/store/Attachment/WOP/D328/2000374180238/2000374180238_2.jpg`,
        productUrl: `https://simple.ripley.cl/set-body-secret-mandala-2000374180238p`,
        shouldStore: true,
        shouldNotify: false
    }
    await app.publish(product);
    await broker.close();
}

main();