import { Broker } from "../Domain/Broker";
import rabbit from 'amqplib';

export enum RabbitExchangeType {
    Direct = "direct",
    Fanout = "fanout",
    Header = "header",
    Topic = "topic",
}

type RabbitConfig = {
    fqdn: string,
    exchangeName: string,
    queueName: string,
    exchangeType: RabbitExchangeType
}

export class RabbitMqBroker implements Broker {

    private connection: rabbit.Connection | undefined;
    private channel: rabbit.ConfirmChannel | undefined;

    constructor(private config: RabbitConfig) {
        this.connection = undefined;
    }

    async setup() {
        this.connection = await rabbit.connect(this.config.fqdn);
        this.channel = await this.connection.createConfirmChannel();
        await this.channel.assertExchange(this.config.exchangeName, this.config.exchangeType, { durable: true });
        await this.channel.assertQueue(this.config.queueName, { durable: true });
    }

    async publish<T>(message: T): Promise<void> {
        return new Promise((resolve, reject) => {

            if (this.channel == undefined) {
                return reject(`channel not initialized (did you call setup method?)`);
            }

            this.channel.sendToQueue(this.config.queueName, Buffer.from(JSON.stringify(message)), undefined, () => {
                return resolve();
            });
        })
    }

    subscribe<T>(handler: (object: T) => Promise<void>): void {

        if (this.channel == undefined) {
            throw new Error(`channel not initialized (did you call setup method?)`);
        }
        this.channel.prefetch(1);
        this.channel.consume(this.config.queueName, async msg => {
            if (this.channel == undefined) {
                return Promise.reject(`channel not initialized (did you call setup method?)`);
            }

            if (msg == null) {
                return Promise.reject(`no more messages`);
            }
            const object = JSON.parse(msg.content.toString()) as T;
            await handler(object);
            this.channel.ack(msg);
            return Promise.resolve();
        });

        return;
    }

    async close(): Promise<void> {
        if (this.connection !== undefined) {
            await this.connection.close();
        }
        return Promise.resolve();
    }

}