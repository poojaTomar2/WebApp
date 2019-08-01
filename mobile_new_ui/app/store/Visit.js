Ext.define('CoolerIoTMobile.store.Visit', {
	extend: 'Ext.data.Store',
	config: {
		//autoLoad: true,
		model: 'CoolerIoTMobile.model.Visit',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('visit', true),
			enablePagingParams: false,
			extraParams: {
				action: 'list',
				limit: 0,
				onRoute: true
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});