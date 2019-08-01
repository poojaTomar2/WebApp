Ext.define('CoolerIoTMobile.store.SalesRepIssue', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.SalesRepIssue',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('SalesRepIssue', true),
			extraParams: {},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});