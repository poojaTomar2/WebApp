Ext.define('CoolerIoTMobile.store.Attachment', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.Attachment',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('Attachment', true),
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