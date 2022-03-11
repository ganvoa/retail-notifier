import { HttpClient } from "../../Domain/HttpClient";
import { PageFetcher } from "../../Domain/PageFetcher";
import { sleep } from "../Helper";

export class FalabellaPageFetcher implements PageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getTotalCount(): Promise<number> {
        return Promise.resolve(Number.POSITIVE_INFINITY);
    }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.falabella.com/s/browse/v1/listing/cl?f.derived.variant.sellerId=FALABELLA&facetSelected=true&page=${page}&categoryId=${this.department.split('/')[0]}&categoryName=${this.department.split('/')[1]}`;
        const response = await this.httpClient.get({ url: url });
        await sleep(2000);
        return Promise.resolve(response.body);
    }
}