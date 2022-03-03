import { Notifier } from "../Domain/Notifier";
import { Product } from "../Domain/Product";

export class TelegramNotifier implements Notifier {
    async notify(product: Product): Promise<void> {

        try {
            
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }

    }

}