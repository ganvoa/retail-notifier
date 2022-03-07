export enum Event {
    ProductFound = 'ganvoa.retail.product-found',
    ProductStored = 'ganvoa.retail.product-stored',
}

export type EventMessage<T> = {
    message: T,
    event: Event
}