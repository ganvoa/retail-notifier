import { ProductNotifier } from '../../src/Application/ProductNotifier';
import { Retail } from '../../src/Domain/Retail';
import { ElasticsearchProductRepository } from '../../src/Infrastructure/ElasticsearchProductRepository';
import { TwitterNotifier } from '../../src/Infrastructure/TwitterNotifier';
import config from './../config';

const main = async () => {

    const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);
    const notifier = new TwitterNotifier(
        {
            consumerKey: config.TWITTER_API_KEY,
            consumerSecret: config.TWITTER_API_KEY_SECRET,
            accessTokenKey: config.TWITTER_ACCESS_TOKEN,
            accessTokenSecret: config.TWITTER_ACCESS_TOKEN_SECRET
        }
    );
    const app = new ProductNotifier(repository, notifier);
    await app.notify("24138939", Retail.Ripley, 9990);
}

main();
