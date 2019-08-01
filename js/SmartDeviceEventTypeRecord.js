Cooler.SmartDeviceEventTypeRecordC1 = Ext.extend(Cooler.Form, {
	controller: 'SmartDeviceEventTypeRecord',
	keyColumn: 'SmartDeviceEventTypeRecordId',
	title: 'Machine Activity',
	disableAdd: true,
	disableDelete: true,
	securityModule: 'MachineActivity',
	constructor: function (config) {
		Cooler.SmartDeviceEventTypeRecordC1.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'SmartDeviceEventTypeRecordId' } }
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
			{ dataIndex: 'SmartDeviceEventTypeRecordId', type: 'int', header: 'Id', align: 'right' },
			{ header: 'Event Type', dataIndex: 'EventType', type: 'string' },
			{ header: 'Start Time', dataIndex: 'StartEventTime', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'End Time', dataIndex: 'EndEventTime', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Start EventId', dataIndex: 'StartEventId', type: 'int', align: 'right' },
			{ header: 'End EventId', dataIndex: 'EndEventId', type: 'int', align: 'right' },
			{ header: 'Duration(Sec)', dataIndex: 'Duration', type: 'int', align: 'right' },
			{ header: 'Created On', dataIndex: 'CreatedOn', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Month', dataIndex: 'RecordMonth', type: 'int', align: 'right' },
			{ header: 'Day ', dataIndex: 'RecordDay', type: 'int', align: 'right' },
			{ header: 'Day of Week', dataIndex: 'RecordWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'RecordWeek', type: 'int', align: 'right' },
			{ header: 'Smart Device Mac', dataIndex: 'SmartDeviceMacAddress', type: 'string' },
            { header: 'Smart Device#', dataIndex: 'SmartDeviceSerialNumber', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string' },
			{ header: 'Gateway Serial#', dataIndex: 'GatewaySerialNumber', type: 'string' },
            { header: 'Asset Serial #', dataIndex: 'AssetSerialNumber', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet', dataIndex: 'LocationName', type: 'string' },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string' },
			{ header: 'Latest Ping Time', dataIndex: 'EventTime', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', displayIndex: 'TimeZoneDisplayName', renderer: 'proxy', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }) },
		];
	},

	afterShowList: function (config) {
		Cooler.DateRangeFilter(this, 'StartEventTime', false);
	},

	beforeGridCreate: function (config, plugin, overrideConfig) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.imberaHubSerialNumberTextField = new Ext.form.TextField({ width: 100 });
		this.smartDeviceSerialNumberTextField = new Ext.form.TextField({ width: 100 });
		this.gatewaySerialNumberTextField = new Ext.form.TextField({ width: 100 });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
		this.locationNameTextField = new Ext.form.TextField({ width: 100 });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100 });

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
		tbarItems.push('Imbera Hub Serial#');
		tbarItems.push(this.imberaHubSerialNumberTextField);

		tbarItems.push('Smart Device#');
		tbarItems.push(this.smartDeviceSerialNumberTextField);

		tbarItems.push('Gateway Serial#');
		tbarItems.push(this.gatewaySerialNumberTextField);

		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Outlet Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Outlet Name');
		tbarItems.push(this.locationNameTextField);

		this.searchButton = new Ext.Button({

			text: 'Search', handler: function () {
				var isGridFilterApply = false;
				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					isGridFilterApply = true;
					var clientNameFilter = this.grid.gridFilter.getFilter('ClientName');
					clientNameFilter.active = true;
					clientNameFilter.setValue(this.clientCombo.getRawValue());
				}

				if (!Ext.isEmpty(this.imberaHubSerialNumberTextField.getValue())) {
					isGridFilterApply = true;
					var imberaHubSerialNumberFilter = this.grid.gridFilter.getFilter('ImberaHubSerialNumber');
					imberaHubSerialNumberFilter.active = true;
					imberaHubSerialNumberFilter.setValue(this.imberaHubSerialNumberTextField.getValue());
				}

				if (!Ext.isEmpty(this.smartDeviceSerialNumberTextField.getValue())) {
					isGridFilterApply = true;
					var smartDeviceSerialNumberFilter = this.grid.gridFilter.getFilter('SmartDeviceSerialNumber');
					smartDeviceSerialNumberFilter.active = true;
					smartDeviceSerialNumberFilter.setValue(this.smartDeviceSerialNumberTextField.getValue());
				}

				if (!Ext.isEmpty(this.gatewaySerialNumberTextField.getValue())) {
					isGridFilterApply = true;
					var gatewaySerialNumberFilter = this.grid.gridFilter.getFilter('GatewaySerialNumber');
					gatewaySerialNumberFilter.active = true;
					gatewaySerialNumberFilter.setValue(this.gatewaySerialNumberTextField.getValue());
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
				var isValidDate = Cooler.DateRangeFilter(this, 'StartEventTime', false);
				if (!isValidDate) {
					return;
				}

				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					//this.grid.baseParams.limit = this.grid.pageSize;
					this.grid.store.load();
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {

				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue();
				this.endDateField.setValue();
				this.clientCombo.reset();
				this.imberaHubSerialNumberTextField.reset();
				this.smartDeviceSerialNumberTextField.reset();
				this.gatewaySerialNumberTextField.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});

Cooler.SmartDeviceEventTypeRecord = new Cooler.SmartDeviceEventTypeRecordC1({ uniqueId: 'SmartDeviceEventTypeRecord' });
Cooler.SmartDeviceEventTypeRecordReadOnly = new Cooler.SmartDeviceEventTypeRecordC1({ uniqueId: 'SmartDeviceEventTypeRecordReadOnly' });
