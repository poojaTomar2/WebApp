Cooler.MarketDay = Ext.extend(Cooler.Form, {
	formTitle: 'Market Day: {0}',
	captionColumn: 'FormatMarketDate',
	keyColumn: 'MarketDayId',
	controller: 'MarketDay',
	allowExport: false,
	securityModule: 'Market Day',
	listTitle: 'Market Day',
	hybridConfig: function () {
		return [
			{ dataIndex: 'MarketDayId', type: 'int' },
			{ dataIndex: 'FormatMarketDate', type: 'string' },
			{ header: 'Date', dataIndex: 'MarketDate', width: 100, renderer: ExtHelper.renderer.Date, type: 'date' }
		];
	},
	createForm: function (config) {
		this.on('dataLoaded', this.onDataLoaded, this);
		var customSettings = new Ext.form.TextArea({ fieldLabel: 'Custom Settings', name: 'CustomSettings', width: 200, height: 40 });
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Date', name: 'MarketDate', xtype: 'datefield', width: 180, allowBlank: false }
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		var marketDayDetailGrid = Cooler.MarketDayDetail.createGrid({ editable: true, root: 'MarketDayDetail', allowPaging: false, plugins: [new Ext.ux.ComboLoader()] });
		this.childGrids = [marketDayDetailGrid];
		this.childModules = [Cooler.LocationPromotion];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			enableTabScroll: true,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			items: this.childGrids
		});
		Ext.apply(config, {
			region: 'north',
			height: 60
		});
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 0px'
			},
			height: 500,
			items: [this.formPanel, tabPanel]
		});
	},

	onDataLoaded: function (assetForm, data) {
		this.formPanel.getForm().findField("MarketDate").setDisabled(data.data.MarketDate);
	}
});
Cooler.MarketDay = new Cooler.MarketDay({ uniqueId: 'MarketDay' });



/*MarketDayDetail Grid*/
Cooler.MarketDayDetail = new Cooler.Form({
	listTitle: 'Market Day Detail',
	newListRecordData: { SmartRewardUserId: '', SalesRepId: '' },
	gridIsLocal: true,
	hybridConfig: function () {
		var salesRepCombo = DA.combo.create({ controller: 'combo', baseParams: { comboType: 'SalesPerson' }, allowBlank: false });
		var consumerCombo = DA.combo.create({ controller: 'combo', baseParams: { comboType: 'Consumer' }, allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'MarketDayId', type: 'int' },
			{ dataIndex: 'SmartRewardUser', type: 'string' },
			{ dataIndex: 'SmartRewardUserId', type: 'int' },
			{ dataIndex: 'SalesRep', type: 'string' },
			{ dataIndex: 'SalesRepId', type: 'int' },
			{ header: 'Smart Reward User', dataIndex: 'SmartRewardUserId', displayIndex: 'SmartRewardUser', editor: consumerCombo, width: 220, renderer: 'proxy' },
			{ header: 'Sales Rep', dataIndex: 'SalesRepId', displayIndex: 'SalesRep', editor: salesRepCombo, width: 220, renderer: 'proxy' }
		];
	}
});
