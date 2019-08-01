Ext.define('CoolerIoTMobile.model.SmartDevicePowerConsumption', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
			{ name: 'StartTime', type: 'date' },
			{ name: 'EndTime', type: 'date' },
			{ name: 'EventTime', type: 'date' },
			{ name: 'PowerConsumption', type: 'auto' },
			{ name: 'Average', type: 'auto' },
			{ name: 'SmartDevicePowerConsumptionId', type: 'int' }
		],
		idProperty: 'SmartDevicePowerConsumptionId'
	}
});
