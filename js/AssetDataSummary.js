Cooler.AssetDataSummary = new Cooler.Form({
	listTitle: 'Asset Data Summary',
	controller: 'AssetDataSummary',
	disableAdd: true,
	disableDelete: true,
	gridConfig: {
		sm: new Ext.grid.CellSelectionModel(),
		autoFilter: false,
		defaultPlugins: false
	},
	hybridConfig: function () {
		return [
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', displayIndex: 'Client', type: 'string', renderer: ExtHelper.renderer.Combo(DA.combo.create({ store: Cooler.comboStores.Client })), width: 150, sortable: false },
			{ header: 'Total Cooler', dataIndex: 'TotalAsset', width: 150, type: 'int', sortable: false },
			{ header: 'Smart Cooler', dataIndex: 'AssetWithSmartDevice', width: 150, type: 'int', sortable: false },
			{ header: 'Door Duration Issue', dataIndex: 'AssetWithDoorIssue', width: 150, type: 'int', sortable: false },
			{ header: 'High Temperature', dataIndex: 'AssetWithHighTemp', width: 150, type: 'int', sortable: false },
			{ header: 'Low Temperature', dataIndex: 'AssetWithLowTemp', width: 150, type: 'int', sortable: false },
			{ header: 'Power Off', dataIndex: 'AssetWithPowerOff', width: 150, type: 'int', sortable: false },
			{ header: 'Low Battery', dataIndex: 'AssetWithLowBattery', width: 150, type: 'int', sortable: false },
			{ header: 'Cooler Malfunction', dataIndex: 'AssetWithCoolerMalfunction', width: 150, type: 'int', sortable: false },
			{ header: 'Missing Data', dataIndex: 'AssetWithMissingData', width: 150, type: 'int', sortable: false },
			{ header: 'No Data', dataIndex: 'AssetWithNoData', width: 150, type: 'int', sortable: false },
			{ dataIndex: 'TotalAssetIds', type: 'string' },
			{ dataIndex: 'AssetIdsWithSmartDevice', type: 'string' },
			{ dataIndex: 'AssetIdsWithDoorIssue', type: 'string' },
			{ dataIndex: 'AssetIdsWithHighTemp', type: 'string' },
			{ dataIndex: 'AssetIdsWithLowTemp', type: 'string' },
			{ dataIndex: 'AssetIdsWithPowerOff', type: 'string' },
			{ dataIndex: 'AssetIdsWithLowBattery', type: 'string' },
			{ dataIndex: 'AssetIdsWithCoolerMalfunction', type: 'string' },
			{ dataIndex: 'AssetIdsWithMissingData', type: 'string' },
			{ dataIndex: 'AssetIdsWithNoData', type: 'string' }
		];
	}
});