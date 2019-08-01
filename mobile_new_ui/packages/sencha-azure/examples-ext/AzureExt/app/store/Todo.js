Ext.define('AzureExt.store.Todo', {
    extend : 'Ext.data.Store',

    requires : [
        'AzureExt.model.Todo',
        'Ext.azure.Proxy'
    ],

    config : {
        model    : 'AzureExt.model.Todo',
        autoLoad : true,

        remoteSort   : true,
        remoteFilter : true,

        proxy : {
            type               : 'azure',
            tableName          : 'TodoItem',
            enablePagingParams : true
        }
    }
});