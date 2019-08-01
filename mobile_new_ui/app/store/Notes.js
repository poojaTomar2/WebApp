Ext.define('CoolerIoTMobile.store.Notes', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.Notes',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('Note', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'CreatedOn',
				dir: 'DESC'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		pageSize: 25,
		remoteSort: false,
		sorters: [
			{
				property: 'CreatedOn',
				direction: 'DESC'
			}
		]
	}
});
