Cooler.SmartDeviceEventLog = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		Cooler.SmartDeviceEventLog.superclass.constructor.call(this, config || {});
		Ext.applyIf(this.gridConfig, {
			custom: {
				loadComboTypes: true
			},
			defaults: {},
		});
		Ext.applyIf(this.gridConfig.defaults, {
			sort: { dir: 'DESC', sort: this.keyColumn }
		});
	},
	comboTypes: [
		'AssetType',
		'EventType',
		'SmartDeviceType',
		'TimeZone'
	],
	comboStores: {
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		EventType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	securityModule: 'Logs',
	disableAdd: true,
	onGridCreated: function (grid) {
		grid.on("cellclick", this.cellclick, this);
	},
	cellclick: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e];
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		switch (column.dataIndex) {
			// Commented as per the ticket #752
			/* case 'SerialNumber':
				Cooler.Asset.ShowForm(rec.get('AssetId'));
				break;*/
			case 'MacAddress':
				Cooler.SmartDevice.ShowForm(rec.get('SmartDeviceId'));
				break;
			case 'Location':
				Cooler.LocationType.Location.ShowForm(rec.get('LocationId'));
				break;
		}
	},
	assetLocationColumns: function () {
		return [
                { dataIndex: 'AssetSerialNumber', type: 'string', header: 'Asset Serial #', width: 120, sortable: false, hyperlinkAsDoubleClick: true }, // hyperlinkAsDoubleClick: true Commented as per the ticket #752
				{ header: 'Technical Id', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
				{ dataIndex: 'AssetType', type: 'string', width: 150 },
				{ header: 'Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
				{ dataIndex: 'MacAddress', header: 'Smart Device Mac', width: 120, type: 'string', hyperlinkAsDoubleClick: true, sortable: false },
                { dataIndex: 'SerialNumber', header: 'Smart Device#', width: 120, type: 'string', sortable: false, hyperlinkAsDoubleClick: true },
				{ header: 'Is Smart?', dataIndex: 'IsSmart', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
				{ dataIndex: 'LocationId', type: 'int' },
				{ dataIndex: 'SmartDeviceTypeId', header: 'Smart Device Type', width: 120, type: 'int', displayIndex: 'SmartDeviceTypeName', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), sortable: false },
				{ dataIndex: 'Location', type: 'string', header: 'Outlet', width: 160, hyperlinkAsDoubleClick: true, sortable: false },
                { dataIndex: 'LocationCode', type: 'string', header: 'Outlet Code', width: 160, sortable: false, hyperlinkAsDoubleClick: true },
				{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string', width: 130, sortable: false },
				{ dataIndex: 'LocationCity', type: 'string', header: 'Outlet City', width: 160, hidden: true },
				{ dataIndex: 'State', type: 'string', header: 'Outlet State', hidden: true },
				{ dataIndex: 'LocationPostalCode', type: 'string', header: 'Outlet Postal', hidden: true, elasticDataIndex: 'PostalCode' },
				{ dataIndex: 'Country', type: 'string', header: 'Outlet Country', hidden: true },
				{ dataIndex: 'CountryId', type: 'int' },
				{ dataIndex: 'AssetId', type: 'int' },
				{ dataIndex: 'SmartDeviceId', type: 'int' },
				{ dataIndex: 'TimeZoneId', header: 'Time Zone', width: 300, type: 'int', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), sortable: false },
				{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', sortable: false }
		];
	},

	afterShowList: function (config) {
		var fieldFilter = this.title != 'AssetPurityReadOnly' ? 'EventTime' : 'PurityDateTime';
		Cooler.DateRangeFilter(this, fieldFilter, false);
		//As per ticket:11403
		if (this.title == "Movement") {
			this.grid.baseParams.forSmartDeviceMovement = this.blankGPSCheck.getValue();
		}
	},

	beforeGridCreate: function (config, plugin, overrideConfig) {
		var gridConfig = config.gridConfig;
		var tbarItems = [], isChildGrid = false, isFromAlert = false;
		if (overrideConfig) {
			isChildGrid = overrideConfig.isChildGrid;
			isFromAlert = overrideConfig.isFromAlert;
		}
		if (!isFromAlert) {
			this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
			this.blankGPSCheck = new Ext.form.Checkbox({ text: 'Hide Blank GPS', name: 'forSmartDeviceMovement', checked: true });
			this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100 });
			this.smartDeviceMacTextField = new Ext.form.TextField({ width: 100 });
			this.gateWayMacTextField = new Ext.form.TextField({ width: 100 });
			this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
			this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
			this.locationNameTextField = new Ext.form.TextField({ width: 100 });
			this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'startDateField', format: DA.Security.info.Tags.DateFormat });
			this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), itemId: 'endDateField', format: DA.Security.info.Tags.DateFormat });

			if (DA.Security.info.Tags.ClientId == 0 && !isChildGrid) {
				tbarItems.push('Client ');
				tbarItems.push(this.clientCombo);
			}
			tbarItems.push('Start Date');
			tbarItems.push(this.startDateField);

			tbarItems.push('End Date');
			tbarItems.push(this.endDateField);

			if (this.title == "Movement") {
				tbarItems.push('Hide Blank GPS');
				tbarItems.push(this.blankGPSCheck);
			}

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

			this.searchButton = new Ext.Button({
				text: 'Search', handler: function () {
					// this.grid.gridFilter.clearFilters();
					var isGridFilterApply = false;
					if (this.title == "Movement") {
						this.grid.baseParams.forSmartDeviceMovement = this.blankGPSCheck.getValue();
					}
					var fieldFilter = this.title != 'AssetPurityReadOnly' ? 'EventTime' : 'PurityDateTime';
					var isValidDate = Cooler.DateRangeFilter(this, fieldFilter, true);
					if (!isValidDate) {
						return false;
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
					if (this.title == "Movement") {
						this.blankGPSCheck.reset();
					}
				}, scope: this
			});

			tbarItems.push(this.searchButton);
			tbarItems.push(this.removeSearchButton);
			Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
		}


	},
	addEventColumns: function (columns, options) {
		options = options || {};
		if (this.title != 'AssetPurityReadOnly') {
			columns.push(
				{ header: 'Event Id', dataIndex: options.eventId || 'EventId', width: 70, type: 'int', align: 'right' },
				{ header: 'Created On', dataIndex: 'CreatedOn', width: 180, type: 'date', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, convert: Ext.ux.DateLocalizer }
			);
		}
		if (options.eventTime !== false && this.title != 'AssetPurityReadOnly') {
			columns.push({ header: 'Event Time', dataIndex: 'EventTime', width: 180, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, type: 'date' });
		}
		columns.push(
			{ header: 'Gateway Mac', dataIndex: 'GatewayMacAddress', type: 'string', width: 110, elasticDataIndex: 'GatewayMac' },
			{ header: 'Gateway#', dataIndex: 'GatewaySerialNumber', type: 'string', width: 110 },
			{ type: 'int', dataIndex: 'TimeZoneId' }
		);
		var dataIndex;
		switch (this.title) {
			case 'Ping':
			case 'Power Usage':
			case 'Power Event':
			case 'Power Record':
			case 'Health Event':
			case 'Door Status':
			case 'Movement':
			case 'Image Event':
			case 'Ping':
				dataIndex = true;
				break;
		}
		columns.push({ header: 'Asset Type', dataIndex: 'AssetTypeId', type: 'int', displayIndex: 'AssetType', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }), store: this.comboStores.AssetType, width: 150 });
		if (dataIndex) {
			columns.push(
			{ header: 'Month', dataIndex: 'SmartDeviceMonth', type: 'int', align: 'right' },
			{ header: 'Day ', dataIndex: 'SmartDeviceDay', type: 'int', align: 'right' },
			{ header: 'Day of Week', dataIndex: 'SmartDeviceWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'SmartDeviceWeek', type: 'int', align: 'right' });
		}
		return columns.concat(this.assetLocationColumns());
	}
});