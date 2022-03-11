import { HttpClient } from "../../Domain/HttpClient";
import { PageFetcher } from "../../Domain/PageFetcher";
import { sleep } from "../Helper";

export class ParisPageFetcher implements PageFetcher {

    constructor(
        private department: string,
        private httpClient: HttpClient
    ) { }

    async getTotalCount(): Promise<number> {
        return Promise.resolve(Number.POSITIVE_INFINITY);
    }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.paris.cl/${this.department}/?start=${offset}&sz=${limit}&prefn1=seller&prefv1=Paris.cl`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

}