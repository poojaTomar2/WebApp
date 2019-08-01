Ext.define('CoolerIoTMobile.view.Mobile.AssetLocationList', {
	extend: 'Ext.dataview.List',
	xtype: 'assetLocationList',
	config: {
		plugins: [
			{
				xclass: 'Ext.plugin.PullRefresh',
				pullText: 'Pull down to refresh'
			},
			{
				xclass: 'Ext.plugin.ListPaging',
				loadMoreText: 'Load More Location...',
				noMoreRecordsText: 'No More Location',
				autoPaging: true
			}],
		title: CoolerIoTMobile.Localization.SearchTags,
		emptyText: CoolerIoTMobile.Localization.CoolerDetailsListEmptyText,
		store: 'AssetLocation',
		padding: 0,
		margin: 0,
		itemTpl: CoolerIoTMobile.Templates.AssetLocationList
	}
});