Cooler.TemperatureAndLightReportForm = Ext.extend(Cooler.Form, {

	controller: 'TemperatureAndLightReport',

	keyColumn: 'SmartDeviceHealthRecordId',

	title: 'Temperature And Light',

	disableAdd: true,

	disableDelete: true,

	securityModule: 'TemperatureAndLightReport',

	constructor: function (config) {
		Cooler.TemperatureAndLightReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
		    defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceHealthRecordId' } },
		    custom: {
		        loadComboTypes: true
		    },
		    listeners: {
		    	'cellclick': this.onListGridCellClick,
		    	scope: this
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
			{ header: 'Data Last Uploaded', type: 'date', dataIndex: 'CreatedOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Data Last Recorded', type: 'date', dataIndex: 'EventTime', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Last Upload - Last Record (in days hrs > 24)', type: 'int', dataIndex: 'LastUpload', width: 150, align: 'right' },
            { header: 'Total Light On (hrs)', type: 'string', dataIndex: 'LightOn', width: 100, sortable: false },
			{ header: 'Total Light Off (hrs)', type: 'string', dataIndex: 'LightOff', width: 100, sortable: false },
            //{ header: 'Total Full Brightness (hrs)', type: 'string', dataIndex: 'FullLightBrightness', width: 100, sortable: false },
			//{ header: 'Total Medium Brightness (hrs)', type: 'string', dataIndex: 'MediumBrightness', width: 100, sortable: false },
			//{ header: 'Total Low Brightness (hrs)', type: 'string', dataIndex: 'LowBrightness', width: 100, sortable: false },
			//{ header: 'Total No Light (hrs)', type: 'string', dataIndex: 'NoLight', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (<3)', type: 'string', dataIndex: 'LessThen3', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>3, <8)', type: 'string', dataIndex: 'GreaterThen3', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>8, <10)', type: 'string', dataIndex: 'GreaterThen8', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>10, <12)', type: 'string', dataIndex: 'GreaterThen10', width: 100, sortable: false },
			{ header: 'Total Temp Hrs (>12)', type: 'string', dataIndex: 'GreaterThen12', width: 100, sortable: false },
			{ header: 'Total Hours Data (for selected period)', type: 'string', dataIndex: 'TotalHealthInterval', width: 100, align: 'right', sortable: false },
			{ header: 'Total days Data (for selected period)', type: 'int', dataIndex: 'FullDayEvent', width: 100, align: 'right' },
			//{ header: 'Moved', type: 'string', dataIndex: 'AssetMoved', width: 100, align: 'right', renderer: Cooler.assetMoved },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 110 },
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
            { header: 'Sales Territory Code', hidden: true, dataIndex: 'SalesTerritoryCode', width: 150, type: 'string' },
            { header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' }
		];
	},

	onListGridCellClick: function (grid, rowIndex) {
		var row = grid.getStore().getAt(rowIndex);
		var assetId = row.get('AssetId');
		if (!assetId || (this.selectedAssetId && this.selectedAssetId === assetId)) {
			return false;
		}
		this.selectedAssetId = assetId;
		var grid = this.temperatureAndLightReportDetailGrid;
		var store = grid.getStore();
		grid.setDisabled(false);
		store.baseParams.AssetId = assetId;
		store.baseParams.StartDate = this.startDateField.getValue();
		store.baseParams.EndDate = this.endDateField.getValue();
		store.load();
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
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.startDateField = new Ext.form.DateField({
			name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({
			name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });

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
				this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
				if (!isGridFilterApply) {
					//this.grid.baseParams.limit = this.grid.pageSize;
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
					this.temperatureAndLightReportDetailGrid.setDisabled(true);
					this.temperatureAndLightReportDetailGrid.store.removeAll();
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
					this.selectedAssetId = 0;
					this.temperatureAndLightReportDetailGrid.setDisabled(true);
					this.temperatureAndLightReportDetailGrid.store.removeAll();
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
				this.temperatureAndLightReportDetailGrid.setDisabled(true);
				this.temperatureAndLightReportDetailGrid.store.removeAll()
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		this.temperatureAndLightReportDetailGrid = Cooler.TemperatureAndLightReportDetail.createGrid({ title: 'Temperature And Light Detail', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [
				this.temperatureAndLightReportDetailGrid
			],
			height: 200,
			split: true,
			enableTabScroll: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
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
Cooler.TemperatureAndLightReport = new Cooler.TemperatureAndLightReportForm({ uniqueId: 'TemperatureAndLightReport' });