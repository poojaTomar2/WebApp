Ext.define('CoolerIoTMobile.model.SmartDevicePing', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'SmartDevicePingId', type: 'int ' },
			{ name: 'GatewaySerialNumber', type: 'string' },
			{ name: 'EventTime', type: 'date' }
		],
		idProperty: 'SmartDevicePingId'
	}
});