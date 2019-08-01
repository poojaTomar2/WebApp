Ext.define('CoolerIoTMobile.store.AssetPurity', {
	extend: 'Ext.data.Store',
	config: {
		model: 'CoolerIoTMobile.model.AssetPurity',
		proxy: {
			type: 'ajax',
			url: Df.App.getController('AssetPurity', true),
			enablePagingParams: true,
			extraParams: {
				action: 'list',
				limit: 0,
				sort: 'AssetPurityId',
				dir: 'DESC'
			},
			reader: {
				type: 'json',
				rootProperty: 'records',
				totalProperty: 'recordCount'
			}
		},
		groupTpl: new Ext.XTemplate('<div><table class="cooler-list-header"><tr><td><div class="asset-header" style="text-align:left;">{[CoolerIoTMobile.util.Renderers.standardDate(values.PurityDateTime)]}</div></td></tr></table></div>'),
		sorters: [
			{
				property: 'AssetPurityId',
				direction: 'DESC'
			}
		],
		grouper: {
			sortProperty: "PurityDateTime",
			direction: "DESC",
			groupFn: function (record) {
				return Ext.Date.clearTime(record.data.PurityDateTime, true);
			}
		},
		pageSize: 25
	}
});
