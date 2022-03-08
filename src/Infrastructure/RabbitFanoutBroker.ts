import { DirectBroker, FanoutBroker } from "../Domain/Broker";
import rabbit from 'amqplib';
import { Event } from "../Domain/Event";

export enum RabbitExchangeType {
    Direct = "direct",
    Fanout = "fanout",
    Header = "header",
    Topic = "topic",
}

type RabbitConfig = {
    fqdn: string,
    exchangeName: string
}

export class RabbitFanoutBroker implements FanoutBroker {

    private connection: rabbit.Connection | undefined;
    private channel: rabbit.ConfirmChannel | undefined;

    constructor(private config: RabbitConfig) {
        this.connection = undefined;
    }

    async setup() {
        this.connection = await rabbit.connect(this.config.fqdn);
        this.channel = await this.connection.createConfirmChannel();
    }

    async publish<T>(event: Event, message: T): Promise<void> {
        if (this.channel == undefined) {
            throw new Error(`channel not initialized (did you call setup method?)`);
        }
        await this.channel.assertExchange(`${this.config.exchangeName}.fanout.${event}`, RabbitExchangeType.Fanout, { durable: true });
        return new Promise(async (resolve, reject) => {

            if (this.channel == undefined) {
                return reject(`channel not initialized (did you call setup method?)`);
            }
            this.channel.publish(`${this.config.exchangeName}.fanout.${event}`, '', Buffer.from(JSON.stringify(message)), undefined, () => {
                return resolve();
            });
        })
    }

    async subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void> {
        if (this.channel == undefined) {
            throw new Error(`channel not initialized (did you call setup method?)`);
        }
        await this.channel.assertExchange(`${this.config.exchangeName}.fanout.${event}`, RabbitExchangeType.Fanout, { durable: true });
        const assertQueue = await this.channel.assertQueue('', { exclusive: true });
        await this.channel.bindQueue(assertQueue.queue, `${this.config.exchangeName}.fanout.${event}`, '');
        this.channel.prefetch(1);
        this.channel.consume(assertQueue.queue, async msg => {
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