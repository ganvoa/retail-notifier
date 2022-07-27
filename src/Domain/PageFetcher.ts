export interface PageFetcher {
  getPage(limit: number, offset: number, page: number): Promise<string>;
  getTotalCount(): Promise<number>;
}
