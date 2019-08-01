Cooler.DataUploadReportForm = Ext.extend(Cooler.Form, {

	controller: 'DataUploadReport',

	keyColumn: 'SmartDeviceHealthRecordId',

	title: 'Data Upload By Asset',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DataUploadReport',
	constructor: function (config) {
		Cooler.DataUploadReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
		    defaults: { sort: { dir: 'DESC', sort: 'AssetId' } },
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
			{ type: 'int', dataIndex: 'SmartDeviceHealthRecordId' },
			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ type: 'int', dataIndex: 'DateFormatId' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
			{ header: 'Installation Date', type: 'date', dataIndex: 'AssetAssociatedOn', width: 150, renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Upload Date', type: 'date', dataIndex: 'Date', width: 100, renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', width: 100 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 170 },
			{ header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDevice', width: 150 },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Moved', type: 'string', dataIndex: 'AssetMoved', width: 100, align: 'right', renderer: Cooler.assetMoved },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 100 },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 100 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 100 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'Channel', width: 100 },
            { header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', type: 'string', width: 120 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 100 },
            { header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', type: 'string', dataIndex: 'SubTradeChannel', width: 150 },
            { header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 150, type: 'string' },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode', width: 150 },
            { header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' },
            { header: 'CCH Solution', dataIndex: 'CCHSolution', type: 'string', width: 150 }
		];
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		if (DA.Security.info.Tags.ClientId == 0) {
			tbarItems.push('Client');
			tbarItems.push(this.clientCombo);
		}
		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);

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

				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					isGridFilterApply = true;
					var clientNameFilter = this.grid.gridFilter.getFilter('ClientName');
					clientNameFilter.active = true;
					clientNameFilter.setValue(this.clientCombo.getRawValue());
				}

				if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
					isGridFilterApply = true;
					var locationCodeFilter = this.grid.gridFilter.getFilter('LocationCode');
					locationCodeFilter.active = true;
					locationCodeFilter.setValue(this.locationCodeTextField.getValue());
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					isGridFilterApply = true;
					var locationNameFilter = this.grid.gridFilter.getFilter('LocationName');
					locationNameFilter.active = true;
					locationNameFilter.setValue(this.locationNameTextField.getValue());
				}
				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					isGridFilterApply = true;
					var assetSerialFilter = this.grid.gridFilter.getFilter('AssetSerialNumber');
					assetSerialFilter.active = true;
					assetSerialFilter.setValue(this.assetSerialTextField.getValue());
				}
				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
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
					this.selectedAssetId = 0;
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.clientCombo.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
				this.selectedAssetId = 0;
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate', 'ClientId', 'LocationCode', 'LocationName', 'AssetSerial'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate'){
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
	}
});
Cooler.DataUploadReport = new Cooler.DataUploadReportForm({ uniqueId: 'DataUploadReport' });