Ext.define('CoolerIoTMobile.store.LocationWithIssues', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.LocationWithIssues',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('LocationListWithIssues', true),
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