Ext.define('CoolerIoTMobile.model.CommandData', {
	extend: 'Ext.data.Model',
	config: {		
        fields: [
            { name: 'Title', type: 'string ' },
			{ name: 'Data', type: 'auto' },
			{ name: 'StatusId', type: 'int' },
			{ name: 'Command', type: 'auto' },
            { name: 'LabelWidth', type: 'auto' }
        ],
        identifier: 'uuid', // needed to avoid console warnings!
        proxy: {
        	type: 'localstorage',
        	id: 'CommandData'
        }
    }
});
