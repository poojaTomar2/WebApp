Cooler.DataGapAnalysisReportForm = Ext.extend(Cooler.Form, {

	controller: 'DataGapAnalysisReport',

	keyColumn: 'SmartDeviceId',

	title: 'Data Gap Analysis Report',

	disableAdd: true,
	securityModule: 'DataGapAnalysisReport',
	disableDelete: true,

	constructor: function (config) {
		Cooler.DataGapAnalysisReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}

		});
	},
	comboTypes: [
           'TimeZone'
	],
	comboStores: {
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
            { header: 'Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Outlet Code', type: 'string', dataIndex: 'OutletCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'OutletName', width: 170 },
			{ header: 'Outlet Type', type: 'string', dataIndex: 'OutletType', width: 170 },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Cooler IOT Client', type: 'string', dataIndex: 'Client', width: 150 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 150 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 150 },
			{ header: 'Asset Associated On', type: 'date', dataIndex: 'AssetAssociatedOn', width: 150, renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Asset Associated By BD UserName', type: 'string', dataIndex: 'AssetAssociatedByUserName', width: 150 },
			{ header: 'Customer Tier Code', type: 'string', dataIndex: 'CustomerTierCode', width: 150, hidden: true },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 150 },
			{ header: 'Sub Trade Channel Name', type: 'string', dataIndex: 'SubTradeChannelName', width: 150 },
			{ header: 'Trade Channel Code', type: 'string', dataIndex: 'ChannelCode', width: 150, hidden: true },
			{ header: 'Sub Trade Channel Code', type: 'string', dataIndex: 'SubTradeChannelTypeCode', width: 150, hidden: true },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Organization Code', type: 'string', dataIndex: 'SalesOrganizationCode', width: 150, hidden: true },
			{ header: 'Sales Office Code', type: 'string', dataIndex: 'SalesOfficeCode', width: 150, hidden: true },
			{ header: 'Sales Group Code', type: 'string', dataIndex: 'SalesGroupCode', width: 150, hidden: true },
			{ header: 'Sales Territory Code', type: 'string', dataIndex: 'SalesTerritoryCode', width: 150, hidden: true },
            { header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannel', width: 150 },
			{ header: 'Total Number Of Health Events Count', type: 'int', dataIndex: 'RecordCount', width: 150 },
			{ header: 'Total Number Of Health Events Count(Time Basis)', type: 'int', dataIndex: 'TimeRecordCount', width: 150 },
			{ header: 'Gap Count', type: 'int', dataIndex: 'Diff', width: 150 },
			{ header: 'Last Cabinet Temperature Created On time', type: 'date', dataIndex: 'LatestHealthCreatedOn', width: 150, renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'CCH Solution', type: 'string', dataIndex: 'CCHSolution', width: 150 },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' }

		];
	},



	afterShowList: function (config) {
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
				var eDateTime = this.endDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.grid.store.load();
				delete this.grid.getStore().baseParams['limit'];

			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.showInstalledCheckbox.reset();
				this.validationCheckbox.reset();
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.compareStartDateField.setValue('');
				this.compareEndDateField.setValue('');
				this.grid.baseParams.CompareStartDate = this.compareStartDateField.getValue();
				this.grid.baseParams.CompareEndDate = this.compareEndDateField.getValue();
				this.grid.baseParams.ShowInstalled = this.showInstalledCheckbox.getValue();
				this.grid.baseParams.validationDate = this.validationCheckbox.getValue();
				this.clientCombo.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
				this.selectedAssetId = 0;
				this.DataGapAnalysisReportGrid.setDisabled(true);
				this.DataGapAnalysisReportGrid.store.removeAll()
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate', 'ClientId', 'LocationCode', 'LocationName', 'AssetSerial', 'compareStartDate', 'compareEndDate'], index;
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
		delete this.grid.baseParams['validationDate'];
	}
});
Cooler.DataGapAnalysisReport = new Cooler.DataGapAnalysisReportForm({ uniqueId: 'DataGapAnalysisReport' });