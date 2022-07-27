import { HttpClient } from '../Domain/HttpClient';
import { Notifier } from '../Domain/Notifier';
import { Product } from '../Domain/Product';
import { formatCLP, sleep } from './Helper';

export class TelegramAdminNotifier implements Notifier {
  constructor(private token: string, private chatId: string, private httpClient: HttpClient) {}

  async notify(product: Product): Promise<void> {
    if (product.shouldNotify) {
      return Promise.resolve();
    }

    try {
      const productId = `${product.retailId}-${product.productId}-${product.minPrice}`;
      let reply = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '📢 Twittear',
                callback_data: productId
              }
            ]
          ]
        }
      };
      const message = `

<i>${product.brand}</i> 
<b>${product.name}</b> 

${product.discountPercentage}% Descuento | $ ${formatCLP(product.minPrice)}

${product.productUrl}`;
      await this.httpClient.post({
        url: `https://api.telegram.org/bot${this.token}/sendMessage`,
        body: JSON.stringify({
          ...reply,
          text: message,
          chat_id: this.chatId,
          parse_mode: 'HTML'
        })
      });
      await sleep(3000);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
