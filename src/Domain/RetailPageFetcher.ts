export interface RetailPageFetcher {
    getPage(limit: number, offset: number, page: number): Promise<string>;
}