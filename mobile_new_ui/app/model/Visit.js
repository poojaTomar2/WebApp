Ext.define('CoolerIoTMobile.model.Visit', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'LocationId',
		fields: [
			{ name: 'Name', type: 'string' },
			{ name: 'Code', type: 'string' },
			{ name: 'Channel', type: 'string' },
			{ name: 'City', type: 'string' },
			{ name: 'Street', type: 'string' },
			{ name: 'Street2', type: 'string' },
			{ name: 'Street3', type: 'string' },
			{ name: 'PostalCode', type: 'string' },
			{ name: 'FirstName', type: 'string' },
			{ name: 'LastName', type: 'string' },
			{ name: 'WorkPhone', type: 'string' },
			{ name: 'CellPhone', type: 'string' },
			{ name: 'Country', type: 'string' },
			{ name: 'State', type: 'string' },
			{ name: 'LocationId', type: 'int' },
			{ name: 'OpenHealthAlert', type: 'int' },
			{ name: 'OpenMissingAlert', type: 'int' },
			{ name: 'OpenMovementAlert', type: 'int' },
			{ name: 'OpenPurityAlert', type: 'int' },
			{ name: 'OpenStockAlert', type: 'int' },
			{ name: 'WasOffRoute', type: 'boolean' },
			{ name: 'IsKeyLocation', type: 'boolean' },
			{ name: 'IsOnRoute', type: 'boolean' },
			{ name: 'Latitude', type: 'string' },
			{ name: 'Longitude', type: 'string' },
			{ name: 'SmartDeviceTypeId', type: 'int' }			
		]
	}
});