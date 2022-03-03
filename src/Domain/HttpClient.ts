import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

export interface HttpClient {
    get(req: HttpRequest): Promise<HttpResponse>;
}