Ext.define('CoolerIoTMobile.model.AlertList', {
	extend: 'Df.data.Model',
	config: {
		serverController: 'Alert',
		fields: [
			{ name: 'AlertId', type: 'int' },
			{ name: 'Location', type: 'string' },
			{ name: 'Status', type: 'string' },
			{ name: 'AlertAt', type: 'date' },
			{ name: 'Route', type: 'date' },
			{ name: 'AlertTypeId', type: 'int' },
			{ name: 'Detail', type: 'string' },
			{ name: 'actions', type: 'auto' },
			{ name: 'AlertText', type: 'string' }
		],
		idProperty: 'AlertId'
	}
});
