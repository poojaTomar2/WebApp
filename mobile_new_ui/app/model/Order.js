Ext.define('CoolerIoTMobile.model.Order', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'ConsumerOrderId',
		fields: [
			{ name: 'consumerOrderId', type: 'int' },
			{ name: 'locationId', type: 'int' },
			{ name: 'consumerId', type: 'int' },
			{ name: 'orderDate', type: 'date' },
			{ name: 'isStoreNotified', type: 'boolean' },
			{ name: 'orderNumber', type: 'string' },
			{ name: 'couponCodeId', type: 'int' },
			{ name: 'tableNumber', type: 'int' },
			{
				name: 'amount', type: 'float', convert: function (value) {
					if (value != null)
						return typeof value === 'number' ? value.toFixed(2) : value;
				}
			},
			{ name: 'statusId', type: 'int' },
			{ name: 'customerName', type: 'string' }
		]
	}
});