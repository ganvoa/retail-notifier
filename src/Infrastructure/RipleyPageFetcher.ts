import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";
import { sleep } from "./Helper";

export class RipleyPageFetcher implements RetailPageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://simple.ripley.cl/${this.department}?source=menu&page=${page}&s=mdco`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

    async getTotalCount(): Promise<number> {
        const url = `https://simple.ripley.cl/${this.department}?source=menu&page=1&s=mdco`;
        const response = await this.httpClient.get({ url: url });
        const match = response.body.match(/"totalResults"[\w\W]*?:(\d+)?[\w\W]*?,/);
        if (match == null) {
            return Promise.resolve(0);
        }
        return Promise.resolve(parseInt(match[1]));
    }
}