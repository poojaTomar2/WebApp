Ext.define('CoolerIoTMobile.model.AssetLocation', {
	extend: 'Df.data.Model',
	config: {
		
		fields: [
			{ name: 'Name', type: 'string' },
			{ name: 'Code', type: 'string' },
			{ name: 'LocationId', type: 'int' }
		],
		idProperty: 'LocationId'
	}
});