import AppComponent from './app-component';
import Config from './config';
import EventListener from './event-listener';

let AppPageClass = AppComponent.extend({

    methods: {
        setBreadcrumbs(breadcrumbs: any) {
    
            let items : {to: string, label: string, active: boolean}[] = []

            let acumulative = '';
    
            Object.keys(breadcrumbs).forEach((k: string) => {
                let path = '';
                let key = k;

                if (k == '~') {
                    path = acumulative;
                } else {
                    if (key[0] == '~') {
                        path = acumulative;
                        key = k.substr(1);
                    } else {
                        acumulative = '';
                    }
                    path += key[0] == '/' || path[path.length -1 ] == '/' ? key : ('/' + key);
                    acumulative = path;
                }

                items.push({
                    to: path,
                    label: breadcrumbs[k],
                    active: false
                });
            });

            if (items.length > 0) {
                items[items.length -1 ].active = true;
            }
    
            setTimeout(() => {
                EventListener.trigger('breadcrumbs', items);
            }, 10);
        }
    }

});

let comp = AppPageClass.extend({});
type VueType = typeof comp;

let AppPage = () : VueType => {

    return AppPageClass.extend({
        middleware: Config.defaultMiddleware,
        layout: Config.defaultLayout,
    })

}
export default AppPage;