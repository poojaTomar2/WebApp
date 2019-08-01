/**
 * Override for Ext, where we include Ext._azure_ext.* classes
 */
Ext.define('Ext.azure.override.Azure', {
    override : 'Ext.azure.Azure',

    requires : [
        'Ext.azure.Authentication',
        'Ext.azure.Proxy',

        'Ext._azure_ext.User',
        'Ext._azure_ext.AuthOptions',

        'Ext.azure.storage.Table',
        'Ext.azure.storage.Blob'
    ]
});