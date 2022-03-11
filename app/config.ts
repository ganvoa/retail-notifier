import dotenv from "dotenv";

dotenv.config();
interface Config {
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHANNEL_ID: string;
    ELASTICSEARCH_INDEX: string;
    ELASTICSEARCH_HOST: string;
    TWITTER_API_KEY: string;
    TWITTER_API_KEY_SECRET: string;
    TWITTER_ACCESS_TOKEN: string;
    TWITTER_ACCESS_TOKEN_SECRET: string;
    RABBIT_EXCHANGE_NAME: string;
    RABBIT_FQDN: string;
}

const getConfig = (): Config => {
    return {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "invalid_token",
        TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || "invalid_channel",
        ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX || "retail",
        ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST || "http://localhost:9200",
        RABBIT_EXCHANGE_NAME: process.env.RABBIT_EXHANGE_NAME || "retail",
        RABBIT_FQDN: process.env.RABBIT_FQDN || "amqp://retail:retail@localhost:5672",
        TWITTER_API_KEY: process.env.TWITTER_API_KEY || "-",
        TWITTER_API_KEY_SECRET: process.env.TWITTER_API_KEY_SECRET || "-",
        TWITTER_ACCESS_TOKEN: process.env.TWITTER_ACCESS_TOKEN || "-",
        TWITTER_ACCESS_TOKEN_SECRET: process.env.TWITTER_ACCESS_TOKEN_SECRET || "-"
    };
};

const config = getConfig();

export default config;