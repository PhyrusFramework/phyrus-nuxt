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
    fullResponse?: boolean,
    responseType?: 'json'|'blob'|'text'
}

export type HTTPError = {
    code: number,
    data: any,
    url: string,
    headers: any
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
                        urlparams += char + k + '=' + encodeURIComponent(data[k]);
                        char = '&';
                    });
                }
    
                // Headers
                let headers : any = {
                    'Content-Type': 'application/json'
                }

                const tk = this.getToken();
                if (tk) {
                    headers['Authorization'] = tk;
                }
    
                Object.keys(this.globalHeaders)
                .forEach((key: string) => {
                    headers[key] = this.globalHeaders[key];
                });
    
                if (request.headers) {
                    Object.keys(request.headers)
                    .forEach((key: string) => {
                        headers[key] = request.headers[key];
                    });
                }
    
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
                else if (headers['Content-Type'] == 'application/x-www-form-urlencoded') {
                    dta = new URLSearchParams(request.data);
                }
    
                axios({
                    method: request.method,
                    url: this.baseURL + request.url + urlparams,
                    data: dta,
                    headers: headers,
                    responseType: request.responseType ? request.responseType : 'json'
                }).then( (response:any) => {

                    const success = request.promise ? request.promise.resolve : resolve;
                    const fail = request.promise ? request.promise.reject : reject;

                    if (!request.fullResponse)
                        success(response.data);
                    else
                        fail(response);
                        
                }).catch((error: any) => {
    
                    let err : HTTPError = {
                        url: error.config.url,
                        code: error.response ? error.response.status : 0,
                        data: error.response ? error.response.data : {},
                        headers: error.response ? error.response.headers : {}
                    }

                    if (request.isRefresh) {
                        reject(err);
                        return;
                    }

                    if (!this.checkTokenExpired) {
                        reject(err);
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

                        const tk = this.getRefreshToken();
                        
                        if (!tk) {
                            this.refreshingToken = false;
                            reject(err);
                        }

                        if (!this.refreshToken) {
                            reject(err);
                            return;
                        }

                        request.promise = {
                            resolve: resolve,
                            reject: reject
                        }
                        this.pendingRequests.push(request);

                        if (this.refreshingToken) {
                            return;
                        }

                        this.refreshingToken = true;
                        request.refreshConsumed = true;
                        this.nextRequestIsRefresh = true;

                        this.refreshToken!(tk ? tk : undefined)
                        .then((refreshed) => {

                            this.refreshingToken = false;

                            if (!refreshed) {
                                for(let r of this.pendingRequests) {
                                    r.promise!.reject();
                                }
                                return;
                            }

                            for(let r of this.pendingRequests) {
                                this.req(r);
                            }
                            
                            this.pendingRequests = [];

                        })
                        .catch(() => {
                            this.refreshingToken = false;
                            for(let r of this.pendingRequests) {
                                r.promise!.reject();
                            }
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