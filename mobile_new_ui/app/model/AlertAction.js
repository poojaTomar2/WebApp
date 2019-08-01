Ext.define('CoolerIoTMobile.model.AlertAction', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'AlertActionId',
		fields: [
			{ name: 'AlertActionId', type: 'int' },
			{ name: 'AlertId', type: 'int' },
			{ name: 'UserId', type: 'int' },
			{ name: 'Date', type: 'auto' },
			{ name: 'Notes', type: 'string' },
			{ name: 'Detail', type: 'string' },
			{ name: 'StatusId', type: 'int' },
			{ name: 'Status', type: 'string' },
			{ name: 'ActionTypeId', type: 'int' },
			{ name: 'Reminder', type: 'auto' },
			{ name: 'Action', type: 'string' },
			{ name: 'Name', type: 'string' },
			{ name: 'AlertTypeId', type: 'int' },
			{ name: 'AlertAt', type: 'date' },
			{ name: 'AlertType', type: 'string' },
			{ name: 'ToDoActionId', type: 'int' },
			{ name: 'ToDoAction', type: 'string' }
		]
	}
});