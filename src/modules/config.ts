
export default class Config {

    /// ATTRIBUTES

    static title: string = '';
    static mainPage: string = '/';
    static defaultLanguage: string;
    static defaultLayout: string = 'default';
    static defaultMiddleware: string = 'default';
    static _original: any = {}

    // CONSTRUCTOR

    static init(config: any) {

        this._original = config;

        if (config.title) this.title = config.title;
        if (config.mainPage) this.mainPage = config.mainPage;
        if (config.defaultLanguage) this.defaultLanguage = config.defaultLanguage;
        else this.defaultLanguage = navigator.language.substr(0, 2);
        if (config.defaultLayout) this.defaultLayout = config.defaultLayout;
        if (config.defaultMiddleware) this.defaultMiddleware = config.defaultMiddleware;
        if (config.googleFonts) {
            for(let font of config.googleFonts) {
                if (!font.applyTo) continue;
    
                if (font.applyTo == '*') {
                    document.body.style.setProperty("font-family", font.family + ", sans-serif");
                } else {
                    let style = document.createElement('style');
                    style.innerHTML = font.applyTo + " { font-family: '" + font.family + "' }";
                    document.getElementsByTagName('head')[0].appendChild(style);
                }
            }
        }
    }

    static get() : any {
        return this._original;
    }

}