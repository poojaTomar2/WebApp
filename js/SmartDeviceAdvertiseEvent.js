Cooler.SmartDeviceAdvertiseEventCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDeviceAdvertiseEvent',
	keyColumn: 'SmartDeviceAdvertiseEventId',
	title: 'Advertise Event',
	securityModule:'AdvertiseEvents',
	constructor: function (config) {
		Cooler.SmartDeviceAdvertiseEventCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
		{ dataIndex: 'SmartDeviceAdvertiseEventId', type: 'int', header: 'Id', align: 'right', elasticDataIndexType: 'int' },
        { header: 'Event Type', dataIndex: 'EventType', type: 'string' },
		{ header: 'Advertisement Info', dataIndex: 'AdvertisementInfo', type: 'int', align: 'right' },
		{ header: 'Events', dataIndex: 'EventBitsString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
		{ header: 'Alarms', dataIndex: 'AlarmBitsString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
		{ header: 'Cooler Temperature', dataIndex: 'CoolerTemperatureDisplayValue', type: 'string', align: 'right'}, 
		{ header: 'Evaporator Temperature', dataIndex: 'EvaporatorTemperatureDisplayValue', type: 'string', align: 'right'},
		{ header: 'Condensor Temperature', dataIndex: 'CondensorTemperatureDisplayValue', type: 'string', align: 'right' },
		{ header: 'Environment Temperature', dataIndex: 'EnvironmentTemperatureDisplayValue', type: 'string', align: 'right' },		
		{ header: 'Cooler Voltage', dataIndex: 'CoolerVoltageDisplayValue', type: 'string', align: 'right' },
		{ header: 'Month Door Count', dataIndex: 'MonthDoorCount', type: 'int', align: 'right' },
		{ header: 'Last Week Door Count', dataIndex: 'LastWeekDoorCount', type: 'int', align: 'right' },
		{ header: 'This Week Door Count', dataIndex: 'ThisWeekDoorCount', type: 'int', align: 'right' },
		{ header: 'Today Door Count', dataIndex: 'TodayDoorCount', type: 'int', align: 'right' },
		{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', renderer: ExtHelper.renderer.Float(8), align: 'right' },
		{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', renderer: ExtHelper.renderer.Float(8), align: 'right' },
        { header: 'Speed(KMPH)', dataIndex: 'Speed', type: 'float', renderer: ExtHelper.renderer.Float(2), align: 'right' },
        { header: 'Power Status', dataIndex: 'PowerOnOff', type: 'string', width: 120 },
		{ header: 'Imbera Hub Mac', dataIndex: 'ImberaHubMac', type: 'string' },
		{ header: 'Imbera Hub Serial', dataIndex: 'ImberaHubSerial', type: 'string' }
		]);
	},
	beforeGridCreate: function (config, plugin, overrideConfig) {
		var gridConfig = config.gridConfig;
		var tbarItems = [], isChildGrid = false, isFromAlert = false;
		if (overrideConfig) {
			isChildGrid = overrideConfig.isChildGrid;
			isFromAlert = overrideConfig.isFromAlert;
		}
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.showLatestCheck = new Ext.form.Checkbox({ text: 'Show Latest', name: 'forAdvertisementReport' });
		this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100 });
		this.smartDeviceMacTextField = new Ext.form.TextField({ width: 100 });
		this.gateWayMacTextField = new Ext.form.TextField({ width: 100 });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
		this.locationNameTextField = new Ext.form.TextField({ width: 100 });
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'startDateField', format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'endDateField', format: DA.Security.info.Tags.DateFormat });

		tbarItems.push('Show Latest');
		tbarItems.push(this.showLatestCheck);

		if (DA.Security.info.Tags.ClientId == 0 && !isChildGrid) {
			tbarItems.push('Client');
			tbarItems.push(this.clientCombo);
		}
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);

		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		if (!isChildGrid) {
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

		this.showLatestCheck.on('check', function (field, value) {
			this.grid.gridFilter.clearFilters();
			this.clientCombo.reset();
			this.smartDeviceSerialTextField.reset();
			this.smartDeviceMacTextField.reset();
			this.gateWayMacTextField.reset();
			this.assetSerialTextField.reset();
			this.locationCodeTextField.reset();
			this.locationNameTextField.reset();
			this.startDateField.setValue();
			this.endDateField.setValue();
			this.grid.baseParams.forAdvertisementReport = this.showLatestCheck.getValue();
			this.grid.baseParams.limit = this.grid.pageSize;
			this.grid.store.load();
		}, this);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {

				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;

				var fieldFilter = this.title != 'AssetPurityReadOnly' ? 'EventTime' : 'PurityDateTime';
				var isValidDate = Cooler.DateRangeFilter(this, fieldFilter, true);
				if (!isValidDate) {
					return;
				}
				if (DA.Security.info.EnableElasticSearch) {
					if (!Ext.isEmpty(this.gateWayMacTextField.getValue())) {
						isGridFilterApply = true;
						var gatewayMacFilter = this.grid.gridFilter.getFilter('GatewayMac');
						gatewayMacFilter.active = true;
						gatewayMacFilter.setValue(this.gateWayMacTextField.getValue());
					}
				} else {
					if (!Ext.isEmpty(this.gateWayMacTextField.getValue())) {
						isGridFilterApply = true;
						var gatewayMacFilter = this.grid.gridFilter.getFilter('GatewayMacAddress');
						gatewayMacFilter.active = true;
						gatewayMacFilter.setValue(this.gateWayMacTextField.getValue());
					}
				}

				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					isGridFilterApply = true;
					var clientFilter = this.grid.gridFilter.getFilter('ClientName');
					clientFilter.active = true;
					clientFilter.setValue(this.clientCombo.getRawValue());
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

				this.grid.baseParams.forAdvertisementReport = this.showLatestCheck.getValue();
				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});


		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {

				this.grid.gridFilter.clearFilters();

				this.clientCombo.reset();
				this.smartDeviceSerialTextField.reset();
				this.smartDeviceMacTextField.reset();
				this.gateWayMacTextField.reset();
				this.assetSerialTextField.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.startDateField.setValue();
				this.endDateField.setValue();
				this.showLatestCheck.reset();
				this.grid.baseParams.forAdvertisementReport = false;
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});

Cooler.SmartDeviceAdvertiseEvent = new Cooler.SmartDeviceAdvertiseEventCl({ uniqueId: 'SmartDeviceAdvertiseEvent' });
Cooler.SmartDeviceAdvertiseEventReadOnly = new Cooler.SmartDeviceAdvertiseEventCl({ uniqueId: 'SmartDeviceAdvertiseEventReadOnly' });
