import { GetProductsByApartment } from "../src/Application/GetProductsByApartment";
import { Paginator } from "../src/Domain/Paginator";
import { ParisApartment } from "../src/Domain/ParisApartment";
import { FetchHttpClient } from "../src/Infrastructure/FecthHttpClient";
import { ParisPageFetcher } from "../src/Infrastructure/ParisPageFetcher";
import { ParisProductParser } from "../src/Infrastructure/ParisProductParser";
import { TwitterNotifier } from "../src/Infrastructure/TwitterNotifier";

const token = "token";
const twitterNotifier = new TwitterNotifier(token);
const httpClient = new FetchHttpClient();
const parisPageFetcher = new ParisPageFetcher(ParisApartment.Electro, httpClient);
const parisProductParser = new ParisProductParser();
const paginator = new Paginator(60, Number.MAX_SAFE_INTEGER, 0);

const app = new GetProductsByApartment(parisPageFetcher, parisProductParser, paginator, twitterNotifier);

app.start();