Ext.define('CoolerIoTMobile.store.AssetDetail', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.CoolerSummary',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AssetInfo', true),
			enablePagingParams: false,
			extraParams: {
				action: 'load'
			},
			reader: {
				type: 'json',
				rootProperty: 'data'
			}
		}
	}
});