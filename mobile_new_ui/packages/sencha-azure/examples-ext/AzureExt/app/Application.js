/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('AzureExt.Application', {
    extend: 'Ext.app.Application',

    requires : [
        'Ext.azure.Azure'
    ],
    
    name: 'AzureExt',

    controllers: [
        'Root'
    ],

    stores: [
        'Todo'
    ],

    config : {
        azure : {
            appUrl : 'YOUR_APP_URL.azure-mobile.net',
            appKey : 'YOUR_APP_KEY',

            authIdentities : [
                'twitter',
                'microsoft',
                'facebook',
                'google'
            ]
        }
    },
    
    launch: function () {
        Ext.Azure.init(this.config.azure);
    }
});
