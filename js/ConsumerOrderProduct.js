Cooler.ConsumerOrderProduct = new Cooler.Form({
	controller: 'OrderDetailRetailer',

	keyColumn: 'ConsumerOrderProductId',

	listTitle: 'Retailer Order Detail',
	securityModule: 'RetailerOrder',
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ConsumerOrderProductId' } }
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ConsumerOrderProductId', type: 'int' },
			{ dataIndex: 'ConsumerOrderId', type: 'int' },
			{ header: 'Retailer Order Detail Id', dataIndex: 'ConsumerOrderProductId', type: 'int', width: 120 },
			{ header: 'Product', dataIndex: 'ProductName', type: 'string' },
			{ header: 'Quantity', dataIndex: 'Quantity', type: 'float' },
			{ header: 'Price', dataIndex: 'Price', type: 'float' }
		];
	}
});