Ext.define('CoolerIoTMobile.model.SmartDeviceCommand', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'SmartDeviceCommandId', type: 'int ' },
			{ name: 'ExecutedOn', type: 'date', dateFormat: 'XL' },
			{ name: 'CreatedOn', type: 'date', dateFormat: 'XL' },
			{ name: 'Result', type: 'string' },
			{ name: 'SmartDeviceTypeCommand', type: 'string' },
			{ name: 'EventDate', type: 'date', dateFormat: 'XL' },
			{ name: 'EventTime', type: 'date' }
		],
		idProperty: 'SmartDeviceCommandId'
	}
});