Ext.define('CoolerIoTMobile.store.Components', {
    extend: 'Ext.data.TreeStore',
    requires: [
        'CoolerIoTMobile.model.Components'
    ], 
    config: {
    	autoLoad: false,
        defaultRootProperty: 'items',
        model: 'CoolerIoTMobile.model.Components',

        // XXX: AccordionList Now show data from JSON
        proxy: {
        	type: 'ajax',
        	url: Df.App.getController('Alert', false, true),
        	enablePagingParams: false,
        	extraParams: {
        		action: 'list',
        		limit: 0
        	},
        	reader: {
        		type: 'json',
        		rootProperty: 'items'
        	}
        }
    }

});
