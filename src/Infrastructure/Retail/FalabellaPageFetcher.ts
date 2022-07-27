import { HttpClient } from '../../Domain/HttpClient';
import { PageFetcher } from '../../Domain/PageFetcher';
import { RetailDepartment } from '../../Domain/RetailDepartment';
import { sleep } from '../Helper';

export class FalabellaPageFetcher implements PageFetcher {
  constructor(private department: RetailDepartment, private httpClient: HttpClient) {}

  async getTotalCount(): Promise<number> {
    return Promise.resolve(Number.POSITIVE_INFINITY);
  }

  async getPage(limit: number, offset: number, page: number): Promise<string> {
    const url = `https://www.falabella.com/s/browse/v1/listing/cl?f.derived.variant.sellerId=FALABELLA&facetSelected=true&page=${page}&categoryId=${
      this.department.slug.split('/')[0]
    }&categoryName=${this.department.slug.split('/')[1]}`;
    const response = await this.httpClient.get({ url: url });
    await sleep(2000);
    return Promise.resolve(response.body);
  }
}
