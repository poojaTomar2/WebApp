Cooler.Market = Ext.extend(Cooler.Form, {
	keyColumn: 'MarketId',
	captionColumn: 'MarketName',
	formTitle: 'Market : {0}',
	controller: 'Market',
	securityModule: 'Market',
	listTitle: 'Market',
	hybridConfig: function () {
		return [
			{ dataIndex: 'MarketId', type: 'int' },
			{ dataIndex: 'ParentMarketId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'ChildCount', type: 'int' },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 150 },
			{ header: 'Market Name', dataIndex: 'MarketName', type: 'string', width: 200 },
			{ header: 'Parent Market', dataIndex: 'ParentMarket', type: 'string', width: 200 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
		];
	},
	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var parentMarket = DA.combo.create({ fieldLabel: 'Parent Market', hiddenName: 'ParentMarketId', baseParams: { comboType: 'Market' }, listWidth: 220, controller: "Combo" });
		this.parentMarket = parentMarket;
		this.parentMarket.on('beforequery', this.onBeforeMarketComboLoad, this);
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Market Name', name: 'MarketName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				parentMarket,
				DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId })
			]
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', this.onDataLoaded, this);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 150,
			items: [this.formPanel]
		});
	},
	onDataLoaded: function (marketForm, data) {
		var record = data.data;
		var id = record.Id;
		if (!Ext.isEmpty(id) && id !== 0) {
			var selectedRecord = this.grid.getSelectionModel().getSelected(),
				childCount = 0,
				parentMarketId = 0;
			if (selectedRecord) {
				childCount = selectedRecord.get('ChildCount'),
				parentMarketId = selectedRecord.get('ParentMarketId');
			}
			this.parentMarket.setDisabled(parentMarketId === 0 && childCount > 0 ? true : false);
		}
		var topToolbarItems = marketForm.formPanel.getTopToolbar().items;
		var deleteButtonIndex = topToolbarItems.findIndex('iconCls', 'delete');
		var deleteButton = topToolbarItems.get(deleteButtonIndex);
		deleteButton.setDisabled(childCount > 0 ? true : false);
	},
	onBeforeMarketComboLoad: function (queryEvent) {
		var combo = queryEvent.combo;
		combo.baseParams.marketId = this.formPanel.form.baseParams.id;
	}
});
Cooler.Market = new Cooler.Market({ uniqueId: 'Market' });