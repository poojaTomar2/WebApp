Cooler.DeviceMajorMinorBulkUpdateReport = Ext.extend(Cooler.Form, {

	controller: 'DeviceMajorMinorBulkUpdateReport',

	keyColumn: 'SmartDeviceCommandId',

	title: 'UUID & Major/Minor report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'MajorMinorUpdateReport',
	constructor: function (config) {
		Cooler.DeviceMajorMinorBulkUpdateReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
            { header: 'Device Serial Number', type: 'string', dataIndex: 'SerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Command Type', type: 'string', dataIndex: 'CommandType', width: 150 },
			{ header: 'Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'IbeaconUUID', type: 'string', dataIndex: 'IbeaconUUID', width: 150 },
			{ header: 'Major', type: 'int', dataIndex: 'IBeaconMajor', align: 'right' },
			{ header: 'Minor', type: 'int', dataIndex: 'IBeaconMinor', align: 'right' },
            { header: 'Eddystone Namespace', dataIndex: 'EddystoneUid', type: 'string', width: 130, quickFilter: false, sortable: false },
            { header: 'Eddystone Instance', dataIndex: 'EddystoneNameSpace', type: 'string', width: 90, quickFilter: false, sortable: false },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Associated On', dataIndex: 'AssetAssociatedOn', type: 'date', width: 160, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Associated By BD User Name', dataIndex: 'AssetAssociatedByUser', type: 'string' },
			{ header: 'Associated By BD Name', dataIndex: 'AssetAssociatedByUserName', type: 'string' },
			{ header: 'Location', dataIndex: 'LocationName', type: 'string' },
            { header: 'Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Value', type: 'string', dataIndex: 'Value', width: 150, hidden: true },
			{ header: 'Result', type: 'string', dataIndex: 'Result', width: 150 },
			{ header: 'Requested On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer, hidden: false },
			{ header: 'Executed On', dataIndex: 'ExecutedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Status', dataIndex: 'CommandStatus', width: 130, type: 'string' },
			{ header: 'Is Success', dataIndex: 'CommandExecutionStatus', width: 130, type: 'string' },
            { header: 'Country', dataIndex: 'Country', width: 130, type: 'string' },
            { header: 'Trade Channel', dataIndex: 'Channel', type: 'string' },
			{ header: 'Trade Channel Code', hidden: true, dataIndex: 'ChannelCode', type: 'string' },
            { header: 'Customer Tier', dataIndex: 'CustomerTier', width: 120, type: 'string' },
			{ header: 'Customer Tier Code', hidden: true, dataIndex: 'CustomerTierCode', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel', dataIndex: 'SubTradeChannel', width: 120, type: 'string' },
			{ header: 'Sub Trade Channel Code', hidden: true, dataIndex: 'SubTradeChannelTypeCode', width: 120, type: 'string' },
            { header: 'Sales Organization', dataIndex: 'SalesOrganizationName', width: 150, type: 'string' },
            { header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', dataIndex: 'SalesOfficeName', width: 150, type: 'string' },
            { header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', dataIndex: 'SalesGroupName', width: 150, type: 'string' },
            { header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', dataIndex: 'SalesTerritoryName', width: 150, type: 'string' },
			{ header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150, type: 'string' },
            { header: 'City', dataIndex: 'City', width: 130, type: 'string' },
            { header: 'Address', dataIndex: 'Street', width: 130, type: 'string' }
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.CustomDaysTextField = new Ext.form.NumberField({
			width: 100, name: 'CustomDays', allowDecimals: false, maxLength: 3, minValue: 0
		});

		var daysStore = [[7, 'Last 7 Days'], [14, 'Last 14 Days'], [30, 'Last 30 Days'], [60, 'Last 60 Days'], [90, 'Last 90 Days'], [120, 'Last 120 Days'], [1, 'Custom']];
		var daysCombo = DA.combo.create({ fieldLabel: 'Record Days  ', value: 7, hiddenName: 'RecordDays', store: daysStore, width: 130, listeners: { select: this.comboSelect, scope: this } });
		this.daysCombo = daysCombo;


		tbarItems.push('Days');
		tbarItems.push(this.daysCombo);
		tbarItems.push('|');
		tbarItems.push('Custom Days ');
		tbarItems.push(this.CustomDaysTextField);
		tbarItems.push('|');

		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);
		this.CustomDaysTextField.setDisabled(true);
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
					this.grid.baseParams.daysCombo = this.daysCombo.getValue();
					if (this.daysCombo.getValue() == 1) {
						if (this.CustomDaysTextField.getValue() === '') {
							Ext.MessageBox.minWidth = 200;
							Ext.MessageBox.alert('Errors', 'Please Enter Custom Days.');
							return;
						}
						if (this.CustomDaysTextField.getValue() <= 0) {
							Ext.MessageBox.minWidth = 200;
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
		var resetField = ['LocationCode', 'LocationName', 'AssetSerial', 'CustomDays'], index;
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
	comboSelect: function (field, newValue, oldValue) {
		if (field.value == 1) {
			this.CustomDaysTextField.setDisabled(false);
		}
		else {
			this.CustomDaysTextField.setDisabled(true);
		}
	}

});
Cooler.DeviceMajorMinorBulkUpdateReport = new Cooler.DeviceMajorMinorBulkUpdateReport({ uniqueId: 'DeviceMajorMinorBulkUpdateReport' });