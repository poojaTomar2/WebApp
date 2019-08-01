Ext.define('CoolerIoTMobile.model.Attachment', {
	extend: 'Ext.data.Model',
	config: {
		idProperty: 'AttachmentId',
		fields: [
			{ name: 'AttachmentId', type: 'int' },
			{ name: 'Filename', type: 'string' },
			{ name: 'AttachmentType', type: 'string' },
			{ name: 'AttachmentTypeId', type: 'int' },
			{ name: 'CreatedBy', type: 'string' },
			{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
			{ name: 'OriginalFileName', type: 'string' }
		]
	}
});