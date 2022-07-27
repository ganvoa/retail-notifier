import dotenv from 'dotenv';

dotenv.config();
interface Config {
  RABBIT_EXCHANGE_NAME: string;
  RABBIT_FQDN: string;
}

const getConfig = (): Config => {
  return {
    RABBIT_EXCHANGE_NAME: process.env.RABBIT_EXHANGE_NAME || 'retail',
    RABBIT_FQDN: process.env.RABBIT_FQDN || 'amqp://retail:retail@localhost:5672'
  };
};

const config = getConfig();

export default config;
