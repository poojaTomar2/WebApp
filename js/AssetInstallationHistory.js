Cooler.AssetInstallationHistory = new Cooler.Form({
	listTitle: 'Asset Installation History',
	controller: 'AssetInstallationHistory',
	disableAdd: true,
	disableDelete: true,
	baseParams: { AssociationType: null, AssociationId: 0 },
	gridConfig: {
		sm: new Ext.grid.CellSelectionModel(),
		autoFilter: false,
		defaultPlugins: false
	},
	setAssociation: function (data) {
		this.newListRecordData = data
	},
	hybridConfig: function () {
		return [
			{ header: 'Asset Installation History Id', dataIndex: 'AssetInstallationHistoryId', type: 'int' },
			{ header: 'Smart Device Id', dataIndex: 'SmartDeviceId', type: 'string' },
			{ header: 'AssetId', dataIndex: 'AssetId', type: 'string' },
			{ header: 'Asset Associated On Utc', dataIndex: 'AssetAssociatedOnUTC', type: 'date', width: 200, renderer: ExtHelper.renderer.DateTime },
			{ header: 'CreatedOn', dataIndex: 'CreatedOn', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Asset Associated On', dataIndex: 'AssetAssociatedOn', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Asset Associated Removed On', dataIndex: 'AssetAssociatedRemovedOn', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Associated By User', dataIndex: 'AssociatedByUser', type: 'string' },
			{ header: 'Removed By UserId', dataIndex: 'RemovedByUser', type: 'string' },
			{ header: 'Asset Associated Removed On Utc', dataIndex: 'AssetAssociatedRemovedOnUtc', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', type: 'date', renderer: ExtHelper.renderer.DateTime }
		];
	}
});