import { DirectBroker } from "../../src/Domain/Broker";
import { mock, when, instance, anything } from 'ts-mockito';
import { HttpClient } from "../../src/Domain/HttpClient";
import { Department } from "../../src/Domain/Department";
import { AbcdinPageFetcher } from "../../src/Infrastructure/Retail/AbcdinPageFetcher";
import { AbcdinProductParser } from "../../src/Infrastructure/Retail/AbcdinProductParser";
import { Paginator } from "../../src/Domain/Paginator";
import { ProductFinder } from "../../src/Application/ProductFinder";
import { Abcdin } from "../../src/Infrastructure/Retail/Abcdin";

describe('Product Finder', () => {
    it('should find abcdin products', async () => {
        let mockedBroker: DirectBroker = mock<DirectBroker>();
        const broker: DirectBroker = instance(mockedBroker);
        let mockedHttpClient: HttpClient = mock<HttpClient>();
        when(mockedHttpClient.get(anything())).thenReturn(Promise.resolve({
            body: `toolbar-number">30</`,
            statusCode: 200
        }));
        const httpClient: HttpClient = instance(mockedHttpClient);
        const department = {
            iterable: true,
            department: Department.Muebles,
            minDiscount: 60,
            slug: 'test'
        };
        const pageFetcher = new AbcdinPageFetcher(department, httpClient);
        const totalCount = await pageFetcher.getTotalCount();
        const productParser = new AbcdinProductParser(department);
        const paginator = new Paginator(Abcdin.ITEMS_PER_PAGE, totalCount);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        await app.start();
        await broker.close();
        expect(totalCount).toBe(30);
    })
})