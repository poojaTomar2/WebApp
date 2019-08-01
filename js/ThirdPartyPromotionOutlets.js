Cooler.ThirdPartyPromotionOutlets = Ext.extend(Cooler.Form, {
	controller: 'ThirdPartyPromotionOutlets',
	title: 'Third Party Promotion Outlet',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'ThirdPartyPromotionOutlet',
	comboTypes: [
		'Client',
		'Country',
		'ThirdPartyAppName',
		'SmartDeviceType'
	],
	constructor: function (config) {
		Cooler.ThirdPartyPromotionOutlets.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'LocationId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		ThirdPartyAppName: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'LocationId' },
            { header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 150 },
			{ header: 'Country ', dataIndex: 'CountryId', displayIndex: 'Country', type: 'int', store: this.comboStores.Country, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) },
			{ header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'TradeChannel', width: 120, type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', width: 120, type: 'string' },
			{ header: 'Promotion Id', type: 'int', dataIndex: 'PromotionId', width: 100 },
			{ header: 'Promotion Name', dataIndex: 'PromotionName', width: 120, type: 'string' },
			{ header: 'Application ', dataIndex: 'ThirdPartyAppId', displayIndex: 'ApplicationName', type: 'int', store: this.comboStores.ThirdPartyAppName, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.ThirdPartyAppName }) },
			{ header: 'Application Id', type: 'int', dataIndex: 'ThirdPartyAppId', width: 100, hidden: true },
			{ header: 'Promotion Grouping', dataIndex: 'ThirdPartyPromotionGrouping', width: 120, type: 'string' },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) }
		];
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var filterFields = ['OutletCode'];
		this.filterFields = filterFields;
		this.outletCodeTextField = new Ext.form.TextField({ width: 150 });
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				var outletCount = this.outletCodeTextField.getValue();
				var isComma = /[,\-]/.test(outletCount)	// To check comma exists or not in search string
				var array = [outletCount];
				var counts = '';
				if (isComma) {
					counts = (array.join().match(/,/g).length + 1)	// Count total commas + 1, in search string
					if (counts <= 1000) {
						outletCount = outletCount.replace(/,\s*$/, ""); // Remove Comma al the end of string
						this.resetGridStore();
						if (!Ext.isEmpty(this.outletCodeTextField.getValue())) {
							Ext.applyIf(this.grid.getStore().baseParams, { OutletCode: outletCount });
						}
						this.grid.loadFirst();
					}
					else {
						Ext.Msg.alert('Alert', "You can't search more then 1000 records.");
					}
				}
				if (!isComma) {
					outletCount = outletCount.replace(/,\s*$/, "");
					this.resetGridStore();
					if (!Ext.isEmpty(this.outletCodeTextField.getValue())) {
						Ext.applyIf(this.grid.getStore().baseParams, { OutletCode: outletCount });
					}
					this.grid.loadFirst();
				}
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.resetGridStore();
				this.outletCodeTextField.reset();
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push('Outlet Code');
		tbarItems.push(this.outletCodeTextField);
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	}
});
Cooler.ThirdPartyPromotionOutlets = new Cooler.ThirdPartyPromotionOutlets({ uniqueId: 'ThirdPartyPromotionOutlets' });