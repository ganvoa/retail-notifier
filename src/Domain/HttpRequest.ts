type KeyVal = {
    readonly key: string;
    readonly val: string;
}

export type HttpRequest = {
    readonly url: string;
    readonly headers?: KeyVal[];
    readonly body?: string;
}