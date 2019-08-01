Ext.define('CoolerIoTMobile.store.Message', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.Message',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('Message', true),
			reader: {
				type: 'json',
				rootProperty: 'records'
			},
			extraParams: {
				action: 'list',
				limit: 0,
				asArray: 0
			}
		}
	}
});