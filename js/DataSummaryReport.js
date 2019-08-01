Cooler.DataSummaryReportForm = Ext.extend(Cooler.Form, {

	controller: 'DataSummaryReport',

	keyColumn: 'SmartDeviceLogId',

	title: 'Data Summary',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DataSummary',
	constructor: function (config) {
		Cooler.DataSummaryReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'EventTime' } }
		});
	},
	comboTypes: [
		'AssetType'
	],
	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'SmartDeviceLogId' },
			{ type: 'int', dataIndex: 'AssetId' },
			{ header: 'Date', type: 'date', dataIndex: 'EventTime', renderer: ExtHelper.renderer.Date },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Type', type: 'int', dataIndex: 'AssetTypeId', displayIndex: 'AssetType', width: 150, store: this.comboStores.AssetType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }) },
			{ header: 'Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			//{ header: 'Light', dataIndex: 'LightIntensity', width: 50, type: 'int', align: 'right', renderer: this.lightRenderer },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', width: 110 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 170 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 110 },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 110 },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 110 },
			{ header: 'Door Count', type: 'int', dataIndex: 'DoorCount', width: 50 },
			{ header: 'Light On Hrs', dataIndex: 'LightOn', width: 160, type: 'string' },
			{ header: 'Light Off Hrs', dataIndex: 'LightOff', width: 160, type: 'string' },
			//{ header: 'Total Full Brightness (hrs)', type: 'string', dataIndex: 'FullLightBrightnessHrsMins', width: 100, sortable: false },
			//{ header: 'Total Medium Brightness (hrs)', type: 'string', dataIndex: 'MediumBrightnessHrsMins', width: 100, sortable: false },
			//{ header: 'Total Low Brightness (hrs)', type: 'string', dataIndex: 'LowBrightnessHrsMins', width: 100, sortable: false },
			//{ header: 'Total No Light (hrs)', type: 'string', dataIndex: 'NoLightHrsMins', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (<3)', type: 'string', dataIndex: 'LessThen3HrsMins', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>3, <8)', type: 'string', dataIndex: 'GreaterThen3HrsMins', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>8, <10)', type: 'string', dataIndex: 'GreaterThen8HrsMins', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>10, <12)', type: 'string', dataIndex: 'GreaterThen10HrsMins', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>12)', type: 'string', dataIndex: 'GreaterThen12HrsMins', width: 100, sortable: false },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'Channel', width: 110 },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 110 },
			{ header: 'Sub Trade Channel Name', type: 'string', dataIndex: 'SubTradeChannel', width: 150 },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesHierarchy', width: 150 },
			{ header: 'Sales Hierarchy', dataIndex: 'SalesHierarchyDetail', type: 'string', width: 250 }
			//{ header: 'BD Username', type: 'string', dataIndex: 'BDUsername', width: 150, menuDisabled: true, quickFilter: false },
			//{ header: 'BD Name', type: 'string', dataIndex: 'BDName', width: 150, menuDisabled: true, quickFilter: false },
		];
	},
	//lightRenderer: function (value, model, record) {
	//	var lightIntensity = record.data.LightIntensity,
	//		toReturn = 'N/A';
	//	if (lightIntensity == -1) {
	//		toReturn = 'N/A';
	//	}
	//	else {
	//		toReturn = lightIntensity;
	//	}

	//	return toReturn;
	//},

	afterShowList: function (config) {
		Cooler.DateRangeFilter(this, 'EventTime', false);
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });

		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'startDateField', format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'endDateField', format: DA.Security.info.Tags.DateFormat });
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

		tbarItems.push('Outlet Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Outlet Name');
		tbarItems.push(this.locationNameTextField);

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
				var isValidDate = Cooler.DateRangeFilter(this, 'EventTime', false);
				if (!isValidDate) {
					return;
				}
				if (!isGridFilterApply) {
					this.grid.baseParams.limit = this.grid.pageSize;
					this.grid.store.load();
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue();
				this.endDateField.setValue();
				this.clientCombo.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
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
				this.grid.topToolbar.items.get(index).setValue('');
			}
		}
	}
});
Cooler.DataSummaryReport = new Cooler.DataSummaryReportForm({ uniqueId: 'DataSummaryReport' });