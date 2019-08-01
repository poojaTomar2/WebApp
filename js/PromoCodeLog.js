Cooler.PromoCodeLog = Ext.extend(Cooler.Form, {

	controller: 'PromoCodeLog',

	keyColumn: 'PromoCodeLogId',

	title: 'PromoCode Log',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'PromoCodeLog',
	comboTypes: [
		'Client',
		'Country',
		'ThirdPartyAppName',
		'SmartDeviceType'
	],
	constructor: function (config) {
		Cooler.PromoCodeLog.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'PromoCodeLogId' } },
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
			{ header: 'Id', type: 'int', dataIndex: 'PromoCodeLogId' },
			{ type: 'int', dataIndex: 'DateFormatId' },
			{ dataIndex: 'SmartDeviceId', type: 'int', width: 150 },
			{ dataIndex: 'SmartDeviceTypeId', type: 'int', width: 150 },
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
			{ header: 'PromoCode', dataIndex: 'PromoCode', type: 'string', width: 150 },
			{ header: 'PromoCode Created On (UTC)', dataIndex: 'PromoCodeCreatedOn', width: 130, type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'PromoCode Created On (Only Date)', dataIndex: 'PromoCodeCreatedOnOnlyDate', type: 'date', width: 150, renderer: Cooler.renderer.MonthDateYear },
			{ header: 'PromoCode Created On (Only Hrs. UTC)', dataIndex: 'PromoCodeCreatedOnOnlyHrs', type: 'string', width: 150 },
			{ header: 'Incremental OR NonIncremental', dataIndex: 'IncrementalORNonIncremental', type: 'string', width: 150 },
			{ header: 'Difference to last detected beacon with message sent', dataIndex: 'DiffLastbeaconwithMessage', type: 'int', width: 150 },
			{ header: 'Transaction Threshold (Hrs.)', dataIndex: 'TransactionThreshold', type: 'int', width: 150 },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'ApplicationName ', dataIndex: 'ApplicationId', displayIndex: 'ApplicationName', type: 'int', store: this.comboStores.ThirdPartyAppName, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.ThirdPartyAppName }) },
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
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
		this.startDateField = new Ext.form.DateField({
			name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
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
							this.startDateField.setValue(Cooler.DateOptions.AddDays(this.endDateField.getValue(), -6));
						}
						else {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
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
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.store.load();
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -30));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
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
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date(), -6));
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
Cooler.PromoCodeLog = new Cooler.PromoCodeLog({ uniqueId: 'PromoCodeLog' });