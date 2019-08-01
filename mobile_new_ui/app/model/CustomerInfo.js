Ext.define('CoolerIoTMobile.model.CustomerInfo', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'CustomerId',
		fields: [
			{ name: 'CustomerCode', type: 'string' },
			{ name: 'CustomerName', type: 'string' },
			{ name: 'CustomerChannel', type: 'string' },
			{ name: 'CustomerAddress', type: 'string' },
            { name: 'AddressCity', type: 'string' },
			{ name: 'AddressPostalCode', type: 'string' },
			{ name: 'CustomerVATNumber', type: 'string' },
			{ name: 'ContentFirstName', type: 'string' },
			{ name: 'ContentLastName', type: 'string' },
			{ name: 'ContentPhone', type: 'string' },
			{ name: 'ContentMobile', type: 'string' },
			{ name: 'Identity1', type: 'string' },
			{ name: 'Identity2', type: 'string' },
			{ name: 'CustomerId', type: 'int' }
		]
	}
});