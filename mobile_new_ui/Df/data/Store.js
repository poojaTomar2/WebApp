Ext.define('Df.data.Store', {
    extend: 'Ext.data.Store',
    config: {
    	pageSize: 0,
    	listeners: {
    		beforeload: function (store, operation, eOpts) {
    			if (store.getSorters() && store.getSorters().length != 0) {
    				var sorter = store.getSorters()[0];
    				Ext.apply(store.getProxy().getExtraParams(), { 'sort': sorter.getProperty(), 'dir': sorter.getDirection() });
    			}
    		}
    	}
    },
    constructor: function () {
        var me = this;

        me.callParent(arguments);

        me.on('load', me.loadExceptionHandler, me);
    },
    loadExceptionHandler: function (store, records, success, operation) {
    	if (success !== true) {
    		if (typeof operation.response === 'undefined') {
    			var data = Ext.decode(operation.getResponse().responseText);
    			if (data.info == "Session has expired!") {
    				Ext.Msg.alert('Error', 'Your login session has expired.', function () { window.location = ""; }, this);
    			} else {
    				Ext.Msg.alert('Error', 'Unknown response');
    			}
    		} else {
    			Ext.Msg.alert('Error', operation.response.responseText);
    		}
        }
    },
    onReaderException: function (reader, response) {
        var error;
        if (response.getResponseHeader('content-Type')) {
            error = "Session timeout or server error";
        } else {
            error = "No response from server";
        }
        Ext.Msg.alert('Error', error);
    },
    applyProxy: function (proxy, currentProxy) {
        var model = this.getModel();
        if (model) {
            if (!proxy) {
                proxy = {};
            }
            Ext.applyIf(proxy, {
                type: 'ajax',
                url: model.getProxy().getUrl(),
                extraParams: {},
                reader: {}
            });
            proxy = Ext.factory(proxy, Ext.data.Proxy, currentProxy, 'proxy');
            var reader = proxy.getReader();
            if (!reader.getRootProperty()) {
                reader.setRootProperty('records');
            }
            proxy.setExtraParams(Ext.applyIf(proxy.getExtraParams(), {
                action: 'List',
                asArray: 0
            }));
            reader.on('exception', this.onReaderException, this);
        }
        proxy = this.callParent([proxy, currentProxy]);

        return proxy;
    }
});