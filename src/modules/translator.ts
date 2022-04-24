import Utils from './utils';
import { locales as def } from './locales/locales';

class Translator {

    locales: any;
    currentLanguage = 'en';
    translations : any = {}

    initialize(locales: any, defaultLanguage: string) {

        Object.keys(locales).forEach((lang: string) => {
            if (!def[lang]) return;
            locales[lang] = Utils.merge(def[lang], locales[lang]);
        });
        this.locales = locales;

        var userLang = navigator.language.substr(0, 2);
        this.currentLanguage = (Object.keys(locales)).includes(userLang) ?
            userLang : defaultLanguage;

        this.translations = locales[this.currentLanguage];
    }

    changeLanguage(language: string) {
        if (!(Object.keys(this.locales)).includes(language)) return;
        this.currentLanguage = language;
        this.translations = this.locales[this.currentLanguage];
    }

    get(key: string, parameters?: any) {
        let trans = Utils.dotNotation(this.translations, key);

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