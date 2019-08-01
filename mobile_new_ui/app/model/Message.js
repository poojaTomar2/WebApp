Ext.define('CoolerIoTMobile.model.Message', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'MessageId',
		fields: [
			{ name: 'FromUserId', type: 'int' },
			{ name: 'ToUserId', type: 'int' },
			{ name: 'Subject', type: 'string' },
			{ name: 'Message', type: 'string' },
			{ name: 'Name', type: 'string' },
			{ name: 'ParentMessageId', type: 'int' },
			{ name: 'Date', type: 'date' }
		]
	}
});