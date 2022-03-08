import Twitter from "twitter-lite";
import { Notifier } from "../Domain/Notifier";
import { Product } from "../Domain/Product";
import { sleep } from "./Helper";

type TwitterConfig = {
    consumerKey: string,
    consumerSecret: string,
    accessTokenKey: string,
    accessTokenSecret: string,
}

export class TwitterNotifier implements Notifier {

    private client: Twitter;

    constructor(config: TwitterConfig) {
        this.client = new Twitter(
            {
                consumer_key: config.consumerKey,
                consumer_secret: config.consumerSecret,
                access_token_key: config.accessTokenKey,
                access_token_secret: config.accessTokenSecret
            }
        );
    }

    async notify(product: Product): Promise<void> {
        if (product.productUrl == undefined) {
            return Promise.resolve();
        }

        try {
            const formatter = Intl.NumberFormat();
            let message = `
${product.name} 

${product.discountPercentage}% Descuento | $ ${formatter.format(product.minPrice)}

${product.productUrl}
            
#${product.retailId} #${product.department} #oferta #descuento`;
            await this.client.post('statuses/update', { status: message });
            await sleep(1000);
            return Promise.resolve();
        } catch (error) {
            console.error(error);
            return Promise.resolve();
        }

    }

}