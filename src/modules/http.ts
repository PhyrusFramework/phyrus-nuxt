import axios from 'axios';
import Storage from '../modules/storage';

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

export type HTTPClient = {
    baseURL: string,
    nextRequestIsRefresh: boolean,
    globalHeaders: any,
    refreshingToken: boolean,
    checkTokenExpired: null | ((err: HTTPError) => Promise<boolean>),
    refreshToken: null | ((token?: string) => Promise<boolean>),
    tokens: null | {
        session: string,
        refresh: string|null
    },

    setToken: (token: string, refreshToken?: string) => void,
    logout: () => void,
    getToken: () => string | null,
    getRefreshToken: () => string | null,

    pendingRequests: Request[],

    get: (url: string, parameters?: any, headers?: any) => Promise<any>,
    post: (url: string, parameters?: any, headers?: any) => Promise<any>,
    put: (url: string, parameters?: any, headers?: any) => Promise<any>,
    delete: (url: string, parameters?: any, headers?: any) => Promise<any>,
    patch: (url: string, parameters?: any, headers?: any) => Promise<any>,

    req: (request: Request) => Promise<any>,
};

const generateHTTP = () : HTTPClient => {
    return {

        baseURL: '',
        nextRequestIsRefresh: false,
        globalHeaders: {},
        refreshingToken: false,
        checkTokenExpired: null,
        refreshToken: null,
        tokens: null,
        pendingRequests: [],
    
        setToken(token: string, refreshToken?: string) {
            this.tokens = {
                session: token,
                refresh: refreshToken ? refreshToken : null
            }
    
            Storage.set('session', btoa(JSON.stringify(this.tokens)));
        },

        logout() {
            Storage.remove('session');
        },
    
        getToken() {
            if (this.tokens) return this.tokens.session;
    
            const saved = Storage.get('session');
            if (!saved) return null;
    
            this.tokens = JSON.parse(atob(saved));
            if (!this.tokens || !this.tokens.session) return null;
            return this.tokens.session;
        },
    
        getRefreshToken() {
            if (this.tokens) return this.tokens.refresh;
    
            const saved = Storage.get('session');
            if (!saved) return null;
    
            this.tokens = JSON.parse(btoa(saved));
            if (!this.tokens || !this.tokens.refresh) return null;
            return this.tokens.refresh;
        },
    
        get(url: string, parameters = {}, headers = {}) : Promise<any> {
            return this.req({
                url: url,
                method: 'GET',
                data: parameters,
                headers: headers
            });
        },
    
        post(url: string, parameters = {}, headers = {}) : Promise<any> {
            return this.req({
                url: url,
                method: 'POST',
                data: parameters,
                headers: headers
            });
        },
    
        delete(url: string, parameters = {}, headers = {}) : Promise<any> {
            return this.req({
                url: url,
                method: 'DELETE',
                data: parameters,
                headers: headers
            });
        },
    
        put(url: string, parameters = {}, headers = {}) : Promise<any> {
            return this.req({
                url: url,
                method: 'PUT',
                data: parameters,
                headers: headers
            });
        },
    
        patch(url: string, parameters = {}, headers = {}) : Promise<any> {
            return this.req({
                url: url,
                method: 'PATCH',
                data: parameters,
                headers: headers
            });
        },
    
        req(request: Request) {
    
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
                let headers : any = {
                    'Authorization': this.getToken(),
                    'Content-Type': 'application/json'
                }
    
                Object.keys(this.globalHeaders)
                .forEach((key: string) => {
                    headers[key] = this.globalHeaders[key];
                });
    
                Object.keys(request.headers)
                .forEach((key: string) => {
                    headers[key] = request.headers[key];
                });
    
                let dta : any = data;
                if (headers['Content-Type'] == 'multipart/form-data') {
                    delete headers['Content-Type'];
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
                    url: this.baseURL + request.url + urlparams,
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

                    if (request.isRefresh) {
                        reject(err);
                        return;
                    }

                    if (!this.checkTokenExpired) {
                        reject(err);
                        return;
                    }

                    if (this.refreshingToken) {
                        request.promise = {
                            resolve: resolve,
                            reject: reject
                        }
                        this.pendingRequests.push(request);
                        return;
                    }

                    if (request.refreshConsumed) {
                        reject(err);
                        return;
                    }

                    this.checkTokenExpired(err)
                    .then( (expired: boolean) => {

                        if (!expired) {
                            reject(err);
                            return;
                        }

                        this.refreshingToken = true;
                        request.refreshConsumed = true;
                        this.nextRequestIsRefresh = true;

                        const finishPendingRequests = () => {
                            for(let r of this.pendingRequests) {
                                r.promise!.reject();
                            }
                            this.pendingRequests = [];
                        }

                        const tk = this.getRefreshToken();
                        
                        if (!tk) {
                            this.refreshingToken = false;
                            reject(err);
                            finishPendingRequests();
                        }

                        if (!this.refreshToken) {
                            reject(err);
                            return;
                        }

                        this.refreshToken!(tk ? tk : undefined)
                        .then((refreshed) => {

                            this.refreshingToken = false;

                            if (!refreshed) {
                                reject(err);
                                finishPendingRequests();
                                return;
                            }

                            this.req(request);
                            for(let r of this.pendingRequests) {
                                this.req(r);
                            }
                            this.pendingRequests = [];

                        })
                        .catch(() => {
                            this.refreshingToken = false;
                            reject(err);
                            finishPendingRequests();
                        })
                        

                    })
                    .catch(() => reject(err));
    
                });
    
            });
    
        }
    
    };
}

const http : HTTPClient = generateHTTP();
const ajax : HTTPClient = generateHTTP();
ajax.baseURL = window.location.protocol + "//" + window.location.host.replace(':3000', '');

export { http, ajax };