import { FanoutBroker } from "../Domain/Broker";
import { Event } from "../Domain/Event";
import { HttpClient } from "../Domain/HttpClient";
import { ProductRepository } from "../Domain/ProductRepository";
import { Retail } from "../Domain/Retail";
export class TelegramUpdateListener {

    constructor(
        private token: string,
        private httpClient: HttpClient,
        private repository: ProductRepository,
        private broker: FanoutBroker) { }

    async listen(): Promise<void> {
        let currentOffset = 0;
        do {
            let url = `https://api.telegram.org/bot${this.token}/getUpdates?offset=${currentOffset}&timeout=20&limit=1&allowed_updates=[%22callback_query%22]`;
            let response = await this.httpClient.get({ url: url });
            if (response.statusCode != 200) {
                continue;
            }
            const body = response.body as any;
            const results = body.result as {
                update_id: number, callback_query: {
                    id: string,
                    from: any,
                    message: any,
                    chat_instance: string,
                    data: string
                }
            }[];
            for (const result of results) {
                currentOffset = result.update_id + 1;
                console.log(`producto: ${result.callback_query.data}`);
                let productPart = result.callback_query.data.split("-");
                let product = await this.repository.find(productPart[1], productPart[0] as Retail, parseInt(productPart[2]));

                if (product == undefined) {
                    continue;
                }

                if (product.shouldNotify) {
                    console.log(`producto already notified: ${result.callback_query.data}`);
                    continue;
                }

                product.shouldNotify = true;
                await this.repository.update(product);
                await this.broker.publish(Event.ProductStored, product);
                console.log(`producto queued: ${result.callback_query.data}`);
                let url = `https://api.telegram.org/bot${this.token}/answerCallbackQuery?callback_query_id=${result.callback_query.id}&text=ok!`;
                await this.httpClient.get({ url: url });
            }
        } while (true);
    }

}