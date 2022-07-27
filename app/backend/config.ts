import dotenv from 'dotenv';

dotenv.config();
interface Config {
  TELEGRAM_BOT_TOKEN: string;
  ELASTICSEARCH_INDEX: string;
  ELASTICSEARCH_HOST: string;
  RABBIT_EXCHANGE_NAME: string;
  RABBIT_FQDN: string;
}

const getConfig = (): Config => {
  return {
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || 'invalid_token',
    ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX || 'retail',
    ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST || 'http://localhost:9200',
    RABBIT_EXCHANGE_NAME: process.env.RABBIT_EXHANGE_NAME || 'retail',
    RABBIT_FQDN: process.env.RABBIT_FQDN || 'amqp://retail:retail@localhost:5672'
  };
};

const config = getConfig();

export default config;
