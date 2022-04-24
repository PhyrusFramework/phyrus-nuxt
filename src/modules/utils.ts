
export default class Utils {

    /**
     * Get item from array using a dot notation
     * string.
     * 
     * @param array arr 
     * @param string key 
     * @returns {*} value
     */
    static dotNotation(arr: any, key: string, defaultValue?: string|null) {
        if(!arr || !key) {
            return defaultValue !== undefined ? defaultValue : null;
        }

        if (!key.includes(".")) {
            if (arr[key]) return arr[key];
            return key;
        }
        let parts = key.split(".");
        let c = arr;
        for(let i = 0; i<parts.length - 1; ++i) {
            if (!c[parts[i]]) return defaultValue !== undefined  ? defaultValue : key;
            c = c[parts[i]];
        }
        let n = parts.length - 1;
        if (!c[parts[n]]) return defaultValue !== undefined  ? defaultValue : key;
        return c[parts[n]];
    }

    /**
     * Reverts an array
     * 
     * @param array arr 
     * @returns array
     */
    static invertList(arr: Array<any>) {
        let inv = [];

        for(let i = arr.length - 1; i >= 0; --i) {
            inv.push(arr[i]);
        }

        return inv;
    }

    /**
     * Generates a duplicate of an object
     * 
     * @param obj Object
     * @returns Object
     */
    static copy(obj: any, recursive?: boolean) {
        let s: any = {};
        if (!obj) return s;
        Object.keys(obj).forEach((key: string) => {

            if (typeof s[key] == 'object') {
                if (recursive) {
                    s[key] = Utils.copy(obj[key], true);
                } else {
                    s[key] = obj[key];
                }
            } else {
                s[key] = obj[key];
            }
        });
        return s;
    }

    /**
     * Validates email format
     * 
     * @param email 
     * @returns bool
     */
    static validateEmail(email: string) {
        if (!email) return false;
        if (email == "") return false;
        if (email.length < 4) return false;

        let c1 = email.indexOf("@");
        let c2 = email.lastIndexOf(".");
        if (c1 < 0) return false;
        if (c2 < 0) return false;
        if (c2 < c1) return false;

        return true;
    }

    /**
     * Appends items to list
     * 
     * @param array list 
     * @param array items
     * 
     * @returns array
     */
    static addToList(list: any[]|null|undefined, items: any[], mapFunc?: (item: any) => any) {
        let l = list;
        if (!l) l = items;
        else {
            for(let n of items) {
                if (mapFunc) {
                    l.push(mapFunc(n));
                } else {
                    l.push(n);
                }
            }
        }
        return l;
    }

    /**
     * Generate a random string
     * 
     * @param int length 
     * @returns 
     */
    static randomString(length = 10) {
        return Math.random().toString(36).substr(2, length);
    }

    /**
     * Generate a random number.
     * 
     * @param max 
     */
    static rand(max: number = 100) {
        return Math.random() * max;
    }

    /**
     * Force an object to adapt the structure of another with default values.
     * 
     * @param obj 
     * @param defaultValues 
     * @returns object
     */
    static force(obj: any, defaultValues: any) {

        let res : any = {};

        Object.keys(defaultValues).forEach((k: string) => {
            res[k] = obj[k] ? obj[k] : defaultValues[k];
        });

        return res;

    }

    /**
     * Merge two objects recursively.
     * 
     * @param objA 
     * @param objB 
     */
    static merge(objA: any, objB: any, mergeArrays = false) {

        let aux : any = {};

        Object.keys(objA).forEach((key: string) => {

            if (Array.isArray(objA[key])) {

                if (objB[key] === undefined) {
                    aux[key] = objA[key];
                } else if (Array.isArray(objB[key]) && mergeArrays) {
                    let list : any[] = [];
                    for(let item of objA[key]) {
                        aux[key].push(item);
                    } 
                    for(let item of objB[key]) {
                        aux[key].push(item);
                    }
                    aux[key] = list;
                } else {
                    aux[key] = objB[key];
                }

            } 
            else if (typeof objA[key] == 'object') {

                if (objB[key] === undefined) {
                    aux[key] = objA[key];
                } else if (typeof objB[key] == 'object') {
                    aux[key] = Utils.merge(objA[key], objB[key]);
                } else {
                    aux[key] = objB[key];
                }

            } 
            else {

                if (objB[key] !== undefined) {
                    aux[key] = objB[key];
                } else {
                    aux[key] = objA[key];
                }

            }

        });

        Object.keys(objB).forEach((key: string) => {

            if (aux[key] === undefined) {
                aux[key] = objB[key];
            }

        });

        return aux;

    }

    /**
     * Detect if the bottom has been reached.
     * 
     * @param e Scroll event
     */
    static scrollBottomReached(e: any, threshold : number = 50) {

        let top = e.target.scrollTop;
        let height = e.target.clientHeight;
        let scrollHeight = e.target.scrollHeight;
        let umbral = threshold ? threshold : 50;

        if (top + height >= scrollHeight - umbral) {

            return true;

        }

        return false;

    }

    /**
     * Convert a file from an input in a src for an img tag.
     * 
     * @param file
     */
    static fileToSrc(file: any) : Promise<any> {

        return new Promise((resolve, reject) => {

            let reader = new FileReader();
        
            reader.onloadend = function () {
                resolve(reader.result);
            }

            reader.onerror = function() {
                reject();
            }
            
            reader.readAsDataURL(file);

        });
    
    }

    /**
     * 
     * Convert base64 image to blob/file to be uploaded.
     * 
     * @param src Base 64
     * @returns file
     */
    static srcToFile(src: string, name: string = 'file') {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (src.split(',')[0].indexOf('base64') >= 0)
            byteString = window.atob(src.split(',')[1]);
        else
            byteString = unescape(src.split(',')[1]);
        // separate out the mime component
        var mimeString = src.split(',')[0].split(':')[1].split(';')[0];
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        let blob = new Blob([ia], {type:mimeString});

        let n = name + '';
        if (n == 'file') {
            if (['image/png'].includes(mimeString)) {
                n += '.png';
            }
            else if (['image/jpg', 'image/jpeg'].includes(mimeString)) {
                n += '.jpg';
            }
            else if (['image/gif'].includes(mimeString)) {
                n += '.gif';
            }
            else if (['video/mp4'].includes(mimeString)) {
                n += '.mp4';
            }
        }

        return new File([blob], n, {type:mimeString});
    }

    /**
     * Convert the first letter to uppercase
     * 
     * @param text 
     * @returns string
     */
    static capitalize(text: string) {
        return text[0].toUpperCase() + text.substr(1);
    }

    /**
     * Generate a URL to a random image
     * 
     * @param width 
     * @param height 
     * @returns URL
     */
     static randomImage(width = 250, height = 250, seed?: string) {
        return 'https://picsum.photos/seed/' + (seed ? seed : this.randomString(4)) + '/' + width + '/' + height;
    }
    
    /**
     * Check if filename has any of these extensions
     * 
     * @param filename 
     * @param extensions 
     * @returns boolean
     */
    static hasExtension(filename: string, extensions: string|string[]) : boolean {

        let list = Array.isArray(extensions) ? extensions : [extensions];

        for(let s of list) {
            if (filename.includes('.' + s)) {
                return true;
            }
        }

        return false;
    }

}