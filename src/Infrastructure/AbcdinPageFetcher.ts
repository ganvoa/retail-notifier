import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";

export class AbcdinPageFetcher implements RetailPageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.abcdin.cl/${this.department}/?p=${page}`;
        const response = await this.httpClient.get({ url: url });
        return Promise.resolve(response.body);
    }

    async getTotalCount(): Promise<number> {
        const url = `https://www.abcdin.cl/${this.department}`;
        const response = await this.httpClient.get({ url: url });
        const match = response.body.match(/toolbar-number">(\d+)</m);
        if (match == null) {
            return Promise.resolve(0);
        }
        return Promise.resolve(parseInt(match[1]));
    }

}