import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";
import { sleep } from "./Helper";

export class HitesPageFetcher implements RetailPageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.hites.com/${this.department}/?start=${offset}&sz=${limit}`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

}