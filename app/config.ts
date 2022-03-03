import dotenv from "dotenv";

dotenv.config();
interface Config {
    TELEGRAM_BOT_TOKEN: string;
    TELEGRAM_CHANNEL_ID: string;
    APP_DISCOUNT: number;
}

const getConfig = (): Config => {
    return {
        TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "invalid_token",
        TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID || "invalid_channel",
        APP_DISCOUNT: process.env.APP_DISCOUNT ? parseInt(process.env.APP_DISCOUNT) : 50,
    };
};

const config = getConfig();

export default config;