import translate from '../../modules/translator'

type TableOptionals = {
    loadData: (filters: any) => Promise<any>,
    columns: {
        key: string, 
        label: string,
        width?: number, 
        flex?: number,
        component?: any, 
        props?: (item: any) => any, 
        value?: (item: any, index: number) => string,
        center?: boolean,
        paddingLeft?: number,
        sortable?: boolean,
        click?: (item: any) => void
    }[],
    itemOptions?: (item: any) => {
        icon?:string, 
        iconSource?: string,
        label: string,
        onSelected?: (model?: any) => void
    }[],
    selectedOptions?: () => {
        icon?:string, 
        iconSource?: string,
        label: string,
        onSelected?: (models?: any[]) => void
    }[],
    order?: {
        column?: string,
        order?: 'DESC'|'ASC'
    },
    pagination?: {
        page?: number,
        totalPages?: number,
        offset?: number,
        perPage?: number
    },
    settings?: {
        pagination?: boolean,
        perPageConfigurable?: boolean,
        sortable?: boolean,
        columnsSortable?: boolean,
        displayHeader?: boolean,
        emptyMessage?: string,
        rowClass?: (model: any) => any,
        draggable?: boolean,
        rowClick?: (model: any) => any
    }
}

export type Table = {
    loadData: (filters: any) => Promise<any>,
    columns: {
        key: string, 
        label: string,
        width?: number, 
        flex?: number,
        component?: any,
        props?: (item: any) => any,
        value?: (item: any, index: number) => string,
        center?: boolean,
        paddingLeft?: number,
        sortable?: boolean,
        click?: (item: any) => void
    }[],
    itemOptions?: (item: any) => {
        icon?:string, 
        iconSource?: string,
        label: string,
        onSelected?: (model?: any) => void
    }[],
    selecteds: any[],
    selectedOptions?: () => {
        icon?:string, 
        iconSource?: string,
        label: string,
        onSelected?: (models?: any[]) => void
    }[],
    order: {
        column: string|null,
        order: 'DESC'|'ASC'
    },
    pagination: {
        page: number,
        totalPages: number,
        offset: number,
        perPage: number
    },
    items: any[]|null,
    settings: {
        pagination: boolean,
        perPageConfigurable: boolean,
        columnsSortable: boolean,
        displayHeader: boolean,
        emptyMessage: string,
        rowClass: (model: any) => any,
        draggable: boolean,
        rowClick: (model: any) => any
    },

    filters: any,

    _ref: null|any,
    update: () => void,     // Render again
    refresh: () => void,    // Re-fetch values from API
    reload: (ref?: any) => void,      // Both
    setPage: (page: number|'+1'|'-1', reload?: boolean) => void,
    setPageData: (options: {
        totalPages?: number,
        totalItems?: number,
        perPage?: number
    }) => void,
    setFilter: (key: string, value: any, refresh?: boolean) => void
}

export default class TableBuilder {

    static build(tableConfig: TableOptionals) : Table {

        let table : Table = {
            loadData: tableConfig.loadData,
            itemOptions: tableConfig.itemOptions,
            selectedOptions: tableConfig.selectedOptions,
            selecteds: [],
            columns: tableConfig.columns,
            order: {
                column: tableConfig.order?.column ? tableConfig.order.column : null,
                order: tableConfig.order?.order ? tableConfig.order.order : 'DESC',
            },
            pagination: {
                page: tableConfig?.pagination?.page ? tableConfig.pagination?.page : 1,
                offset: tableConfig?.pagination?.offset ? tableConfig?.pagination?.offset : 0,
                totalPages: tableConfig?.pagination?.totalPages ? tableConfig?.pagination?.totalPages : 0,
                perPage: tableConfig?.pagination?.perPage ? tableConfig?.pagination?.perPage : 10,
            },
            items: null,
            settings: {
                pagination: tableConfig.settings && tableConfig.settings.pagination === false ? false : true,
                perPageConfigurable: tableConfig.settings && tableConfig.settings.perPageConfigurable ? true : false,
                columnsSortable: tableConfig.settings && tableConfig.settings.columnsSortable === true ? true : false,
                displayHeader: tableConfig.settings && tableConfig.settings.displayHeader === false ? false : true,
                emptyMessage: tableConfig.settings && tableConfig.settings.emptyMessage ?
                        tableConfig.settings.emptyMessage : translate.get('table.empty'),
                rowClass: tableConfig.settings && tableConfig.settings.rowClass ?
                        tableConfig.settings && tableConfig.settings.rowClass : () => {},
                draggable: tableConfig.settings && tableConfig.settings.draggable ? true : false,
                rowClick: tableConfig.settings && tableConfig.settings.rowClick ?
                    tableConfig.settings.rowClick : () => null
            },

            filters: {},

            _ref: null,
            update: () => {
                if (!table._ref) return;
                table._ref.initializeTable();
            },

            refresh: () => {
                if (!table._ref) return;
                table._ref.refreshData();
            },

            reload: (ref?: any) => {
                if (ref) {
                    table._ref = ref;
                }
                if (!table._ref) return;
                table._ref.Reload();
            },

            setPage(page: number|'+1'|'-1', reload: boolean = true) {
                if (!table._ref) return;
                table._ref.setPage(page, reload);
            },

            setPageData(options: {
                totalPages?: number,
                totalItems?: number,
                perPage?: number
            }, update: boolean = true) {
                if (!table._ref) return;
                
                if (options.totalPages != undefined) {
                    this.pagination.totalPages = options.totalPages;
                }

                if (options.perPage != undefined) {
                    this.pagination.perPage = options.perPage;
                }

                if (options.totalItems != undefined) {
                    this.pagination.totalPages = Math.ceil(options.totalItems / this.pagination.perPage );
                }

                if (update)
                    this.update();
            },

            setFilter(key: string, value: any, refresh: boolean = true) {

                this.filters[key] = value;
                if (value === null || value === undefined) {
                    delete this.filters[key];
                }

                if (refresh) {
                    this.refresh();
                }

            }
        }
        return table;

    }

}