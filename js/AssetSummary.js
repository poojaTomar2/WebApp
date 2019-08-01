Cooler.AssetSummary = Ext.extend(Object, {
	createDashboard: function () {
		var applyButton = new Ext.Button({ text: 'Apply', iconCls: 'btn-icon-graph', handler: this.updateSummaryCount, scope: this });
		var clientCombo = DA.combo.create({ fieldLabel: 'Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', width: 100, itemId: 'countryCombo', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Country' } });
		var cityCombo = DA.combo.create({ fieldLabel: 'City', width: 100, itemId: 'cityCombo', name: 'City', hiddenName: 'City', controller: 'combo', listWidth: 220, baseParams: { comboType: 'CityFilter' } });
		this.clientCombo = clientCombo;
		this.countryCombo = countryCombo;
		this.cityCombo = cityCombo;
		var assetDataSummaryGrid = Cooler.AssetDataSummary.createGrid({ title: 'Asset Summary', height: 350 });
		var assetGrid = Cooler.AssetSummaryGrid.createGrid({ title: 'Assets', height: 450 });
		this.assetGrid = assetGrid;
		this.assetDataSummaryGrid = assetDataSummaryGrid;
		assetDataSummaryGrid.on({
			'cellclick': this.onAssetDataSummaryGridCellclick,
			scope: this
		});
		var col1 = {
			columnWidth: .2,
			labelWidth: 100,
			items: [
				clientCombo
			]
		};
		var col2 = {
			columnWidth: .2,
			labelWidth: 100,
			items: [
				countryCombo
			]
		};

		var col3 = {
			columnWidth: .2,
			labelWidth: 100,
			items: [
				cityCombo
			]
		};

		var col4 = {
			columnWidth: .2,
			labelWidth: 100,
			items: [
				applyButton
			]
		};

		if (!this.panel) {
			this.panel = new Ext.Panel({
				title: 'Asset Summary',
				autoScroll: true,
				items: [
					{
						xtype: 'panel',
						layout: 'column',
						border: false,
						defaults: { layout: 'form', border: false },
						items: [col1, col2, col4]

					}, assetDataSummaryGrid, assetGrid
				]
			});
		}
		this.updateSummaryCount();
		this.assetGrid.hide();
		return this.panel;
	},

	updateSummaryCount: function () {
		var assetDataSummaryGrid = this.assetDataSummaryGrid;
		assetDataSummaryGrid.show();
		var store = assetDataSummaryGrid.getStore();
		var baseParams = store.baseParams;
		baseParams.clientId = this.clientCombo.getValue();
		baseParams.countryId = this.countryCombo.getValue();
		baseParams.city = this.cityCombo.getRawValue();
		assetDataSummaryGrid.loadFirst();
	},

	onAssetDataSummaryGridCellclick: function (grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);  // Get the Record
		var columnModel = grid.getColumnModel();
		var title = columnModel.getColumnHeader(columnIndex); //Get Column Name
		var fieldName = columnModel.getDataIndex(columnIndex); // Get field name
		fieldName = fieldName.replace("Asset", "AssetIds")
		if (fieldName.indexOf("AssetIds") > -1) {
			var assetIds = record.get(fieldName);
			var assetGrid = this.assetGrid;
			assetGrid.setTitle(title);
			assetGrid.show();
			var store = assetGrid.getStore();
			var baseParams = store.baseParams;
			baseParams.clientId = this.clientCombo.getValue();
			baseParams.countryId = this.countryCombo.getValue();
			baseParams.city = this.cityCombo.getRawValue();
			baseParams.assetId = assetIds;
			assetGrid.loadFirst();
		}
	},

	show: function () {
		DCPLApp.AddTab(this.createDashboard());
	}
});
Cooler.AssetSummary = new Cooler.AssetSummary();