Ext.define('CoolerIoTMobile.model.CoolerSummaryMatrix', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'Id', mapping: 'AssetStockId', type: 'int' },
			{ name: 'AssetId', type: 'int' },
			{ name: 'Position', type: 'string' },
			{ name: 'Product', type: 'string' },
			{ name: 'ShortName', type: 'string' },
			{ name: 'Capacity', type: 'int' },
			{ name: 'Refill', defaultValue: 0, type: 'int' }
		],
		idProperty: 'AssetStockId'
	}
});