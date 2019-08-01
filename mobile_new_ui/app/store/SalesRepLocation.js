Ext.define('CoolerIoTMobile.store.SalesRepLocation', {
    extend: 'Ext.data.Store',
    config: {
        model: 'CoolerIoTMobile.model.SalesRepLocation',
        proxy: {
            type: 'ajax',
            url: Df.App.getController('Map', true),
            enablePagingParams: false,
            extraParams: {
                action: 'list',
                limit: 0,
                locationHavingIssue: true
            },
            reader: {
                type: 'json',
                rootProperty: 'records'
            }
        }
    }
});