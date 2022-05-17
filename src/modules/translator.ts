import Utils from './utils';

class Translator {

    locales: any;
    currentLanguage = 'en';
    translations : any = {}

    initialize(locales: any, defaultLanguage: string) {
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