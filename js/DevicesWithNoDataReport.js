Cooler.DevicesWithNoDataReportForm = Ext.extend(Cooler.Form, {

	controller: 'DevicesWithNoDataReport',

	keyColumn: 'SmartDeviceHealthRecordId',

	title: 'Devices With No Data',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DevicesWithNoDataReport',
	constructor: function (config) {
		Cooler.DevicesWithNoDataReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceId' } },
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
			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', width: 110 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 170 },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDevice', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Installation Date', type: 'date', dataIndex: 'AssetAssociatedOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Data Last Uploaded In Selected Date Range', type: 'date', dataIndex: 'CreatedOn', width: 150, renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer },
			{ header: 'Data Last Recorded', type: 'date', dataIndex: 'EventTime', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
            { header: 'Days Since Installation (in days hrs > 24)', type: 'int', dataIndex: 'DateSincInstallation', width: 100 },
            { header: 'Days Since Last Health record (in days hrs > 24)', type: 'string', dataIndex: 'DaysSinceLastHealthRecord', width: 100 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 110, quickFilter: false },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 110 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 110 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'Channel', width: 110 },
            { header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', type: 'string', width: 120 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 110 },
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
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' }
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.CustomDaysTextField = new Ext.form.NumberField({
			width: 100, name: 'CustomDays', allowDecimals: false, maxLength: 3, minValue: 0 
		});
	
		var daysStore = [[7, 'Last 7 Days'], [14, 'Last 14 Days'], [30, 'Last 30 Days'], [60, 'Last 60 Days'], [90, 'Last 90 Days'], [120, 'Last 120 Days'], [1, 'Custom']];
		var daysCombo = DA.combo.create({ fieldLabel: 'Record Days  ', value: 7, id:'test1', hiddenName: 'RecordDays', name: 'RecordDays', store: daysStore, width: 130, listeners: {	select : this.comboSelect, scope : this } });
		this.daysCombo = daysCombo;

		tbarItems.push('Days');
		tbarItems.push(this.daysCombo);
		tbarItems.push('|');
		tbarItems.push('Custom Days ');
		tbarItems.push(this.CustomDaysTextField);
		tbarItems.push('|');

		if (DA.Security.info.Tags.ClientId == 0) {
			tbarItems.push('Client ');
			tbarItems.push(this.clientCombo);
		}
		tbarItems.push('Asset Serial# ');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code ');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);
		this.CustomDaysTextField.setDisabled(true);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
					var isGridFilterApply = false;
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
						//this.grid.baseParams.limit = this.grid.pageSize;
						this.grid.baseParams.daysCombo = this.daysCombo.getValue();
						if (this.daysCombo.getValue() == 1) {
							if (this.CustomDaysTextField.getValue() === '') {
								Ext.MessageBox.alert('Errors', 'Please Enter Custom Days.');
								return;
							}
							if (this.CustomDaysTextField.getValue() <= 0) {
								Ext.MessageBox.alert('Errors', 'Please Enter Valid Custom Days.');
								return;
							}
							this.grid.baseParams.customDays = this.CustomDaysTextField.getValue();
						}
						this.grid.store.load();
						delete this.grid.getStore().baseParams['limit'];	
					}
					
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.grid.baseParams.daysCombo = this.daysCombo.getValue();
				this.grid.baseParams.customDays = this.CustomDaysTextField.getValue();				
				this.daysCombo.reset();
				this.clientCombo.reset();
				this.CustomDaysTextField.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
				this.CustomDaysTextField.setDisabled(true);
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var resetField = ['ClientId', 'LocationCode', 'LocationName', 'AssetSerial', 'CustomDays'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			
			if (index != -1) {
				this.grid.topToolbar.items.get(index).setValue('');
				if (this.grid.topToolbar.items.get(index).name == 'CustomDays') {
					this.grid.topToolbar.items.get(index).setDisabled(true);
				}
			}	
		}
		var comboIndex = this.grid.topToolbar.items.findIndex('hiddenName', 'RecordDays');
		this.grid.topToolbar.items.get(comboIndex).reset();
		delete this.grid.baseParams['customDays'];
		this.grid.baseParams.daysCombo = this.grid.topToolbar.items.get(comboIndex).getValue();
	},
	comboSelect: function (field, newValue,oldValue) {
		if (field.value == 1) {
			this.CustomDaysTextField.setDisabled(false);
		}
		else {
			this.CustomDaysTextField.setDisabled(true);
		}
	}
});
Cooler.DevicesWithNoDataReport = new Cooler.DevicesWithNoDataReportForm({ uniqueId: 'DevicesWithNoDataReport' });