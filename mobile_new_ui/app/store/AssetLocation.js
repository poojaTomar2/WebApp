Ext.define('CoolerIoTMobile.store.AssetLocation', {
	extend: 'Df.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.AssetLocation',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('Location', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 25,
				sort: 'Name'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		pageSize: 25
	}
});