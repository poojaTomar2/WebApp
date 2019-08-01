Ext.define('CoolerIoTMobile.store.SmartDeviceConfig', {
	extend: 'Ext.data.Store',
	config: {
		fields: [
			{ name: 'Attribute', type: 'string' },
			{ name: 'Value', type: 'auto' }
		]
	}
});