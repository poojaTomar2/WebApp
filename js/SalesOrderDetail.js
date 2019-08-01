Cooler.SalesOrderDetail = new Cooler.Form({
	controller: 'SalesOrderDetail',

	keyColumn: 'SalesOrderDetailId',

	listTitle: 'Sales Order Detail',
	securityModule: 'SalesOrder',
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'SalesOrderDetailId' } }
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'SalesOrderDetailId', type: 'int' },
			{ dataIndex: 'SalesOrderId', type: 'int' },
			{ header: 'Product', dataIndex: 'ProductName', type: 'string' },
			{ header: 'Quantity', dataIndex: 'Quantity', type: 'float' },
			{ header: 'Price', dataIndex: 'Price', type: 'float' }
		];
	}
});