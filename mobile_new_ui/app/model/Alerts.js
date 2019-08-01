Ext.define('CoolerIoTMobile.model.Alerts', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'AlertId',
		fields: [
			{ name: 'Name', type: 'string' },
			{ name: 'AlertText', type: 'string' },
			{ name: 'Aging', type: 'string' },
			{ name: 'Status', type: 'string' },
			{ name: 'Route', type: 'date' },
			{ name: 'Issue', type: 'string' },  
			{ name: 'AlertId', type: 'int' },
			{ name: 'AlertTypeId', type: 'int' },
			{ name: 'StatusId', type: 'int' }
		]
	}
});