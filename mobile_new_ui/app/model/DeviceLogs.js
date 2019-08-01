Ext.define('CoolerIoTMobile.model.DeviceLogs', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'EventTime', type: 'date ' },
			{ name: 'ServiceType', type: 'string' },
			{ name: 'Status', type: 'string' }
		],
		identifier: 'uuid', // needed to avoid console warnings!
		proxy: {
			type: 'localstorage',
			id: 'BleTag'
		}
	}
});
