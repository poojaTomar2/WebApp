Ext.define('CoolerIoTMobile.model.BleTag', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'MacAddress', type: 'string ' },
			{ name: 'DeviceName', type: 'string' },
			{ name: 'Advertisement', type: 'auto' },
			{ name: 'ManufacturerUUID', type: 'string' },
			{ name: 'Major', type: 'auto', defaultValue: 0 },
			{ name: 'Minor', type: 'auto', defaultValue: 0 },
			{ name: 'Rssi', type: 'auto', defaultValue: 0 },
            { name: 'IsConnected', type: 'boolean', defaultValue: false },
			{ name: 'HealthText', type: 'string' },
			{ name: 'MotionText', type: 'string' },
			{ name: 'DoorStatus', type: 'string' },
			{ name: 'ImageText', type: 'string' },
			{ name: 'PictureText', type: 'string' },
			{ name: 'StandByStatus', type: 'string' }
		],
		identifier: 'uuid', // needed to avoid console warnings!
		proxy: {
			type: 'localstorage',
			id: 'BleTag'
		}
	}
});
