import { HttpClient } from "../Domain/HttpClient";
import { ParisApartment } from "../Domain/ParisApartment";
import { RetailPageFetcher } from "../Domain/RetailPageFetcher";

export class ParisPageFetcher implements RetailPageFetcher {

    constructor(
        private apartment: ParisApartment,
        private httpClient: HttpClient
    ) { }

    async getPage(limit: number, offset: number): Promise<string> {
        const url = `https://www.paris.cl/${this.apartment}/?start=${offset}&sz=${limit}`;
        const response = await this.httpClient.get({ url: url });
        return Promise.resolve(response.body);
    }

}