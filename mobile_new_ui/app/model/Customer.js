Ext.define('CoolerIoTMobile.model.Customer', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'CustomerId',
		fields: [
			{ name: 'Customer', type: 'string' },
			{ name: 'CustomerId', type: 'int' }
		]
	}
});