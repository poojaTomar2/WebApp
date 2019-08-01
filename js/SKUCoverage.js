Cooler.SKUCoverage = Ext.extend(Cooler.Form, {
	controller: 'SKUCoverage',
	listTitle: 'SKU Coverage',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'SKUCoverage',
	constructor: function (config) {
		Cooler.SKUCoverage.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'ClientId' } }
		});
	},

	hybridConfig: function () {
		return [
			{ dataIndex: "ClientId", type: 'int' },
			{ header: "Client Code", type: 'string', dataIndex: 'ClientCode' },
			{ header: "SKU Data Quality", type: 'string', dataIndex: 'SKUDataQuality' },
			{ header: "# Of Facing", type: 'string', align: 'right', dataIndex: 'NumberOfFacing' },
			{ header: "# Of SKU", type: 'int', align: 'right', dataIndex: 'SKU' }
		];
	},
	configureListTab: function (config) {
		var grid = this.grid;
		this.grid.region = 'center';
		grid.on('rowclick', this.loadSkuAccuracyChildGrid, this);
		var skuAccuracyChildGrid = Cooler.SKUCoverageChildGrid.createGrid({ header: false, IsChildGrid: true });
		this.skuAccuracyChildGrid = skuAccuracyChildGrid;
		var childTabPanel = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			id: 'skuAccuracyChildTab',
			items: [skuAccuracyChildGrid],
			height: 350,
			split: true
		});
		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [grid, childTabPanel]
		});

	},
	loadSkuAccuracyChildGrid: function () {
		var selectionModel = this.grid.getSelectionModel();
		if (selectionModel) {
			var selectedRecord = selectionModel.getSelected();
			if (selectedRecord) {
				var skuDataQuality = selectedRecord.get('SKUDataQuality');
				var skuAccuracyChildGridStore = this.skuAccuracyChildGrid.getStore();
				if (skuAccuracyChildGridStore) {
					skuAccuracyChildGridStore.baseParams.SKUDataQuality = skuDataQuality;
					skuAccuracyChildGridStore.baseParams.IsChildGrid = true;
					skuAccuracyChildGridStore.baseParams.ClientId = selectedRecord.get('ClientId');
					skuAccuracyChildGridStore.load();
				}
			}
		}
	}
});

Cooler.SKUCoverage = new Cooler.SKUCoverage({ uniqueId: 'SKUCoverage' });