Cooler.ThirdPartyPromotionHistory = Ext.extend(Cooler.Form, {

	controller: 'ThirdPartyPromotionHistory',

	title: 'Third Party Promotion History',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'ThirdPartyPromotionHistory',
	comboTypes: [
		'Client',
		'Country',
		'ThirdPartyAppName',
		'SmartDeviceType'
	],
	//gridConfig: {
	//	custom: {
	//		loadComboTypes: true
	//	}
	//},
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			multiLineToolbar: true,
			//groupField: 'Location',
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.ThirdPartyPromotionHistory.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'ThirdPartyNotificationId' } }
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
					{ type: 'int', dataIndex: 'DateFormatId' },
					{ dataIndex: 'SmartDeviceId', type: 'int', width: 150 },
					{ dataIndex: 'SmartDeviceTypeId', type: 'int', width: 150 },
					{ header: 'Id', type: 'int', dataIndex: 'ThirdPartyNotificationId' },
                    { header: 'Smart Device Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
					{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
					{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
                    { header: 'Outlet Code', dataIndex: 'OutletCode', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
					{ header: 'Outlet', dataIndex: 'OutletName', type: 'string', width: 150 },
					{ header: 'Third Party Promotion Id', dataIndex: 'ThirdPartyPromotionId', type: 'int', width: 150 },
					{ header: 'Third Party Promotion Name', dataIndex: 'ThirdPartyPromotionName', type: 'string', width: 150 },
					{ header: 'Third Party Promotion Grouping', dataIndex: 'ThirdPartyPromotionGrouping', type: 'string', width: 150 },
					//{ header: 'Third Party Promotion LocationId', dataIndex: 'ThirdPartyPromotionLocationId', type: 'int', width: 150 },
					{ header: 'Data', dataIndex: 'Data', type: 'string', width: 150, hidden: true },
					{ header: 'Created On (UTC)', dataIndex: 'CreatedOn', width: 130, type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
					{ header: 'Created On (Only Date)', dataIndex: 'OnlyDate', type: 'date', width: 150, renderer: Cooler.renderer.MonthDateYear, hidden: true },
					{ header: 'Created On (Only Hrs. UTC)', dataIndex: 'OnlyHrs', type: 'string', width: 150, hidden: true },
					{ header: 'Platform', dataIndex: 'Platform', type: 'string', width: 150 },
					{ header: 'Message To App', dataIndex: 'MessageToApp', type: 'string', width: 150, hidden: true },
					{ header: 'Detection Type', dataIndex: 'DetectionType', type: 'string', width: 150 },
					{ header: 'Message Sent', dataIndex: 'MessageSent', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
					{ header: 'Message Opened', dataIndex: 'MessageOpened', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
					{ header: 'Message Opened (Time)', dataIndex: 'MessageOpenedTime', width: 130, type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
					{ header: 'Message Opened (Only Date)', dataIndex: 'MessageOpenedOnlyDate', type: 'date', width: 150, renderer: Cooler.renderer.MonthDateYear, hidden: true },
					{ header: 'Message Opened (Only Hrs. UTC)', dataIndex: 'MessageOpenedOnlyHrs', type: 'string', width: 150, hidden: true },
					{ header: 'Incremental PromoCode', dataIndex: 'IncrementalPromoCode', type: 'int', width: 150 },
					{ header: 'NonIncremental PromoCode', dataIndex: 'NonIncrementalPromoCode', type: 'int', width: 150 },
					{ header: 'Transaction Threshold (Hrs.)', dataIndex: 'TransactionThreshold', type: 'int', width: 150 },
					{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
					{ header: 'ApplicationName ', dataIndex: 'ThirdPartyAppId', displayIndex: 'ApplicationName', type: 'int', store: this.comboStores.ThirdPartyAppName, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.ThirdPartyAppName }) },
					{ header: 'Application UDID', type: 'string', dataIndex: 'AppUuid', width: 150 },
					{ header: 'City', type: 'string', dataIndex: 'City', width: 150 },
					{ header: 'Trade Channel', dataIndex: 'TradeChannel', width: 120, type: 'string' },
					{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', width: 120, type: 'string' },
					{ header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
					{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
					{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
					{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode', width: 150 },
					{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
					{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
					{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
					{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' }
					
					

		];
	},

	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
		this.grid.baseParams.PlatformId = this.platformCombo.getValue();
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var platformStore = [[1, 'All'], [2, 'android'], [3, 'iOS']];
		var platformCombo = DA.combo.create({ fieldLabel: 'Platform ', value: 1, name: 'PlatformId', hiddenName: 'PlatformId', store: platformStore, width: 180 });
		this.platformCombo = platformCombo;


		tbarItems.push('Platform');
		tbarItems.push(this.platformCombo);
		this.startDateField = new Ext.form.DateField({
			name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -30), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		this.endDateField = new Ext.form.DateField({
			name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {

				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				var sDateTime = this.startDateField.getValue();
				var eDateTime = this.endDateField.getValue();
				var platformId = this.platformCombo.getValue();
				if (sDateTime != '' && eDateTime != '') {
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
					else {
						if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
							Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
							return;
						}
					}
				}
				this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
				if (!isGridFilterApply) {
					if (!this.startDateField.getValue()) {
						if (this.endDateField.getValue()) {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(this.endDateField.getValue(), -30));
						}
						else {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -30));
						}
					}
					if (!this.endDateField.getValue()) {
						this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
					}
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					this.grid.baseParams.PlatformId = platformId;
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				var platformId = 1;
				this.grid.store.load();
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -30));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.grid.baseParams.PlatformId = platformId;
				this.platformCombo.reset();
				this.grid.store.load();
			}, scope: this
		});
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date(), -30));
				}
				else if (resetField[i] == 'endDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date()));
				}
				else {
					this.grid.topToolbar.items.get(index).setValue('');
				}
			}
		}
	},
	stringToDate: function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

});
Cooler.ThirdPartyPromotionHistory = new Cooler.ThirdPartyPromotionHistory({ uniqueId: 'ThirdPartyPromotionHistory' });