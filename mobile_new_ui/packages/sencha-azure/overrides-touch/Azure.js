/**
 * Override for Sencha Touch, where we include Ext._azure_touch.* classes and apply "pushConfig"
 */
Ext.define('Ext.azure.override.Azure', {
    override : 'Ext.azure.Azure',

    requires : [
        'Ext.azure.Authentication',
        'Ext.azure.Proxy',

        'Ext._azure_touch.Push',
        'Ext._azure_touch.AuthOptions',
        'Ext._azure_touch.User',

        'Ext.azure.storage.Table',
        'Ext.azure.storage.Blob'
    ],

    /**
     * Initialize Ext.Azure for use
     * @param config
     * @returns {boolean} True for successful initialization.
     */
    init : function (config) {
        this.callParent([config]);

        if (this.getPushConfig()) {
            Ext.azure.Push.init(this.getPushConfig());
        }

        return true;
    }
}, function() {
    // In Touch 2.3 and prior, we can't build an override with NEW config properties
    // so we have to do this bit manually
    Ext.apply(this.config, {
        pushConfig : null
    });

    Ext.apply(this, {
        getPushConfig : function() {
            return this.config.pushConfig;
        },

        setPushConfig : function(o) {
            this.config.pushConfig = o;
        }
    });
});