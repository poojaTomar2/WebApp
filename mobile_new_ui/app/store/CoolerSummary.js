Ext.define('CoolerIoTMobile.store.CoolerSummary', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.CoolerSummary',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AssetInfo', true),
			enablePagingParams: false,
			extraParams: {
				action: 'list',
				limit: 0
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});
