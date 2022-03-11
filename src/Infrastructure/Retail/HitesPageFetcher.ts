import { HttpClient } from "../../Domain/HttpClient";
import { PageFetcher } from "../../Domain/PageFetcher";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { sleep } from "../Helper";

export class HitesPageFetcher implements PageFetcher {

    constructor(
        private department: RetailDepartment,
        private httpClient: HttpClient
    ) { }

    async getTotalCount(): Promise<number> {
        return Promise.resolve(Number.POSITIVE_INFINITY);
    }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://www.hites.com/${this.department.slug}/?start=${offset}&sz=${limit}`;
        const response = await this.httpClient.get({ url: url });
        await sleep(500);
        return Promise.resolve(response.body);
    }

}