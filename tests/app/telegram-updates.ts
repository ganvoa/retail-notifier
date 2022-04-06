import config from '../../app/config';
import { ElasticsearchProductRepository } from '../../src/Infrastructure/ElasticsearchProductRepository';
import { FetchHttpClient } from '../../src/Infrastructure/FecthHttpClient';
import { TelegramUpdateListener } from '../../src/Infrastructure/TelegramUpdateListener';
import { FakeFanoutBroker } from '../Infrastructure/FakeFanoutBroker';

const httpClient = new FetchHttpClient();
const repository = new ElasticsearchProductRepository(config.ELASTICSEARCH_INDEX, config.ELASTICSEARCH_HOST);
const broker = new FakeFanoutBroker();
const telegram = new TelegramUpdateListener(config.TELEGRAM_BOT_TOKEN, httpClient, repository, broker);
telegram.listen();