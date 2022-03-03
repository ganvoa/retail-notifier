import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";

export class ParisPageFetcher implements RetailPageFetcher {

    constructor(
        private apartment: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.paris.cl/${this.apartment}/?start=${offset}&sz=${limit}`;
        console.log(url);
        const response = await this.httpClient.get({ url: url });
        return Promise.resolve(response.body);
    }

}