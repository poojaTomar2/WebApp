Ext.define('CoolerIoTMobile.store.Customer', {
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
				forCustomer: true,
				sort: 'Name'
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		}
	}
});