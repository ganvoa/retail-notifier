import { HttpClient } from "../Domain/HttpClient";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";
import { sleep } from "./Helper";

export class FalabellaPageFetcher implements RetailPageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.falabella.com/s/browse/v1/listing/cl?f.derived.variant.sellerId=FALABELLA&facetSelected=true&page=${page}&categoryId=${this.department.split('/')[0]}&categoryName=${this.department.split('/')[1]}`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }
}