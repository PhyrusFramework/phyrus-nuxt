
export default {

    /**
     * Get item from array using a dot notation
     * string.
     * 
     * @param array arr 
     * @param string key 
     * @returns {*} value
     */
    dotNotation(arr: any, key: string, defaultValue?: string|null) {
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
    },

    /**
     * Reverts an array
     * 
     * @param array arr 
     * @returns array
     */
    invertList(arr: Array<any>) {
        let inv = [];

        for(let i = arr.length - 1; i >= 0; --i) {
            inv.push(arr[i]);
        }

        return inv;
    },

     /**
     * Compare two objects recursively.
     * 
     * @param a
     * @param b 
     */
    areEqual(a: any, b: any) {

        if (!a) {
            if (!b) return true;
            return false;
        }
        if (!b) {
            if (!a) return true;
            return false;
        }

        if (Array.isArray(a)) {
            if (!Array.isArray(b)) return false;

            if (a.length != b.length) return false;

            for(let i = 0; i < a.length; ++i) {
                const ia = a[i];
                const ib = b[i];
                if (!this.areEqual(ia, ib)) return false;
            }
            return true;
        }

        if (typeof a == 'object') {
            if (typeof b != 'object') return false;

            const ka = Object.keys(a);
            const kb = Object.keys(b);
    
            if (ka.length != kb.length) return false;
    
            let equal = true;
            ka.forEach((k: string) => {
                if (!equal) return;

                let ia = a[k];
                let ib = b[k];
                equal = this.areEqual(ia, ib);
            });

            return equal;
        }

        return a == b;

    },

    /**
     * Generates a duplicate of an object
     * 
     * @param obj Object
     * @returns Object
     */
     copy(obj: any, recursive: boolean = false, arrays: boolean = true, tree: any[] = []) {
        let s: any = {};
        if (!obj) return s;
        Object.keys(obj).forEach((key: string) => {

            if (Array.isArray(obj[key])) {
                if (arrays)
                    s[key] = this.copyArray(obj[key]);
                else
                    s[key] = obj[key];
            }
            else if (typeof s[key] == 'object') {

                if (recursive) {
                    s[key] = this.copy(obj[key], recursive, arrays, tree);
                } else {
                    s[key] = obj[key];
                }

            } else {
                s[key] = obj[key];
            }
        });
        return s;
    },

    /**
     * Copy an array
     * 
     * @param arr 
     */
    copyArray(arr: any[], tree: any[] = []) {
        const newarr : any[] = [];

        for(let item of arr) {

            if (Array.isArray(item)) {
                newarr.push(this.copyArray(item, tree));
            }
            else if (typeof item == 'object') {
                newarr.push(this.copy(item, true, false, tree));
            }
            else {
                newarr.push(item);
            }

        }

        return newarr;
    },

    /**
     * Validates email format
     * 
     * @param email 
     * @returns bool
     */
    validateEmail(email: string) {
        if (!email) return false;
        if (email == "") return false;
        if (email.length < 4) return false;

        let c1 = email.indexOf("@");
        let c2 = email.lastIndexOf(".");
        if (c1 < 0) return false;
        if (c2 < 0) return false;
        if (c2 < c1) return false;

        return true;
    },

    /**
     * Appends items to list
     * 
     * @param array list 
     * @param array items
     * 
     * @returns array
     */
    addToList(list: any[]|null|undefined, items: any[], mapFunc?: (item: any) => any) {
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
    },

    /**
     * Generate a random string
     * 
     * @param int length 
     * @returns 
     */
    randomString(length = 10) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        return result;
    },

    /**
     * Generate a random number.
     * 
     * @param max 
     */
    rand(max: number = 100) {
        return Math.random() * max;
    },

    /**
     * Force an object to adapt the structure of another with default values.
     * 
     * @param obj 
     * @param defaultValues 
     * @returns object
     */
    force(obj: any, defaultValues: any) {

        let res : any = {};

        Object.keys(defaultValues).forEach((k: string) => {
            res[k] = obj[k] ? obj[k] : defaultValues[k];
        });

        return res;

    },

   
    /**
     * Merge two objects recursively.
     * 
     * @param objA 
     * @param objB 
     */
     merge(objA: any, objB: any, mergeArrays = false) {

        let aux : any = {};

        Object.keys(objA).forEach((key: string) => {

            if (Array.isArray(objA[key])) {

                if (objB[key] === undefined) {
                    aux[key] = objA[key];
                } else if (Array.isArray(objB[key]) && mergeArrays) {
                    let list : any[] = [];
                    for(let item of objA[key]) {
                        list.push(item);
                    } 
                    for(let item of objB[key]) {
                        list.push(item);
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
                    aux[key] = this.merge(objA[key], objB[key]);
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

    },

    /**
     * Detect if the bottom has been reached.
     * 
     * @param e Scroll event
     */
    scrollBottomReached(e: any, threshold : number = 50) {

        let top = e.target.scrollTop;
        let height = e.target.clientHeight;
        let scrollHeight = e.target.scrollHeight;
        let umbral = threshold ? threshold : 50;

        if (top + height >= scrollHeight - umbral) {

            return true;

        }

        return false;

    },

    /**
     * Convert a file from an input in a src for an img tag.
     * 
     * @param file
     */
    fileToSrc(file: any) : Promise<any> {

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
    
    },

    /**
     * Fetch local file.
     * 
     * @param path 
     * @returns 
     */
    fetchFile(path: string) : Promise<File> {
        return new Promise((resolve, reject) => {
            fetch(path)
            .then(r => r.blob())
            .then((blob: Blob) => {

                const format = blob.type;
                const mimes = this.getMIMETypes();

                let extension = '';
                const keys = Object.keys(mimes);
                for(let k of keys) {
                    if (mimes[k] == format) {
                        extension = '.' + k;
                        break;
                    }
                }

                const file = new File([blob], "file" + extension);
                resolve(file);
            })
            .catch(reject);
        })
    },

    /**
     * Make URL to a local file
     * 
     * @param file 
     * @returns string
     */
    fileToURL(file: File) {
        return URL.createObjectURL(file);
    },

    /**
     * 
     * Convert base64 image to blob/file to be uploaded.
     * 
     * @param src Base 64
     * @returns file
     */
     srcToFile(src: string, name: string = 'file') {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        const split = src.split(',');
        if (split[0].indexOf('base64') >= 0)
            byteString = window.atob(split[1]);
        else
            byteString = unescape(split[1]);
        // separate out the mime component
        var mimeString = split[0].split(':')[1].split(';')[0];
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
            else if (['application/pdf'].includes(mimeString)) {
                n += '.pdf';
            }
            else if (['text/plain'].includes(mimeString)) {
                n += '.txt';
            }
        }

        return new File([blob], n, {type:mimeString});
    },

    /**
     * Convert the first letter to uppercase
     * 
     * @param text 
     * @returns string
     */
    capitalize(text: string) {
        return text[0].toUpperCase() + text.substr(1);
    },

    /**
     * Generate a URL to a random image
     * 
     * @param width 
     * @param height 
     * @returns URL
     */
     randomImage(width = 250, height = 250, seed?: string) {
        return 'https://picsum.photos/seed/' + (seed ? seed : this.randomString(4)) + '/' + width + '/' + height;
    },
    
    /**
     * Check if filename has any of these extensions
     * 
     * @param filename 
     * @param extensions 
     * @returns boolean
     */
    hasExtension(filename: string, extensions: string|string[]) : boolean {

        let list = Array.isArray(extensions) ? extensions : [extensions];

        for(let s of list) {
            if (filename.includes('.' + s)) {
                return true;
            }
        }

        return false;
    },

    /**
     * Format number as text
     * 
     * @param num 
     * @param decimals
     * @returns 
     */
    formatNumber(num: number|string, decimals: number = 2) : string {
        if (!num) return '0';

        let n = num;
        if (typeof n == 'number') {
            if (decimals > 0)
                n = n.toFixed(decimals);
            else
                n = "" + Math.floor(n);
        }
        n = n.replace('.', ',');

        if (!n.includes(',')) {
            return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        }

        const parts = n.split(',');
        const ent = parts[0];
        const dec = parts[1];

        return ent.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') + ',' + dec;
        
    },

    /**
     * Get object of {extension: mime}
     * 
     * @returns 
     */
    getMIMETypes() : any {
        return {
          'txt' : 'text/plain',
          'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'doc' : 'application/msword',
          'pdf' : 'application/pdf',
          'jpg' : 'image/jpeg',
          'bmp' : 'image/bmp',
          'png' : 'image/png',
          'gif' : 'image/gif',
          'xls' : 'application/vnd.ms-excel',
          'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'rtf' : 'application/rtf',
          'ppt' : 'application/vnd.ms-powerpoint',
          'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'zip' : 'application/zip',
          'mp3' : 'audio/mp3',
          'mpeg': 'video/mpeg'
        }
    },

    /**
     * Get mime of extension
     * @param extension 
     * @returns 
     */
    getMimeType(extension: string) : string {
        const types = this.getMIMETypes();
        if (types[extension]) {
            return types[extension];
        }
        return 'text/plain';
    },

    /**
     * Detect mime of file path
     * 
     * @param file 
     */
    detectMime(file: string) : string {
        let parts = file.split('/');
        let last = parts[parts.length - 1];

        if (!last.includes('.')) {
            return 'application/pdf';
        }

        parts = last.split('.');
        last = parts[parts.length - 1];

        return this.getMimeType(last);
    },

    /**
     * Convert HTML text to plain text
     * 
     * @param htmlText 
     * @returns string
     */
    stripTags(htmlText: string) : string {
        let e = document.createElement('div');
        e.innerHTML = htmlText;
        return e.textContent ? e.textContent : '';
    },

    /**
     * Copy content to clipboard
     * 
     * @param content 
     */
    copyToClipboard(content: string) {
        navigator.clipboard.writeText(content);
    },

    /**
     * Download file
     * 
     * @param file
     */
    downloadFile(file: File) {
        const a = document.createElement('a');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(file);
        a.href = url;
        a.download = file.name;
        a.click();
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            a.remove();
        }, 0)
    },

    /**
     * Download blob
     * 
     * @param blob 
     * @param name 
     */
    downloadBlob(blob: Blob, name: string) {
        this.downloadFile(new File([blob], name));
    }

}