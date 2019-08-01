Ext.define('CoolerIoTMobile.store.CustomerInfo', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.CustomerInfo',
		proxy: {
			type: 'ajax',
			url: '',
			enablePagingParams: false,
			extraParams: {
				action: 'list',
				limit: 0
			},
			reader: {
				type: 'json',
				rootProperty: 'records'
			}
		},
		data: [
			{ CustomerCode: '0091987363', CustomerName: 'DULAKSHI Distributor', CustomerChannel: 'Special Events', CustomerAddress: '14/21 Durevall', AddressCity: 'NewYork', AddressPostalCode: '262802', CustomerVATNumber : 'A12688', ContentFirstName : 'Tom', ContentLastName : 'Blown', ContentPhone : '785 34987593', ContentMobile : '70643534', Identity1 : '14/3 Lansdwell', Identity2 : '2012.09.10', CustomerId: 1}
		]
	}
});