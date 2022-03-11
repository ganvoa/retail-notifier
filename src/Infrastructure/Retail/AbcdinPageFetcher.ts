import { HttpClient } from "../../Domain/HttpClient";
import { PageFetcher } from "../../Domain/PageFetcher";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { sleep } from "../Helper";

export class AbcdinPageFetcher implements PageFetcher {

    constructor(
        private department: RetailDepartment,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.abcdin.cl/${this.department.slug}/?p=${page}`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

    async getTotalCount(): Promise<number> {
        const url = `https://www.abcdin.cl/${this.department.slug}`;
        const response = await this.httpClient.get({ url: url });
        const match = response.body.match(/toolbar-number">(\d+)</m);
        if (match == null) {
            return Promise.resolve(0);
        }
        return Promise.resolve(parseInt(match[1]));
    }

}