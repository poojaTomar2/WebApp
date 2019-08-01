/**
 * The Azure AuthOptions class displays the available authentication options for users of your application.
 * These options are defined on Ext.Azure via the authIdentities config.
 *
 */
Ext.define('Ext._azure_ext.AuthOptions', {
    extend : 'Ext.window.Window',

    requires : [
        'Ext.button.Button'
    ],

    plain : true,
    modal : true,

    autoHeight : true,
    width      : 200,

    layout : {
        type  : 'vbox',
        align : 'stretch'
    },

    title : 'Authentication',

    /**
     * @constructor
     */

    constructor : function (config) {
        var me = this,
            i = 0,
            authIdentities = Ext.Azure.getAuthIdentities(),
            len = authIdentities.length,
            items = [];

        //in case there is no config passed
        config = config || {};

        for (i; i < len; i++) {
            switch (authIdentities[i].toLowerCase()) {
                case 'microsoft':
                    items.push({
                        xtype   : 'button',
                        text    : 'Microsoft',
                        handler : Ext.Function.bind(me.microsoftHandler, me)
                    });
                    break;

                case 'facebook':
                    items.push({
                        xtype   : 'button',
                        text    : 'Facebook',
                        handler : Ext.Function.bind(me.facebookHandler, me)
                    });
                    break;

                case 'google':
                    items.push({
                        xtype   : 'button',
                        text    : 'Google',
                        handler : Ext.Function.bind(me.googleHandler, me)
                    });
                    break;

                case 'twitter':
                    items.push({
                        xtype   : 'button',
                        text    : 'Twitter',
                        handler : Ext.Function.bind(me.twitterHandler, me)
                    });
                    break;
            }
        }

        if (items.length > 0) {
            config.items = items;
        }

        me.callParent([config]);
    },

    microsoftHandler : function () {
        Ext.azure.Authentication.login('microsoftaccount');
        this.destroy();
    },

    facebookHandler : function () {
        Ext.azure.Authentication.login('facebook');
        this.destroy();
    },

    googleHandler : function () {
        Ext.azure.Authentication.login('google');
        this.destroy();
    },

    twitterHandler : function () {
        Ext.azure.Authentication.login('twitter');
        this.destroy();
    }
}, function () {
    //forcibly create the class
    Ext.azure.AuthOptions = this;
});