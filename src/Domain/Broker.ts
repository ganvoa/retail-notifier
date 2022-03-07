export interface Broker {
    publish<T>(event: T): Promise<void>;
    subscribe<T>(handler: (object: T) => Promise<void>): void;
    close(): Promise<void>;
}