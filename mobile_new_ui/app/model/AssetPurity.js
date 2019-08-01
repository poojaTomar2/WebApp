Ext.define('CoolerIoTMobile.model.AssetPurity', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'AssetPurityId', type: 'int ' },
			{ name: 'Shelves', type: 'int' },
			{ name: 'ImageDateTime', type: 'date', mapping: 'DoorClose' },
			{ name: 'VerifiedOn', type: 'date', dateFormat: 'XL' },
			{ name: 'DoorOpenDuration', type: 'int' },
			{ name: 'Columns', type: 'int' },
			{ name: 'ItemsPerColumn', type: 'float' },
			{ name: 'Stock', type: 'int', mapping: 'TotalStock' },
			{ name: 'Priority', type: 'int' },
			{ name: 'PurityIssue', type: 'boolean' },
			{ name: 'StatusId', type: 'int' },
            { name: 'ProcessSecond', type: 'auto ' },
			{ name: 'PurityPerc', type: 'auto' },
			{ name: 'StoredFileName', type: 'string' },
			{ name: 'ForeignProduct', type: 'int' },
			{ name: 'DoorClose', type: 'date' },
			{ name: 'IsVerified', type: 'boolean' },
			{ name: 'ImageName', type: 'string' },
			{ name: 'ImageCount', type: 'int' },
			{ name: 'PurityDateTime', type: 'date' },
			{ name: 'OurStock', type: 'auto' },
			{ name: 'PurityPercentage', type: 'auto' },
			{ name: 'StockPercentage', type: 'auto' },
			{ name: 'PlanogramCompliance', type: 'auto' }
		],
		idProperty: 'AssetPurityId'
	}
});
