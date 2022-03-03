export interface RetailPageFetcher {
    getPage(limit: number, offset: number): Promise<string>;
}