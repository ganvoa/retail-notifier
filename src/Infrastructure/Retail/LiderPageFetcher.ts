import { HttpClient } from "../../Domain/HttpClient";
import { PageFetcher } from "../../Domain/PageFetcher";
import { RetailDepartment } from "../../Domain/RetailDepartment";
import { sleep } from "../Helper";

export class LiderPageFetcher implements PageFetcher {

    constructor(
        private department: RetailDepartment,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number, page: number): Promise<string> {
        const url = `https://buysmart-bff-production.lider.cl/buysmart-bff/category`;
        const response = await this.httpClient.post({
            url: url, body: JSON.stringify({
                "categories": this.department.slug,
                "page": page,
                "facets": [],
                "sortBy": "discount_desc",
                "hitsPerPage": limit
            })
        });
        await sleep(2000);
        return Promise.resolve(response.body);
    }

    async getTotalCount(): Promise<number> {
        return Promise.resolve(Number.POSITIVE_INFINITY);
    }
}