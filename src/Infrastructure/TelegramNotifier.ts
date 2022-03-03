import TelegramBot from "node-telegram-bot-api";
import { Notifier } from "../Domain/Notifier";
import { Product } from "../Domain/Product";
export class TelegramNotifier implements Notifier {

    private bot: TelegramBot;

    constructor(token: string, private chatId: string) {
        this.bot = new TelegramBot(token, { polling: false });
    }

    async notify(product: Product): Promise<void> {
        const formatter = Intl.NumberFormat();
        try {
            this.bot.sendMessage(this.chatId, `

<i>${product.brand}</i> 
<b>${product.name}</b> 

${product.discountPercentage}% Descuento | $ ${formatter.format(product.minPrice)}

${product.productUrl}`, { parse_mode: "HTML" });
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }

    }

}