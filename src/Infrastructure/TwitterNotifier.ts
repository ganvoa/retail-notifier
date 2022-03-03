import { Notifier } from "../Domain/Notifier";
import { Product } from "../Domain/Product";
import { TwitterApi } from 'twitter-api-v2';

export class TwitterNotifier implements Notifier {

    private twitter: TwitterApi;

    constructor(token: string) {

        this.twitter = new TwitterApi(token);
    }

    async notify(product: Product): Promise<void> {

        try {
            await this.twitter.v1.tweet(`${product.name} $ ${product.minPrice} % ${product.discountPercentage}`);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }

    }

}