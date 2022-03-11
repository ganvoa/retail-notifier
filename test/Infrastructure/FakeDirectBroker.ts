import { DirectBroker } from "../../src/Domain/Broker";
import { Event } from "../../src/Domain/Event";
import { sleep } from "../../src/Infrastructure/Helper";

export class FakeDirectBroker implements DirectBroker {

    async setup() {
        return Promise.resolve();
    }

    async publish<T>(event: Event, message: any): Promise<void> {
        if (message.discountPercentage >= 75) {
            console.log(`${message.productId};${message.discountPercentage};${message.minPrice};${message.name};${message.productUrl}`);
        }
        return Promise.resolve();
    }

    async subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void> {
        return Promise.resolve();
    }

    async close(): Promise<void> {
        return Promise.resolve();
    }

}