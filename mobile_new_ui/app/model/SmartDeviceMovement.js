Ext.define('CoolerIoTMobile.model.SmartDeviceMovement', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'AssetId', type: 'int ' },
			{ name: 'SerialNumber', type: 'string' },
			{ name: 'Movement', type: 'auto' },
			{ name: 'Latitude', type: 'auto' },
			{ name: 'Longitude', type: 'auto' },
			{ name: 'SmartDeviceMovementId', type: 'int' },
			{ name: 'IsDoorOpen', type: 'auto' },
			{ name: 'EventTime', type: 'date'},
			{ name: 'StartTime', type: 'date'},
			{ name: 'MovementDuration', type: 'int ' }

		],
		idProperty: 'SmartDeviceMovementId'
	}
});
