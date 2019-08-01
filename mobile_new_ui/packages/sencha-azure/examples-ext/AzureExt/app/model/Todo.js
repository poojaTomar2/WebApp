Ext.define('AzureExt.model.Todo', {
    extend : 'Ext.data.Model',

    fields : [
        {
            type : 'int',
            name : 'id'
        },
        {
            type : 'string',
            name : 'text'
        },
        {
            type : 'boolean',
            name : 'complete'
        }
    ]
});