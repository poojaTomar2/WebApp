Ext.define('CoolerIoTMobile.store.Location', {
	extend: 'Ext.data.Store',
	config: {
		fields: ['Latitude', 'Longitude', 'CustomerName', 'Day'],
		proxy: {
			type: 'ajax',
			url: Df.App.getController('Map', true),
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