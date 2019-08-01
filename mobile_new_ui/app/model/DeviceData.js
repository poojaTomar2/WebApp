Ext.define('CoolerIoTMobile.model.DeviceData', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'Id', mapping: 'EventId', type: 'int ' },
            { name: 'DoorStatus', type: 'auto ' },
			{ name: 'TemperatureValue', type: 'float' },
			{ name: 'HumidityValue', type: 'float' },
			{ name: 'AmbientlightValue', type: 'float' },
			{ name: 'Angle', type: 'float' },
			{ name: 'MagnetX', type: 'float' },
			{ name: 'MagnetY', type: 'float' },
			{ name: 'MagnetZ', type: 'float' },
			{ name: 'Latitude', type: 'float' },
			{ name: 'Longitude', type: 'float' },
			{ name: 'RecordType', type: 'int' },
            { name: 'RecordTypeText', type: 'string' },
			{ name: 'BatteryLevel', type: 'int' },
			{ name: 'SoundLevel', type: 'int' },
			{ name: 'SwitchStatus', type: 'int' },
			{ name: 'PosX', type: 'int' },
			{ name: 'PosY', type: 'int' },
			{ name: 'NegX', type: 'int' },
			{ name: 'NegY', type: 'int' },
			{ name: 'PosZ', type: 'int' },
			{ name: 'NegZ', type: 'int' },
			{ name: 'DistanceLsb', type: 'int' },
			{ name: 'DistanceMsb', type: 'int' },
			{ name: 'EventId', type: 'auto' },
			{ name: 'ImageSize', type: 'auto' },
			{ name: 'EventTime', type: 'auto' },
			{ name: 'StartTimeMovement', type: 'auto' },
			{ name: 'DurationMovement', type: 'auto' },
			{ name: 'Sequence', type: 'auto' },
			{ name: 'Angle', type: 'auto' },
			{ name: 'Address', type: 'auto' }
		],
		idProperty: 'EventId',
		identifier: 'uuid', // needed to avoid console warnings!
		proxy: {
			type: 'localstorage',
			id: 'BleDeviceData'
		}
	}
});
