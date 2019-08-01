Ext.define('CoolerIoTMobile.model.VisitHistory', {
	extend: 'Ext.data.Model',
	config: {
		fields: [
            { name: 'AssetVisitHistoryId', type: 'int ' },
			{ name: 'AssetId', type: 'int' },
			{ name: 'VisitDateTime', type: 'date' },
			{ name: 'Notes', type: 'string' },
			{ name: 'VisitByUserId', type: 'int' },
			{ name: 'VisitBy', type: 'string' },
			{ name: 'StatusId', type: 'int' },
			{ name: 'Status', type: 'string' }
		],
		idProperty: 'AssetVisitHistoryId'
	}
});
