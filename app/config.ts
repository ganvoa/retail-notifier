import dotenv from "dotenv";

dotenv.config();
interface Config {
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHANNEL_ID: string;
    ELASTICSEARCH_INDEX: string;
    ELASTICSEARCH_HOST: string;
    APP_DISCOUNT: number;
}

const getConfig = (): Config => {
    return {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "invalid_token",
        TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || "invalid_channel",
        ELASTICSEARCH_INDEX: process.env.ELASTICSEARCH_INDEX || "retail",
        ELASTICSEARCH_HOST: process.env.ELASTICSEARCH_HOST || "http://localhost:9200",
        APP_DISCOUNT: process.env.APP_DISCOUNT ? parseInt(process.env.APP_DISCOUNT) : 50,
    };
};

const config = getConfig();

export default config;