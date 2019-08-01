Ext.define('CoolerIoTMobile.model.Notes', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'NoteId', type: 'int ' },
			{ name: 'Title', type: 'string' },
			{ name: 'NoteTypeId', type: 'int' },
			{ name: 'Notes', type: 'string' },
			{ name: 'NoteType', type: 'string' },
			{ name: 'AssociationTypeId', type: 'int' },
			{ name: 'AssociationId', type: 'int' },
			{ name: 'CreatedOn', type: 'date' },
			{ name: 'CreatedBy', type: 'string' }
		],
		idProperty: 'NoteId'
	}
});
