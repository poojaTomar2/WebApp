Ext.define('CoolerIoTMobile.model.DeviceSearchResult', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'SmartDeviceId', type: 'int' },
            { name: 'EventTime', type: 'date ' },
			{ name: 'SerialNumber', type: 'string' },
			{ name: 'EventId', type: 'int' },
			{ name: 'CreatedOn', type: 'date' },
			{ name: 'GatewayId', type: 'int' },
			{ name: 'IsUpdated', type: 'bool' },
			{ name: 'DeviceSerial', type: 'string' }
		],
		identifier: 'uuid', // needed to avoid console warnings!
		proxy: {
			type: 'localstorage',
			id: 'DeviceSearchResult'
		}
	}
});
