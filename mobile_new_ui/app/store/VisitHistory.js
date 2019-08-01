Ext.define('CoolerIoTMobile.store.VisitHistory', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.VisitHistory',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AssetVisitHistory', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'AssetVisitHistoryId',
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
				property: 'AssetVisitHistoryId',
				direction: 'DESC'
			}
		]
	}
});
