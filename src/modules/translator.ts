import Utils from './utils';
import defaultLocales from '../translations/locales';

class Translator {

    locales: any;
    currentLanguage = 'en';
    translations : any = {}

    cache: any = {}

    initialize(locales: any, defaultLanguage: string) {
        this.locales = Utils.merge(defaultLocales, locales);

        var userLang = navigator.language.substr(0, 2);
        this.currentLanguage = (Object.keys(locales)).includes(userLang) ?
            userLang : defaultLanguage;

        this.translations = this.locales[this.currentLanguage];
    }

    changeLanguage(language: string) {
        if (!(Object.keys(this.locales)).includes(language)) return;
        this.cache = {};
        this.currentLanguage = language;
        this.translations = this.locales[this.currentLanguage];
    }

    get(key: string, parameters?: any) {
        let trans = 
        this.cache[key] ? this.cache[key] :
        Utils.dotNotation(this.translations, key);

        this.cache[key] = trans;

        if (parameters) {
            Object.keys(parameters).forEach((k: string) => {
                trans = trans.replace('{{' + k + '}}', parameters[k]);
            });
        }

        return trans;
    }

}
let translate = new Translator();
export default translate;