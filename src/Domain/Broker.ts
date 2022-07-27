import { Event } from './Event';

export interface DirectBroker {
  publish<T>(event: Event, message: T): Promise<void>;
  subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void>;
  close(): Promise<void>;
}
export interface FanoutBroker {
  publish<T>(event: Event, message: T): Promise<void>;
  subscribe<T>(event: Event, handler: (message: T) => Promise<void>): Promise<void>;
  close(): Promise<void>;
}
