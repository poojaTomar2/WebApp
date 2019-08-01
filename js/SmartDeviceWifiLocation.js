Cooler.SmartDeviceWifiLocationC1 = Ext.extend(Cooler.Form, {

	controller: 'SmartDeviceWifiLocation',

	keyColumn: 'SmartDeviceWifiLocationIdId',

	title: 'Wifi Location',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'SmartDeviceWiFiLocation',
	constructor: function (config) {
		Cooler.SmartDeviceWifiLocationC1.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceWifiLocationId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	onGridCreated: function (grid) {
		grid.on("celldblclick", this.celldblclick, this);
	},
	comboTypes: [
		'AssetType',
		'SmartDeviceType',
		'TimeZone'
	],
	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ header: 'Id', type: 'int', dataIndex: 'SmartDeviceWifiLocationId', width: 65 },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'WiFi Location Info', dataIndex: 'WifiLocationInfo', type: 'string', width: 290 },
			{ header: 'Cell Info', dataIndex: 'CellIdInfo', type: 'string', width: 290 },
			{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 80, align: 'right', allowDecimal: true },
			{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 80, align: 'right', allowDecimal: true },
			{ header: 'Accuracy', dataIndex: 'Accuracy', type: 'float', width: 80, align: 'right', allowDecimal: true },
			{ header: 'Event Time', dataIndex: 'EventTime', type: 'date', width: 180, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
            { header: 'Asset Serial #', dataIndex: 'AssetSerialNumber', type: 'string', width: 120, sortable: false, hyperlinkAsDoubleClick: true }, // hyperlinkAsDoubleClick: true Commented as per the ticket #752
			{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), store: this.comboStores.AssetType, width: 150 },
			{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
            { header: 'Smart Device# ', dataIndex: 'SerialNumber', type: 'string', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Mac', dataIndex: 'MacAddress', width: 120, type: 'string', sortable: false },
			{ header: 'Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string', width: 110, elasticDataIndex: 'GatewayMac' },
			{ header: 'Gateway#', dataIndex: 'GatewaySerialNumber', type: 'string', width: 110 },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 160 },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', width: 160, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string', width: 80 },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 200, type: 'int', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 150 }
		];
	},
	celldblclick: function (grid, rowIndex, e) {
		var column = this.cm.config[e];
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		var data = rec.data;
		var accuracy = data.Accuracy == 0 ? '' : data.Accuracy;
		Cooler.showGPSLocation(data.Latitude, data.Longitude, accuracy.toString());
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	onSearch: function () {
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
		//Cooler.DateRangeFilter(this, 'EventTime', true);
		var isValidDate = Cooler.DateRangeFilter(this, 'EventTime', true);
		if (!isValidDate) {
			return false;
		}
		if (!Ext.isEmpty(this.gateWayMacTextField.getValue())) {
			isGridFilterApply = true;
			var gatewayMacFilter = this.grid.gridFilter.getFilter('GatewayMacAddress');
			gatewayMacFilter.active = true;
			gatewayMacFilter.setValue(this.gateWayMacTextField.getValue());
		}
		if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
			isGridFilterApply = true;
			var locationNameFilter = this.grid.gridFilter.getFilter('Location');
			locationNameFilter.active = true;
			locationNameFilter.setValue(this.locationNameTextField.getValue());
		}

		if (!Ext.isEmpty(this.smartDeviceSerialTextField.getValue())) {
			isGridFilterApply = true;
			var serialNumberFilter = this.grid.gridFilter.getFilter('SerialNumber');
			serialNumberFilter.active = true;
			serialNumberFilter.setValue(this.smartDeviceSerialTextField.getValue());
		}

		if (!Ext.isEmpty(this.smartDeviceMacTextField.getValue())) {
			isGridFilterApply = true;
			var macAddressFilter = this.grid.gridFilter.getFilter('MacAddress');
			macAddressFilter.active = true;
			macAddressFilter.setValue(this.smartDeviceMacTextField.getValue());
		}

		if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
			isGridFilterApply = true;
			var assetSerialNumberFilter = this.grid.gridFilter.getFilter('AssetSerialNumber');
			assetSerialNumberFilter.active = true;
			assetSerialNumberFilter.setValue(this.assetSerialTextField.getValue());
		}

		if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
			isGridFilterApply = true;
			var locationCodeFilter = this.grid.gridFilter.getFilter('LocationCode');
			locationCodeFilter.active = true;
			locationCodeFilter.setValue(this.locationCodeTextField.getValue());
		}

		if (!isGridFilterApply) {
			this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
			this.grid.store.load();
			delete this.grid.getStore().baseParams['limit'];
		}

	},
	onClear: function () {

		if (this.isChildGrid != true) {
			this.smartDeviceSerialTextField.reset();
			this.smartDeviceMacTextField.reset();
			this.gateWayMacTextField.reset();
			this.assetSerialTextField.reset();
			this.locationCodeTextField.reset();
			this.locationNameTextField.reset();
		}
		this.grid.gridFilter.clearFilters();
		//this.clientCombo.reset();
		this.startDateField.setValue();
		this.endDateField.setValue();
		//var startDateFilter = this.grid.gridFilter.getFilter('EventTime');
		//startDateFilter.setActive(false);
		this.grid.loadFirst();
	},
	beforeRemoveFilter: function () {
		this.module.onClear()
	},
	afterShowList: function (config) {
		Cooler.DateRangeFilter(this, 'EventTime');
	},
	beforeGridCreate: function (config, plugin, overrideConfig) {
		var gridConfig = config.gridConfig;
		var tbarItems = [], isChildGrid = false;
		if (overrideConfig) {
			isChildGrid = overrideConfig.isChildGrid;
			//isFromAlert = overrideConfig.isFromAlert;
			this.isChildGrid = isChildGrid;
		}
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		if (!isChildGrid) {
			this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100 });
			this.smartDeviceMacTextField = new Ext.form.TextField({ width: 100 });
			this.gateWayMacTextField = new Ext.form.TextField({ width: 100 });
			this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
			this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
			this.locationNameTextField = new Ext.form.TextField({ width: 100 });
			tbarItems.push('Smart Device Serial#');
			tbarItems.push(this.smartDeviceSerialTextField);

			tbarItems.push('Smart Device Mac');
			tbarItems.push(this.smartDeviceMacTextField);

			tbarItems.push('GateWay Mac');
			tbarItems.push(this.gateWayMacTextField);

			tbarItems.push('Asset Serial#');
			tbarItems.push(this.assetSerialTextField);

			tbarItems.push('Outlet Code');
			tbarItems.push(this.locationCodeTextField);

			tbarItems.push('Outlet Name');
			tbarItems.push(this.locationNameTextField);
		}
		this.searchButton = new Ext.Button({
			text: 'Search', handler: this.onSearch, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: this.onClear, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});
Cooler.SmartDeviceWifiLocation = new Cooler.SmartDeviceWifiLocationC1({ uniqueId: 'SmartDeviceWifiLocation' });
Cooler.SmartDeviceWifiLocationReadOnly = new Cooler.SmartDeviceWifiLocationC1({ uniqueId: 'SmartDeviceWifiLocationReadOnly' });
Cooler.SmartDeviceWifiLocationForAsset = new Cooler.SmartDeviceWifiLocationC1({ uniqueId: 'SmartDeviceWifiLocationForAsset' });