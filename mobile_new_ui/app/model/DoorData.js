Ext.define('CoolerIoTMobile.model.DoorData', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'AssetId', type: 'int ' },
			{ name: 'SerialNumber', type: 'string' },
			{ name: 'DoorOpen', type: 'date' },
			{ name: 'EventId', type: 'int' },
			{ name: 'EventTime', type: 'date' },
			{ name: 'DoorOpenDuration', type: 'int' },
			{ name: 'SmartDeviceDoorStatusId', type: 'auto' }
		],
		idProperty: 'SmartDeviceDoorStatusId'
	}
});
