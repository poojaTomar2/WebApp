Ext.define('CoolerIoTMobile.model.SmartDeviceHealthRecord', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'AssetId', type: 'int ' },
			{ name: 'SerialNumber', type: 'string' },
			{ name: 'LightIntensity', type: 'auto' },
			{ name: 'Temperature', type: 'auto' },
			{ name: 'Humidity', type: 'auto' },
			{ name: 'SoundLevel', type: 'auto' },
			{ name: 'SmartDeviceHealthRecordId', type: 'int' },
			{ name: 'IsDoorOpen', type: 'auto' },
			{ name: 'EventId', type: 'int' },
			{ name: 'EventTime', type: 'date'},
			{ name: 'PowerStatusId', type: 'boolean' },
			{ name: 'SmartDeviceTypeId', type: 'int ' }
		],
		idProperty: 'SmartDeviceHealthRecordId'
	}
});
