import { DirectBroker } from "../../src/Domain/Broker";
import { mock, when, instance, anything, verify, anyNumber, anyString } from 'ts-mockito';
import { HttpClient } from "../../src/Domain/HttpClient";
import { Department } from "../../src/Domain/Department";
import { AbcdinPageFetcher } from "../../src/Infrastructure/Retail/AbcdinPageFetcher";
import { AbcdinProductParser } from "../../src/Infrastructure/Retail/AbcdinProductParser";
import { Paginator } from "../../src/Domain/Paginator";
import { ProductFinder } from "../../src/Application/ProductFinder";
import { Abcdin } from "../../src/Infrastructure/Retail/Abcdin";
import * as fs from 'fs';
import { Event } from "../../src/Domain/Event";
import { PageFetcher } from "../../src/Domain/PageFetcher";
import { ProductParser } from "../../src/Domain/ProductParser";
import { Product } from "../../src/Domain/Product";
import { Retail } from "../../src/Domain/Retail";

beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

describe('Product Finder', () => {
    it('should find products', async () => {
        let mockedBroker: DirectBroker = mock<DirectBroker>();
        const broker: DirectBroker = instance(mockedBroker);

        let mockedPageFetcher: PageFetcher = mock<PageFetcher>();
        const pageFetcher: PageFetcher = instance(mockedPageFetcher);

        const products: Product[] = [];
        const product: Product = {
            productId: '1234567',
            brand: 'generic',
            currentPrice: 10000,
            exclusivePrice: 5000,
            normalPrice: 10000,
            minPrice: 5000,
            department: Department.Tecnologia,
            discountPercentage: 50,
            name: 'Generic Product',
            retailId: Retail.Ripley,
            timestamp: Date.now(),
            valid: true,
            imageUrl: `https://home.ripley.cl/store/Attachment/WOP/D328/2000374180238/2000374180238_2.jpg`,
            productUrl: `https://simple.ripley.cl/set-body-secret-mandala-2000374180238p`,
            shouldNotify: false,
            shouldStore: true
        };

        for (let index = 0; index < 16; index++) {
            let pr = product;
            pr.productId = pr.productId + index;
            products.push(pr);
        }

        let mockedProductParser: ProductParser = mock<ProductParser>();
        when(mockedProductParser.getAll(anyString())).thenReturn(products);
        const productParser: ProductParser = instance(mockedProductParser);
        const paginator = new Paginator(16, 160);
        const app = new ProductFinder(pageFetcher, productParser, paginator, broker);
        await app.start();
        await broker.close();

        verify(mockedPageFetcher.getPage(16, anyNumber(), anyNumber())).times(16);
        verify(mockedBroker.publish(Event.ProductFound, anything())).times(160);
    })
})