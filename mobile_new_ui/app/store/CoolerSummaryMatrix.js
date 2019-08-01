Ext.define('CoolerIoTMobile.store.CoolerSummaryMatrix', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.CoolerSummaryMatrix',
		autoLoad: false,
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AssetStock', true),
			enablePagingParams: false,
			extraParams: {
				action: 'list',
				AsArray: 0,
				page: 0
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});