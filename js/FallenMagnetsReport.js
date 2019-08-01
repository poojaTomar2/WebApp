Cooler.FallenMagnetsReport = Ext.extend(Cooler.Form, {

	controller: 'FallenMagnetsReport',

	keyColumn: 'SmartDeviceId',

	title: 'Fallen Magnets Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'FallenMagnetsReport',
	constructor: function (config) {
		Cooler.FallenMagnetsReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'HealthDoorDifference' } },
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
			{ header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', dataIndex: 'LocationName', type: 'string' },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string' },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
			{ header: 'Smart Device Serial Number', type: 'string', dataIndex: 'DeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Last Health Record', type: 'date', dataIndex: 'LastHealthRecordOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, type: 'date' },
			{ header: 'Last Door Record', type: 'date', dataIndex: 'LastDoorRecordOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, type: 'date' },
			{ header: 'Health - Door Difference', type: 'int', dataIndex: 'HealthDoorDifference', width: 150 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 110 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 110 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'TradeChannel', width: 110 },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'TradeChannelCode', type: 'string', width: 120 },
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
			{ header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150, type: 'string' },
			{ header: 'Client', type: 'string', dataIndex: 'Client', width: 110 }
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.CustomDaysTextField = new Ext.form.NumberField({
			width: 50, name: 'CustomDays', allowDecimals: false, itemId: 'CustomDays', maxLength: 3, minValue: 0
		});
		this.CustomDaysTextField.setValue('14');
		tbarItems.push('Days ');
		tbarItems.push(this.CustomDaysTextField);
		tbarItems.push('|');

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
					if (this.CustomDaysTextField.getValue() === '') {
						Ext.MessageBox.minWidth = 200;
						Ext.MessageBox.alert('Errors', 'Please Enter Custom Days.');
						return;
					}
					if (this.CustomDaysTextField.getValue() < 0) {
						Ext.MessageBox.minWidth = 200;
						Ext.MessageBox.alert('Errors', 'Please Enter Valid Custom Days.');
						return;
					}
					this.grid.baseParams.customDays = this.CustomDaysTextField.getValue();

					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}

			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				//this.grid.baseParams.daysCombo = this.daysCombo.getValue();
				this.grid.baseParams.customDays = this.CustomDaysTextField.getValue();
				//this.daysCombo.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
				this.CustomDaysTextField.setValue('14');
				//this.CustomDaysTextField.setDisabled(true);
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var customDays = this.grid.topToolbar.items.get('CustomDays');
		var resetField = ['LocationCode', 'LocationName', 'AssetSerial', 'CustomDays'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				this.grid.topToolbar.items.get(index).setValue('');
				if (this.grid.topToolbar.items.get(index).name == 'CustomDays') {
					this.grid.topToolbar.items.get(index).setValue('14');
				}
			}
		}
		this.grid.baseParams.customDays = customDays.getValue();
	}
});
Cooler.FallenMagnetsReport = new Cooler.FallenMagnetsReport({ uniqueId: 'FallenMagnetsReport' });