import { HttpClient } from "../Domain/HttpClient";
import { HttpRequest } from "../Domain/HttpRequest";
import { HttpResponse } from "../Domain/HttpResponse";
import axios from 'axios';

export class FetchHttpClient implements HttpClient {

    async get(req: HttpRequest): Promise<HttpResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const { data, status } = await axios.get(req.url);
                return resolve({
                    statusCode: status,
                    body: data
                })
            } catch (e) {
                return reject(e);
            }
        });
    }

}