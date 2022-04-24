import axios from 'axios';
import Storage from '../modules/storage';
import Time from '../modules/time';

export type Request = {
    url: string|any[],
    method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE',
    data?: any,
    refreshConsumed?: boolean,
    fakeAPI?: AnimationPlayState,
    headers?: any,
    external?: boolean,
    promise?: {resolve: any, reject: any}|null,
    isRefresh?: boolean,
    fullResponse?: boolean
}

export type HTTPError = {
    code: number,
    data: any,
    url: string
}

const arrayToFormData = (name: string, arr: any[]) => {
    let inputs : any = {}
    for(let i = 0; i < arr.length; ++i) {
        let obj = arr[i];
        if (typeof obj == 'object') {
            Object.keys(obj)
            .forEach((key: string) => {
                inputs[name + '[' + i + '].' + key] = obj[key];
            });
        } else {
            inputs[name + '[' + i + ']'] = obj;
        }
    }
    return inputs;
}

export default class http {

    getHeaders : (req: Request) => any = () => { return new Promise((resolve, reject) => {resolve({})}) };
    checkTokenExpired: (error: HTTPError) => Promise<boolean> = () => { return new Promise((resolve, reject) => { resolve(false) }) };
    doRefreshToken: (refreshToken: string) => Promise<boolean> = () => { return new Promise((resolve, reject) => { resolve(false); }) }
    
    private refreshingToken: boolean = false;
    private nextRequestIsRefresh: boolean = false;
    private pendingRequests : Request[] = [];

    // Tokens
    private token = '';
    private refreshToken = '';
    private validateToken: (token: string, refreshToken?: string) => Promise<boolean>;

    public ValidateToken() : Promise<boolean> {
        let token = Storage.get('token');
        let refreshToken = Storage.get('refreshToken');

        if (!token) {
            return new Promise((resolve, reject) => {
                resolve(false);
            });
        } else {
            return this.validateToken(token, refreshToken);
        }
    }

    setToken(token: string, refreshToken?: string) {
        this.token = token;
        Storage.set('token', token);

        if (refreshToken) {
            this.refreshToken = refreshToken;
            Storage.set('refreshToken', refreshToken)
        }
    }
    getToken() {
        if (this.token) return this.token;
        this.token = Storage.get('token');
        return this.token;
    }
    getRefreshToken() {
        if (this.refreshToken) return this.refreshToken;
        this.refreshToken = Storage.get('refreshToken');
        return this.refreshToken;
    }
    clearToken() {
        Storage.remove('token');
        Storage.remove('refreshToken');
    }
    /// For Development purpose only
    fakeTokens() {
        let token = Time.now().datetime();
        this.setToken(token, token);
    }
    //////////

    static request(req: Request) {
        let client = new http({
            apiMap: {_base: ''}
        });

        return client.req(req);
    }

    constructor(options: {
        apiMap?: any,
        headers?: (req: Request) => any,
        refreshToken?: (refreshToken: string) => Promise<boolean>,
        checkTokenExpired?: (error: HTTPError) => Promise<boolean>,
        validateToken?: (token: string, refreshToken?: string) => Promise<boolean>
    }) {

        if (options.headers) {
            this.getHeaders = options.headers;
        }
        if (options.refreshToken) {
            this.doRefreshToken = options.refreshToken;
        }
        if (options.checkTokenExpired) {
            this.checkTokenExpired = options.checkTokenExpired;
        }
            
        if (options.validateToken) {
            this.validateToken = options.validateToken;
        } else {

            // Fake token validation for development purpose
            this.validateToken = (token: string, refreshToken?: string) => {
                return new Promise((resolve, reject) => {

                    try {
                        let time = new Time(token);
                        let seconds = time.secondsPassed();

                        if (seconds < 5 * 60) {
                            // Token valid
                            resolve(true);
                        } else {

                            // Try to refresh
                            if (seconds < 24 * 60 * 60) {
                                let newTime = Time.now().datetime();
                                this.setToken(newTime, newTime);
                                resolve(true);
                            } else {
                                this.clearToken();
                                resolve(false);
                            }
                        }

                    } catch(e) {
                        resolve(true);
                    }

                });
            }
            
        }
    }

    req(request: Request) : Promise<any> {

        return new Promise((resolve, reject) => {

            request['isRefresh'] = this.nextRequestIsRefresh;
            this.nextRequestIsRefresh = false; 
            
            let data = request.data ? request.data : {}

            let urlparams = '';

            if (['GET', 'DELETE'].includes(request.method)) {
                let char = '?';
                Object.keys(data).forEach(k => {
                    urlparams += char + k + '=' + data[k];
                    char = '&';
                });
            }
    
            // Headers
            let defaultHeaders : any = {
                'Authorization': this.getToken(),
                'Content-Type': 'application/json'
            }

            this.getHeaders(request).then((headers: any) => {
    
                Object.keys(defaultHeaders).forEach((k: string) => {
                    if (!headers[k]) {
                        headers[k] = defaultHeaders[k];
                    }
                });

                if (request.headers) {
                    Object.keys(request.headers).forEach((k: string) => {
                        headers[k] = request.headers[k];
                    });
                }

                let dta : any = data;
                if (headers['Content-Type'] == 'multipart/form-data') {
                    let form = new FormData();
                    Object.keys(request.data).forEach((key: string) => {
                        if (!Array.isArray(request.data[key]))
                            form.append(key, request.data[key]);
                        else {
                            let obj = arrayToFormData(key, request.data[key]);
                            Object.keys(obj).forEach((name: string) => {
                                form.append(name, obj[name]);
                            });
                        }  
                    });
                    dta = form;
                }
        
                axios({
                    method: request.method,
                    url: request.url + urlparams,
                    data: dta,
                    headers: headers
                }).then( (response:any) => {
                    if (!request.fullResponse)
                        resolve(response.data);
                    else
                        resolve(response);
                }).catch((error: any) => {

                    let err : HTTPError = {
                        url: error.config.url,
                        code: error.response ? error.response.status : 0,
                        data: error.response ? error.response.data : {}
                    }

                    if (!this.refreshingToken) {

                        // Try to refresh token
                        this.checkTokenExpired(err)
                        .then( (expired: boolean) => {

                            if (expired) {

                                if (request.refreshConsumed) {
                                    if (request.promise) {
                                        request.promise.reject();
                                    } else {
                                        reject();
                                    }
                                    return;
                                }

                                this.refreshingToken = true;
                                request.refreshConsumed = true;
                                this.nextRequestIsRefresh = true;

                                this.doRefreshToken(this.getRefreshToken())
                                .then((refreshed: boolean) => {

                                    if (!refreshed) {
                                        for(let req of this.pendingRequests) {
                                            if (req.promise) {
                                                req.promise.reject();
                                            }
                                        }
                                        this.refreshingToken = false;
                                    } else {
                                        for(let req of this.pendingRequests) {
                                            this.req(req)
                                            .then((data) => {
                                                if (req.promise) {
                                                    req.promise.resolve(data);
                                                }
                                            }).catch(err => {
                                                if (req.promise) {
                                                    req.promise.reject(err);
                                                }
                                            });
                                        }
                                        this.refreshingToken = false;
                                    }

                                })
                                .catch((err) => {
                                    for(let req of this.pendingRequests) {
                                        if (req.promise) {
                                            req.promise.reject(err);
                                        }
                                    }
                                });

                                this.req(request).then((data:any) => {
                                    this.refreshingToken = false;
                                    resolve(data);
                                })
                                .catch(err2 => {
                                    this.refreshingToken = false;
                                    reject(err2);
                                });

                            } else {
                                reject(err);
                            }

                        });

                    } else {

                        if (!request.isRefresh) {
                            request.promise = {
                                resolve: resolve,
                                reject: reject
                            };
                            this.pendingRequests.push(request);
                        } else {
                            reject(err);
                        }

                    }

                });

            });

        });

    }

    /////

    public get(endpoint: string|any[], parameters = {}, headers = {}) : Promise<any> {
        return this.req({
            url: endpoint,
            method: 'GET',
            data: parameters,
            headers: headers
        });
    }

    public post(endpoint: string|any[], parameters = {}, headers = {}) : Promise<any> {
        return this.req({
            url: endpoint,
            method: 'POST',
            data: parameters,
            headers: headers
        });
    }

    public delete(endpoint: string|any[], parameters = {}, headers = {}) : Promise<any> {
        return this.req({
            url: endpoint,
            method: 'DELETE',
            data: parameters,
            headers: headers
        });
    }

    public put(endpoint: string|any[], parameters = {}, headers = {}) : Promise<any> {
        return this.req({
            url: endpoint,
            method: 'PUT',
            data: parameters,
            headers: headers
        });
    }

    public patch(endpoint: string|any[], parameters = {}, headers = {}) : Promise<any> {
        return this.req({
            url: endpoint,
            method: 'PATCH',
            data: parameters,
            headers: headers
        });
    }

    public multipart(req: Request) : Promise<any> {

        if (!req.headers) {
            req['headers'] = {}
        }

        req.headers['Content-Type'] = 'multipart/form-data';

        return this.req(req);
    }

}