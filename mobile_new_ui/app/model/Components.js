Ext.define('CoolerIoTMobile.model.Components', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'text', type: 'string' },
            { name: 'icon', type: 'string' },
			{ name: 'Name', type: 'string' },
			{ name: 'AlertText', type: 'string' },
			{ name: 'Aging', type: 'int' },
			{ name: 'Status', type: 'string' },
			{ name: 'Route', type: 'date' },
			{ name: 'Issue', type: 'string' },
			{ name: 'AlertId', type: 'int' },
			{ name: 'AlertTypeId', type: 'int' },
			{ name: 'StatusId', type: 'int' }
        ]
    }
});
