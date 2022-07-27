import rabbit from 'amqplib';
import { DirectBroker } from '../Domain/Broker';
import { Event } from '../Domain/Event';

export enum RabbitExchangeType {
  Direct = 'direct',
  Fanout = 'fanout',
  Header = 'header',
  Topic = 'topic'
}

type RabbitConfig = {
  fqdn: string;
  exchangeName: string;
};

export class RabbitDirectBroker implements DirectBroker {
  private connection: rabbit.Connection | undefined;
  private channel: rabbit.ConfirmChannel | undefined;

  constructor(private config: RabbitConfig) {
    this.connection = undefined;
  }

  async setup() {
    this.connection = await rabbit.connect(this.config.fqdn);
    this.channel = await this.connection.createConfirmChannel();
    await this.channel.assertExchange(`${this.config.exchangeName}.direct`, RabbitExchangeType.Direct, { durable: true });
  }

  async publish<T>(event: Event, message: T): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.channel == undefined) {
        return reject(`channel not initialized (did you call setup method?)`);
      }

      await this.channel.assertQueue(event, { durable: true });

      this.channel.sendToQueue(event, Buffer.from(JSON.stringify(message)), undefined, () => {
        return resolve();
      });
    });
  }

  async subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void> {
    if (this.channel == undefined) {
      throw new Error(`channel not initialized (did you call setup method?)`);
    }

    await this.channel.assertQueue(event, { durable: true });
    this.channel.prefetch(1);
    this.channel.consume(event, async (msg) => {
      if (this.channel == undefined) {
        return Promise.reject(`channel not initialized (did you call setup method?)`);
      }

      if (msg == null) {
        return Promise.reject(`no more messages`);
      }
      const message = JSON.parse(msg.content.toString()) as T;

      await handler(message);
      this.channel.ack(msg);
      return Promise.resolve();
    });

    return Promise.resolve();
  }

  async close(): Promise<void> {
    if (this.connection !== undefined) {
      await this.connection.close();
    }
    return Promise.resolve();
  }
}
