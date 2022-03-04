import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";
import { sleep } from "./Helper";

export class ParisPageFetcher implements RetailPageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.paris.cl/${this.department}/?start=${offset}&sz=${limit}&prefn1=seller&prefv1=Paris.cl`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

}