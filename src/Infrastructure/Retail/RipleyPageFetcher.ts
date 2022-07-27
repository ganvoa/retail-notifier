import { HttpClient } from '../../Domain/HttpClient';
import { PageFetcher } from '../../Domain/PageFetcher';
import { RetailDepartment } from '../../Domain/RetailDepartment';
import { sleep } from '../Helper';

export class RipleyPageFetcher implements PageFetcher {
  constructor(private department: RetailDepartment, private httpClient: HttpClient) {}

  async getPage(limit: number, offset: number, page: number): Promise<string> {
    const url = `https://simple.ripley.cl/${this.department.slug}?source=menu&page=${page}&s=mdco`;
    const response = await this.httpClient.get({ url: url });
    await sleep(2000);
    return Promise.resolve(response.body);
  }

  async getTotalCount(): Promise<number> {
    const url = `https://simple.ripley.cl/${this.department.slug}?source=menu&page=1&s=mdco`;
    const response = await this.httpClient.get({ url: url });
    const match = response.body.match(/"totalResults"[\w\W]*?:(\d+)?[\w\W]*?,/);
    if (match == null) {
      return Promise.resolve(0);
    }
    return Promise.resolve(parseInt(match[1]));
  }
}
