import { HttpClient } from "../Domain/HttpClient";
import { HttpRequest } from "../Domain/HttpRequest";
import { HttpResponse } from "../Domain/HttpResponse";
import axios from 'axios';
import { sleep } from "./Helper";

export class FetchHttpClient implements HttpClient {

    async get(req: HttpRequest): Promise<HttpResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const { data, status } = await axios.get(req.url, {
                    headers: {
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
                    }
                });
                return resolve({
                    statusCode: status,
                    body: data
                })
            } catch (e: any) {
                console.error(e);
                if (e && e.response && e.response.status) {
                    if (e.response.status == 429) {
                        console.log('quota exceeded, waiting 120 seconds...');
                        await sleep(120000);
                    } else {
                        return resolve({
                            statusCode: e.response.status,
                            body: ''
                        });
                    }
                }

                try {
                    const { data, status } = await axios.get(req.url, {
                        headers: {
                            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36'
                        }
                    });
                    return resolve({
                        statusCode: status,
                        body: data
                    })
                } catch (e: any) {
                    console.error(e);
                    if (e && e.response && e.response.status) {
                        return resolve({
                            statusCode: e.response.status,
                            body: ''
                        });
                    } else {
                        return resolve({
                            statusCode: 0,
                            body: ''
                        });
                    }
                }
            }
        });
    }

    async post(req: HttpRequest): Promise<HttpResponse> {
        return new Promise(async (resolve, reject) => {
            try {
                const { data, status } = await axios.post(req.url, req.body, {
                    headers: {
                        'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                        'Content-Type': 'application/json'
                    },
                });
                return resolve({
                    statusCode: status,
                    body: data
                })
            } catch (e: any) {

                if (e.hasOwnProperty("response")) {
                    if (e.response.status == 429) {
                        console.log('quota exceeded, waiting 120 seconds...');
                        await sleep(120000);
                    } else {
                        return resolve({
                            statusCode: e.response.status,
                            body: ''
                        });
                    }
                }

                try {
                    const { data, status } = await axios.post(req.url, req.body, {
                        headers: {
                            'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36',
                            'Content-Type': 'application/json'
                        },
                    });
                    return resolve({
                        statusCode: status,
                        body: data
                    })
                } catch (e: any) {
                    if (e.hasOwnProperty("response")) {
                        return resolve({
                            statusCode: e.response.status,
                            body: ''
                        });
                    } else {
                        return resolve({
                            statusCode: 0,
                            body: ''
                        });
                    }
                }
            }
        });
    }

}