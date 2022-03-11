import { DirectBroker } from "../../src/Domain/Broker";
import { Event } from "../../src/Domain/Event";
import { sleep } from "../../src/Infrastructure/Helper";

export class FakeDirectBroker implements DirectBroker {

    async setup() {
        return Promise.resolve();
    }

    async publish<T>(event: Event, message: T): Promise<void> {
        console.log(message);
        await sleep(1000);
        return Promise.resolve();
    }

    async subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void> {
        return Promise.resolve();
    }

    async close(): Promise<void> {
        return Promise.resolve();
    }

}