/**
 * Model defintion for authenticated user
 * @private
 */
Ext.define('Ext._azure_ext.User', {
    extend : 'Ext.data.Model',

    requires : [
        'Ext.data.proxy.LocalStorage'
    ],

    //Sencha Touch requires the "config" block, Ext JS 5 does not
    fields : [
        {
            name : 'id',
            type : 'string'
        },

        {
            name : 'token',
            type : 'string'
        },
        {
            name : 'authMethod',
            type : 'string'
        }
    ],

    proxy : {
        type : 'localstorage',
        id   : 'azure-user' //auto-generated with appKey in Ext.azure.Authentication.init()
    }
}, function () {
    Ext.azure.User = this;
});