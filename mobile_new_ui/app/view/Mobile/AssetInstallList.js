Ext.define('CoolerIoTMobile.view.Mobile.AssetInstallList', {
	extend: 'Ext.dataview.List',
	xtype: 'assetInstallList',
	config: {
		plugins: [
			{
				xclass: 'Ext.plugin.PullRefresh',
				pullText: 'Pull down to refresh'
			},
			{
				xclass: 'Ext.plugin.ListPaging',
				loadMoreText: 'Load More Assets...',
				noMoreRecordsText: 'No More Assets',
				autoPaging: true
			}],
		title: CoolerIoTMobile.Localization.SearchTags,
		emptyText: CoolerIoTMobile.Localization.CoolerDetailsListEmptyText,
		store: 'AssetList',
		padding: 0,
		margin: 0,
		itemTpl: CoolerIoTMobile.Templates.AssetList
	}
});