Cooler.AlertCl = Ext.extend(Cooler.Form, {
	keyColumn: 'AlertId',
	controller: 'Alert',
	title: 'Alert',
	disableAdd: true,
	constructor: function (config) {
		Cooler.AlertCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'AlertId' } }
		});
	},
	securityModule: 'Alerts',
	comboTypes: [
		'AlertStatus',
		'AlertType',
		'TimeZone',
		'AssetType',
		'AlertVisitCheck'
	],
	comboStores: {
		AlertStatus: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertVisitCheck: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		//var alertStatusCombo = DA.combo.create({ store: this.comboStores.AlertStatus, mode: 'local' });
		var alertStatusCombo = DA.combo.create({ store: this.comboStores.AlertStatus, mode: 'local' });
		function wordWrap(value) {
			return '<div style="white-space: normal; word-wrap: break-word;">' + value + '</div>';
		}
		var alertVisitCheckCombo = DA.combo.create({ store: this.comboStores.AlertVisitCheck, mode: 'local' });
		function wordWrap(value) {
			return '<div style="white-space: normal; word-wrap: break-word;">' + value + '</div>';
		}
		var AcknowledgeComment = new Ext.form.TextField({ name: 'AcknowledgeComment', width: 200, height: 40 });
		function wordWrap(value) {
			return '<div style="white-space: normal; word-wrap: break-word;">' + value + '</div>';
		}
		return [
			{ header: 'Id', dataIndex: 'AlertId', type: 'int', align: 'right' },
			{ dataIndex: 'ProductId', type: 'int', align: 'right' },
			{ header: 'Alert Type', dataIndex: 'AlertTypeId', type: 'int', displayIndex: 'AlertType', store: this.comboStores.AlertType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AlertType }) },
			{ header: 'Alert Text', dataIndex: 'AlertText', type: 'string', width: 200 },
			{ header: 'Alert Definition', dataIndex: 'AlertDefinition', type: 'string' },
			//{ header: 'Status', dataIndex: 'StatusId', type: 'int', width: 100, displayIndex: 'Status', editor: alertStatusCombo, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AlertStatus }) },
			{ header: 'Status', dataIndex: 'StatusId', type: 'int', width: 100, displayIndex: 'Status', editor: alertStatusCombo, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AlertStatus }) },
			{ header: 'Visit Check', dataIndex: 'VisitCheckId', type: 'int', width: 100, displayIndex: 'VisitCheckStatus', editor: alertVisitCheckCombo, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AlertVisitCheck }) },
			{ header: 'Asset Serial#', dataIndex: 'AssetSerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Serial#', dataIndex: 'SmartDeviceSerial', type: 'string', width: 150 },
			{ header: 'Asset Equipment Number', dataIndex: 'AssetEquipmentNumber', type: 'string', width: 150 },
			{ header: 'Asset Technical Identification Number', dataIndex: 'TechnicalIdentificationNumber', type: 'string', width: 150 },
			//{ header: 'Asset Type ', dataIndex: 'AssetTypeId', displayIndex: 'AssetType', type: 'int', store: this.comboStores.AssetType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.AssetType }) },
			{ header: 'Asset Type', dataIndex: 'AssetType', type: 'string', width: 150 },
			{ header: 'Street', dataIndex: 'Street', type: 'string', width: 150 },
			{ header: 'Street 2', dataIndex: 'Street2', type: 'string', width: 150 },
			{ header: 'Street 3', dataIndex: 'Street3', type: 'string', width: 150 },
			{ header: 'Is Smart?', dataIndex: 'IsSmart', type: 'bool', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Alert At', dataIndex: 'AlertAt', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Status Changed On', dataIndex: 'ClosedOn', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Priority', dataIndex: 'Priority', type: 'string', width: 60 },
			{ header: 'Age', dataIndex: 'AlertAt', displayIndex: 'AlertAgeFormatted', type: 'date', width: 100, sortable: false, renderer: function (v, m, r) { return r.data.AlertAgeFormatted; } },
			{ header: 'Alert Age(in minutes)', dataIndex: 'AlertAgeMins', type: 'int', width: 130, align: 'right', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Value', dataIndex: 'AlertValue', type: 'float', width: 60, align: 'right' },
			{ header: 'Last Update', dataIndex: 'LastUpdatedOn', type: 'date', renderer: ExtHelper.renderer.DateTime, width: 150 },
			{ header: 'Outlet', dataIndex: 'Location', type: 'string', width: 160, hyperlinkAsDoubleClick: true, elasticDataIndex: 'LocationName', sortable: false },
			{ header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', width: 160, sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Type', dataIndex: 'OutletType', type: 'string', width: 130, sortable: false },
			{ header: 'Outlet City', dataIndex: 'City', type: 'string', width: 160 },
			{ header: 'Outlet State', dataIndex: 'State', type: 'string', hidden: true },
			{ header: 'Outlet Postal', dataIndex: 'LocationPostalCode', type: 'string', hidden: true, elasticDataIndex: 'PostalCode' },
			{ header: 'Outlet Country', dataIndex: 'Country', type: 'string', hidden: true },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', elasticDataIndex: 'Client', sortable: false },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' },
			{ header: 'Month', dataIndex: 'AlertMonth', align: 'right', type: 'int' },
			{ header: 'Day ', dataIndex: 'AlertDay', align: 'right', type: 'int' },
			{ header: 'Day of Week', dataIndex: 'AlertWeekDay', type: 'string' },
			{ header: 'Week of Year', dataIndex: 'AlertWeek', align: 'right', type: 'int' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'AlertDefinitionId', type: 'int' },
			{ dataIndex: 'AssetId', type: 'int' },
			{ dataIndex: 'SmartDeviceId', type: 'int' },
			{ dataIndex: 'AlertTypeId', type: 'int' },
			{ dataIndex: 'LocationId', type: 'int' },
			{ dataIndex: 'AlertAgeFormatted', type: 'string' },
			{ header: 'Market', dataIndex: 'MarketName', type: 'string' },
			{ header: 'Trade Channel', dataIndex: 'LocationType', type: 'string' },
			{ header: 'Customer Tier', dataIndex: 'Classification', width: 120, type: 'string' },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Organization Code', hidden: true, dataIndex: 'SalesOrganizationCode', width: 150, type: 'string' },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', hidden: true, dataIndex: 'SalesOfficeCode', width: 150, type: 'string' },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', hidden: true, dataIndex: 'SalesGroupCode', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' },
			{ header: 'Sales Rep', dataIndex: 'SalesRep', width: 120, type: 'string' },
			{ header: 'Is System Alert?', dataIndex: 'IsSystemAlert', type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Acknowledge Comment', dataIndex: 'AcknowledgeComment', type: 'string', width: 230, editor: AcknowledgeComment, renderer: wordWrap },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer }

		]
	},

	onGridCreated: function (grid) {
		grid.on('rowclick', this.onListGridRowClick, this);
		grid.on("cellclick", this.onCellclick, this);
		grid.on('validateedit', this.onBeforeValidateEdit, this);
		grid.store.on('load', this.disableChildGrid, this);
	},

	disableChildGrid: function () {
		var selectedRecord;
		if (this.grid && this.grid.getSelectionModel() && typeof this.grid.getSelectionModel().getSelected != 'undefined') {
			selectedRecord = this.grid.getSelectionModel().getSelected();
		}
		if (!selectedRecord && this.smartDeviceHealthGrid && this.smartDeviceMovementGrid && this.smartDeviceDoorStatusGrid && this.smartDeviceAlertPowerEventGrid && this.smartDevicePurityGrid && this.SmartDeviceStockSensorData) {
			this.smartDeviceHealthGrid.setDisabled(true);
			this.smartDeviceMovementGrid.setDisabled(true);
			this.smartDeviceDoorStatusGrid.setDisabled(true);
			this.smartDeviceAlertPowerEventGrid.setDisabled(true);
			this.smartDevicePurityGrid.setDisabled(true);
			this.SmartDeviceStockSensorData.setDisabled(true);
		}
	},
	getDisplayValue: function (statusStore, value) {
		var data,
			dataValue,
			index = statusStore.findExact('LookupId', value);
		if (index != -1) {
			data = statusStore.getAt(index);
			dataValue = data.get('DisplayValue');
		}
		return dataValue;
	},
	onBeforeValidateEdit: function (e) {
		var field = e.field,
			record = e.record,
			value = e.value,
			originalValue = e.originalValue,
			originalClosedOn,
			statusStore = this.comboStores.AlertStatus,
			dataValue;
		if (field == 'StatusId') {
			dataValue = this.getDisplayValue(statusStore, value);
			if (dataValue == 'Closed') {
				originalClosedOn = record.get('ClosedOn');
				var timeZone = Cooler.comboStores.TimeZone.data.items;
				var timeZoneId = e.record.data.TimeZoneId;
				var length = timeZone.length;
				var description;
				for (var i = 0; i < length; i++) {
					if (timeZone[i].data.LookupId == timeZoneId) {
						description = timeZone[i].data.Description;
					}
				}
				if (description) {
					var newDate = moment.utc().add(description, 'hour').format('MM/DD/YYYY hh:mm:ss A');
					record.set('ClosedOn', newDate);
				}
				else {
					record.set('ClosedOn', moment.utc().format('MM/DD/YYYY hh:mm:ss A'));
				}
			}
			else {
				dataValue = this.getDisplayValue(statusStore, originalValue);
				if (dataValue == 'Closed' && !(e.record.modified && e.record.modified.StatusId)) {
					e.cancel = true;
					Ext.Msg.alert('Alert', "You Cannot Change Closed Alert.");
				}
				else {
					if (originalClosedOn) {
						record.set('ClosedOn', originalClosedOn);
					}
				}
			}
		}
	},
	onCellclick: function (grid, rowIndex, e) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		/*used so that we can add new hyperlink column as well if required*/
		switch (column.dataIndex) {
			case 'Location':
				Cooler.LocationType.Location.ShowForm(rec.get('LocationId'));
				break;
			//case 'LocationCode':
			//    Cooler.LocationType.Location.ShowForm(rec.get('LocationId'));
			//    break;
		}
	},
	setHeaderFilters: function () {
		var grid = this.grid;
		var alertDefinitionId = grid.baseParams.AlertDefinitionId;
		var statusId = grid.baseParams.StatusId;
		if (grid.topToolbar.items) {
			var alertDefinitionCombo = grid.topToolbar.items.get('alertDefinitionCombo');
			var statusCombo = grid.topToolbar.items.get('statusCombo');
			ExtHelper.SelectComboValue(statusCombo, statusId);
			ExtHelper.SelectComboValue(alertDefinitionCombo, alertDefinitionId);
			this.resetGridStore(false);
		}
	},
	afterLoadComboStores: function () {
		this.setHeaderFilters();
	},
	afterShowList: function (config) {
		var grid = this.grid;
		var isComingFromAlert = grid.baseParams.isFromAlert;
		this.resetGridFilters();
		if (isComingFromAlert) {
			this.resetGridStore(true);
		}
		else {
			this.setHeaderFilters()
		}

		if (!Ext.isEmpty(this.statusCombo.getValue())) {
			var statusFilter = this.grid.gridFilter.getFilter('PurityDateTime');
		}
	},
	beforeGridCreate: function (config, plugin, overrideConfig) {

		var gridConfig = config.gridConfig || config.overrideConfig;
		this.gridPlugins = [new DA.form.plugins.Inline({
			modifiedRowOptions: { fields: 'modified' }
		})];
		var isChildGrid = false;
		if (overrideConfig) {
			isChildGrid = overrideConfig.isChildGrid;
		}
		var tbarItems = [];
		var filterFields = ['ClientId', 'AlertText', 'LocationCode', 'LocationName', 'AssetSerialNumber', 'AlertType', 'StatusId', 'AlertDefinitionId'];
		this.filterFields = filterFields;
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.alertDefinitionCombo = DA.combo.create({ fieldLabel: 'Alert Definition', width: 100, itemId: 'alertDefinitionCombo', name: 'AlertDefinitionId', hiddenName: 'AlertDefinitionId', listWidth: 250, controller: 'combo', baseParams: { comboType: 'AlertDefinition' } });
		//this.statusCombo = DA.combo.create({ fieldLabel: 'Status', width: 100, itemId: 'statusCombo', name: 'StatusId', hiddenName: 'StatusId', listWidth: 220, store: this.comboStores.AlertStatus });
		this.statusCombo = DA.combo.create({ fieldLabel: 'Status', hiddenName: 'StatusId', itemId: 'statusCombo', name: 'StatusId', store: Cooler.comboStores.AlertStatus, mode: 'local', width: 100 }),
		this.alertTextTextField = new Ext.form.TextField({ width: 100 });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100 });
		this.locationNameTextField = new Ext.form.TextField({ width: 100 });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100 });
		this.alertTypeField = new Ext.form.TextField({ width: 100 });

		var date = Cooler.DateOptions.AddDays(new Date());
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', maxValue: date, format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', maxValue: date, format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
		if (!isChildGrid) {
			if (DA.Security.info.Tags.ClientId == 0) {
				tbarItems.push('Client');
				tbarItems.push(this.clientCombo);
			}

			tbarItems.push('Alert Type');
			tbarItems.push(this.alertTypeField);

			tbarItems.push('Alert Text');
			tbarItems.push(this.alertTextTextField);

			tbarItems.push('Alert Definition');
			tbarItems.push(this.alertDefinitionCombo);
		}
		else {
			//this.statusCombo = DA.combo.create({ fieldLabel: 'Status', hiddenName: 'StatusId', store: this.comboStores.AlertStatus, mode: 'local', width: 100 });
			this.statusCombo = DA.combo.create({ fieldLabel: 'Status', hiddenName: 'StatusId', itemId: 'statusCombo', name: 'StatusId', store: this.comboStores.AlertStatus, mode: 'local', width: 100 })
		}

		tbarItems.push('Status');
		tbarItems.push(this.statusCombo);
		if (isChildGrid) {
			this.statusCombo.setValue(1);
		}
		if (!isChildGrid) {
			tbarItems.push('Asset Serial#');
			tbarItems.push(this.assetSerialTextField);

			tbarItems.push('Outlet Code');
			tbarItems.push(this.locationCodeTextField);

			tbarItems.push('Outlet Name');
			tbarItems.push(this.locationNameTextField);
		}
		this.searchButton = new Ext.Button({

			text: 'Search', handler: function () {
				this.resetGridStore(true);
				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { ClientId: this.clientCombo.getValue() });
				}
				if (!Ext.isEmpty(this.alertTypeField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AlertType: this.alertTypeField.getValue() });
				}
				if (!Ext.isEmpty(this.alertTextTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AlertText: this.alertTextTextField.getValue() });
				}

				if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { LocationCode: this.locationCodeTextField.getValue() });
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { LocationName: this.locationNameTextField.getValue() });
				}
				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AssetSerialNumber: this.assetSerialTextField.getValue() });
				}

				if (!Ext.isEmpty(this.alertDefinitionCombo.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AlertDefinitionId: this.alertDefinitionCombo.getValue() });
				}
				if (!Ext.isEmpty(this.statusCombo.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { StatusId: this.statusCombo.getValue() });
				}
				var isValidDate = Cooler.DateRangeFilter(this, 'AlertAt', false);
				if (!isValidDate) {
					return;
				}
				this.grid.loadFirst();
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: function () {

				this.grid.baseParams.isFromAlert = true; // Remove the Closedon Filter.
				this.resetGridStore(true);
				this.resetGridFilters();
				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},


	resetGridStore: function (forceReset) {
		if (!forceReset) {
			if (this.filterFields.indexOf("AlertDefinitionId") > -1) {
				this.filterFields.remove("AlertDefinitionId");
			}
			if (this.filterFields.indexOf("StatusId") > -1) {
				this.filterFields.remove("StatusId");
			}
		}
		else {
			if (this.filterFields.indexOf("AlertDefinitionId") == -1) {
				this.filterFields.push("AlertDefinitionId");
			}
			if (this.filterFields.indexOf("StatusId") == -1) {
				this.filterFields.push("StatusId");
			}
		}
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},
	resetGridFilters: function () {
		this.clientCombo.reset();
		this.statusCombo.reset();
		this.alertDefinitionCombo.reset();
		this.alertTypeField.reset();
		this.alertTextTextField.reset();
		this.locationCodeTextField.reset();
		this.locationNameTextField.reset();
		this.assetSerialTextField.reset();
		this.startDateField.reset();
		this.endDateField.reset();
		var startDateFilter = this.grid.gridFilter.getFilter('AlertAt');
		startDateFilter.setActive(false);
	},

	onListGridRowClick: function (grid, rowIndex, columnIndex, e) {
		var record = grid.getStore().getAt(rowIndex);
		var assetId = record.get('AssetId');
		var alertId = record.get('AlertId');
		var alertTypeId = record.get('AlertTypeId');
		var alertAt = record.get('AlertAt');
		var productId = record.get('ProductId');
		var grids = [];
		if (this.smartDeviceHealthGrid || this.smartDeviceMovementGrid || this.smartDeviceDoorStatusGrid || this.smartDeviceAlertPowerEventGrid || this.smartDevicePurityGrid || this.SmartDeviceStockSensorData) {
			//To remove data of previous selected record of parent grid
			if (this.smartDeviceHealthGrid.getStore() != null) {
				this.smartDeviceHealthGrid.getStore().removeAll();
			}
			if (this.smartDeviceMovementGrid.getStore() != null) {
				this.smartDeviceMovementGrid.getStore().removeAll();
			}
			if (this.smartDeviceDoorStatusGrid.getStore() != null) {
				this.smartDeviceDoorStatusGrid.getStore().removeAll();
			}
			if (this.smartDeviceAlertPowerEventGrid.getStore() != null) {
				this.smartDeviceAlertPowerEventGrid.getStore().removeAll();
			}
			if (this.smartDevicePurityGrid.getStore() != null) {
				this.smartDevicePurityGrid.getStore().removeAll();
			}
			if (this.SmartDeviceStockSensorData.getStore() != null) {
				this.SmartDeviceStockSensorData.getStore().removeAll();
			}

			var title, store;
			this.smartDeviceMovementGrid.setDisabled(true);
			this.smartDeviceDoorStatusGrid.setDisabled(true);
			this.smartDeviceHealthGrid.setDisabled(true);
			this.smartDeviceAlertPowerEventGrid.setDisabled(true);
			this.smartDevicePurityGrid.setDisabled(true);
			this.imageCarouselPanel.setDisabled(true);
			this.SmartDeviceStockSensorData.setDisabled(true);
			switch (alertTypeId) {
				case Cooler.Enums.AlertType.Movement:
				case Cooler.Enums.AlertType.DeviceAccumulatedMovement:
				case Cooler.Enums.AlertType.HubAccumulatedMovement:
				case Cooler.Enums.AlertType.GpsDisplacement:
				case Cooler.Enums.AlertType.HubMovementDuration:
				case Cooler.Enums.AlertType.NonAuthorizedMovement:
					title = "Movements";
					this.smartDeviceMovementGrid.setDisabled(false);
					store = this.smartDeviceMovementGrid.getStore();
					store.baseParams.movementTypeId = alertTypeId == Cooler.Enums.AlertType.NonAuthorizedMovement ? Cooler.Enums.MovementType.GPSDisplacement : alertTypeId == Cooler.Enums.AlertType.HubMovementDuration ? Cooler.Enums.MovementType.HubMovement : alertTypeId == Cooler.Enums.AlertType.Movement ? Cooler.Enums.MovementType.DeviceMovement : alertTypeId == Cooler.Enums.AlertType.GpsDisplacement ? Cooler.Enums.MovementType.GPSDisplacement : alertTypeId == Cooler.Enums.AlertType.HubAccumulatedMovement ? Cooler.Enums.MovementType.HubAccumulated : Cooler.Enums.MovementType.DeviceAccumulated;
					break;
				case Cooler.Enums.AlertType.Door:
					title = "Door Statuses";
					this.smartDeviceDoorStatusGrid.setDisabled(false);
					break;
				case Cooler.Enums.AlertType.Battery:
				case Cooler.Enums.AlertType.Health:
				case Cooler.Enums.AlertType.Light:
				case Cooler.Enums.AlertType.EnvironmentHealth:
				case Cooler.Enums.AlertType.EnvironmentLight:
				case Cooler.Enums.AlertType.CoolerMalfunction:
					title = "Health Events";
					this.smartDeviceHealthGrid.setDisabled(false);
					store = this.smartDeviceHealthGrid.getStore();
					store.baseParams.eventTypeId = alertTypeId == Cooler.Enums.AlertType.EnvironmentHealth ? Cooler.Enums.EventType.Environment : Cooler.Enums.EventType.HealthyEvent;
					break;
				case Cooler.Enums.AlertType.Power:
					title = "Power Events";
					this.smartDeviceAlertPowerEventGrid.setDisabled(false);
					break;
				case Cooler.Enums.AlertType.Stock:
				case Cooler.Enums.AlertType.Purity:
					title = "Purities";
					this.smartDevicePurityGrid.setDisabled(false);
					break;
				case Cooler.Enums.AlertType.OutofStockSKUBased:
					title = "Purity Images"
					this.imageCarouselPanel.setDisabled(false);
					Ext.Ajax.request({
						url: 'Controllers/AlertPurityImage.ashx',
						params: { action: 'getAlertAndLatestImages', assetId: assetId, alertAt: alertAt },
						success: function (result, request) {
							var response = Ext.decode(result.responseText);
							var data = response.records;
							this.addRecordIntoImagePurityStore(data);
						},
						failure: function (result, request) {
							Ext.Msg.alert('Alert', JSON.parse(result.responseText));
						},
						scope: this
					});
					break;

				case Cooler.Enums.AlertType.OutofStockPlanogramBased:
					title = "Purity Images"
					this.imageCarouselPanel.setDisabled(false);
					Ext.Ajax.request({
						url: 'Controllers/AlertPurityImage.ashx',
						params: { action: 'getAlertAndLatestImages', assetId: assetId, alertAt: alertAt },
						success: function (result, request) {

							var response = Ext.decode(result.responseText);
							var data = response.records;
							this.addRecordIntoImagePurityStore(data);

							//Cooler.Asset.renderCombinedChart(data);
						},
						failure: function (result, request) {
							Ext.Msg.alert('Alert', JSON.parse(result.responseText));
						},
						scope: this
					});
					break;
				case Cooler.Enums.AlertType.StokeSensorAlert:
					title = "Stock Sensors";
					this.SmartDeviceStockSensorData.setDisabled(false);
					store = this.SmartDeviceStockSensorData.getStore();
					break;
			}
			if (title) {
				if (title == 'Purity Images') {
				}
				else {
					var items = this.south.items.items, record, itemsLength, gridStore;
					itemsLength = items.length;
					for (var i = 0; i < itemsLength; i++) {
						record = items[i];
						if (record.title == title) {
							gridStore = record.getStore();
							this.south.setActiveTab(i);
							gridStore.baseParams.assetId = assetId;
							gridStore.baseParams.forAlerts = true;
							gridStore.baseParams.alertId = alertId;
							gridStore.baseParams.alertTypeId = alertTypeId;
							gridStore.baseParams.productId = productId;
							/*first time when we click on any row on parent grid it load all data so we add the list of grid pagesize*/
							gridStore.baseParams.limit = record.getBottomToolbar().pageSize;
							gridStore.load();
							/*Here we are removing the limit because after first time grid automatically as pagesize*/
							delete gridStore.baseParams['limit'];
						}
					}
				}
			}
		}
	},
	addRecordIntoImagePurityStore: function (data) {
		var dataViewStore = this.imageDataView.getStore();
		dataViewStore.clearData();
		var record = data;
		for (var i = 0; i < data.length; i++) {

			this.carouselStore.insert(0, new Ext.data.Record({ 'AssetPurityId': data[i]['AssetPurityId'], 'PurityDateTime': data[i]['PurityDateTime'], 'ImageName': data[i]['StoredFilename'], 'ImageCount': data[i]['ImageCount'], 'IsAlertImage': data[i]['IsAlertImage'] }));
		}
		if (this.imageDataView.isVisible()) {
			this.imageDataView.refresh();
		}
	},
	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		this.smartDeviceMovementGrid = Cooler.SmartDeviceAlertMovement.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true, isFromAlert: true });
		this.smartDeviceDoorStatusGrid = Cooler.SmartDeviceAlertDoorStatus.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true, isFromAlert: true });
		this.smartDeviceHealthGrid = Cooler.SmartDeviceAlertHealth.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true, isFromAlert: true });
		this.smartDeviceAlertPowerEventGrid = Cooler.SmartDeviceAlertPowerEvent.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true, isFromAlert: true });
		this.smartDevicePurityGrid = Cooler.CoolerImageForAlert.createGrid({ title: 'Purities', editable: false, disabled: true, tbar: [] }, '', '', { isChildGrid: true, isFromAlert: true });
		this.SmartDeviceStockSensorData = Cooler.SmartDeviceStockSensorDataReadOnly.createGrid({ disabled: true, tbar: [], showDefaultButtons: true }, '', '', { isChildGrid: true, isFromAlert: true });
		var coolerImagesStore = this.smartDevicePurityGrid.getStore();

		var carouselStore = new Ext.data.Store({ fields: [{ name: 'AssetPurityId', type: 'int' }, { name: 'PurityDateTime', type: 'date' }, { name: 'ImageName', type: 'string' }, { name: 'ImageCount', type: 'int' }, { name: 'IsAlertImage', type: 'bool' }] });
		this.carouselStore = carouselStore;
		var imageDataViewTpl = new Ext.XTemplate(
			'<tpl for=".">',
			'<div style="float:left;">{[this.renderImage(values)]}</div>',
			'</tpl>', {
				renderImage: function (values) {
					var imageName = values.ImageName;
					var imageCount = values.ImageCount;
					var assetPurityId = values.AssetPurityId;
					var isAlertImage = values.IsAlertImage;
					var purityDateTime = new Date(values.PurityDateTime);
					var carouselImage = '';
					if (imageCount > 1) {
						for (var i = 1; i <= imageCount; i++) {
							var carouselImageName = imageName.replace('.jpg', '_' + i + '.jpg');
							carouselImage += '<div id ="' + assetPurityId + '" class="carouselDiv" assetPurityId="' + assetPurityId + '" >';
							if (isAlertImage == true) {
								carouselImage += '<div id=\'headingDivAlert\'style="text-align: center;" ><p><b><u> Alerted Image - ' + i + ' </u></b></p></div>' +
									'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + carouselImageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
									'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
									'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
									'</div>';
							}
							else {
								carouselImage += '<div id=\'headingDivLatest\' style="text-align: center;"><p><b><u> Latest Image - ' + i + ' </u></b></p></div>' +
									'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + carouselImageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
									'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
									'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
									'</div>';
							}
						}
					}
					else {
						carouselImage += '<div id ="' + assetPurityId + '" class="carouselDiv" assetPurityId="' + assetPurityId + '" >';
						if (isAlertImage == true) {
							carouselImage += '<div id=\'headingDivAlert\' style="text-align: center;"><p><b><u> Alerted Image </u></b></p></div>' +
								'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + imageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
								'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
								'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
								'</div>';
						}
						else {
							carouselImage += '<div id=\'headingDivLatest\' style="text-align: center;"><p><b><u> Latest Image </u></b></p></div>' +
								'<img class="purityImage" src="./thumbnail.ashx?imagePath=processed/' + purityDateTime.format(Cooler.Enums.DateFormat.PurityDate) + '/' + imageName + '&isStockimages=true&v=' + new Date().getTime() + '"></img>' + '<br>' +
								'<b>Asset Purity Id: </b>' + assetPurityId + '<br>' +
								'<b>Purity Date Time: </b>' + ExtHelper.renderer.DateTime(purityDateTime) +
								'</div>';
						}

					}
					return carouselImage;
				}
			}
		);
		this.imageDataViewTpl = imageDataViewTpl;
		var imageDataView = new Ext.DataView({
			tpl: this.imageDataViewTpl,
			store: this.carouselStore,
			itemSelector: 'div.carouselDiv',
			listeners: {
				'click': function (dataView, index, node) {

					var tempIndex = index;
					var assetPurityId = node.id;
					if (!assetPurityId) {
						return;
					}
					this.assetPurityId = assetPurityId;
					this.assetPurityId = assetPurityId;
					if (index < 2) {
						index = 0
					}
					else {
						index = 1;
					}
					this.alertImageIndex = index;

					//Load Facings Data for Cooler
					Ext.Ajax.request({
						url: 'controllers/AssetPurity.ashx',
						params: { action: 'GetFacings', otherAction: 'GetFacings', AssetPurityId: assetPurityId, requestFrom: 'AlertPage' },
						scope: this,
						success: function (result, request) {

							var data = Ext.decode(result.responseText);
							this.showCoolerImageWindow(data, this.assetPurityId);
						},
						failure: function (result, request) {
							Ext.Msg.alert('Alert', JSON.parse(result.responseText));
						},
					});
					$(".carouselDiv").removeClass('selectedCarouselDiv');
					dataView.getNodes()[tempIndex].classList.add('selectedCarouselDiv');
				},
				scope: this
			}
		});
		this.imageDataView = imageDataView;
		var imageCarouselPanel = new Ext.Panel({
			title: 'Purity Images',
			region: 'south',
			layout: 'fit',
			autoScroll: true,

			disabled: true,
			items: imageDataView
		});
		this.imageCarouselPanel = imageCarouselPanel;

		var chieldTabItems = [
			this.smartDeviceMovementGrid,
			this.smartDeviceDoorStatusGrid,
			this.smartDeviceHealthGrid,
			this.smartDeviceAlertPowerEventGrid,
			this.smartDevicePurityGrid,
			this.imageCarouselPanel,
			this.SmartDeviceStockSensorData
		];

		this.south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: chieldTabItems,
			height: 200,
			split: true
		});
		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, this.south],
			scope: this
		});
		return config;
	},
	showCoolerImageWindow: function (record, recordId) {

		if (!recordId) {
			return;
		}
		if (!this.planogramTpl) {
			var planogramTpl = new Ext.XTemplate(
				'<div class="rectangle-red" {[this.setColumn(values.maxColumnCount, values.isPlanogram)]}>',
				'<div class="productDetailText">{Title}</div>',
				'</div>',
				'<tpl for="shelves">',
				'<div class="rectangle-grey">',
				'<div class="coolerProductImage">',
				'<tpl for="values.products">',
				'{[this.productDiv(values)]}',
				'</tpl>',
				'</div>',
				'</div>',
				'</tpl>',
				'<div class="rectangle-black" >',
				'<div class="rectangle-black-grey"></div>',
				'</div>',
				{
					setColumn: function (columnCount, isPlanogram) {
						if (columnCount) {
							this.columnCount = columnCount;
							this.isPlanogram = isPlanogram;
						}
					},
					productDiv: function (values) {
						if (!values) {
							return;
						}
						if (!values.id) {
							values.thumbnail = './images/blank.png';
						}
						var width = values.width;
						var style;
						if (width === 0) {
							var columnCount = this.columnCount;
							width = columnCount ? Number((100 / (columnCount * 5)).toFixed(2)) + 'vw;' : 2.2 + 'vw;';
							style = 'style="width:' + width + '"';
						}
						else {
							width = Number((width / 75).toFixed(2));
							width = width < .3 ? 0.5 : width;
							style = 'style="width:' + width + 'vw;"';
						}
						var div = '';

						if (values.missing && this.isPlanogram == false) {
							div += '<span class="imagePlanogram"><img ' + style + ' src =' + values.thumbnail + ' onerror="this.src = \'./resources/images/imageNotFound.png\'"/><span class="rectanglePosition" style = "background-color:' + values.color + ';"></span></span>';
						}
						else {
							div += '<img ' + style + ' src =' + values.thumbnail + ' onerror="this.src = \'./resources/images/imageNotFound.png\'" />';
						}
						return div;
					}
				}
			);
			this.planogramTpl = planogramTpl;
		}
		if (!this.imageTpl) {
			var imageTpl = new Ext.XTemplate(
				'<div>',
				'<table class = "centerAlign">',
				'<tr>',
				'<td id= "tdImgPrev" class = "infoChangeButtonDiv" data-button = "Previous" rowspan="2"><img  id= "imgPrev" class = "nextPrevButton" src = "./images/icons/prev.png"></td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/planogram.png"></div><div class ="blueText">Planogram</div><div>{PlanogramCompliance}%</div></div>',
				'</td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/purity.png"></div><div class ="blueText">Purity</div><div>{PurityPercent}%</div></div>',
				'</td>',
				'<td class = "infoPercentageDiv">',
				'<div class = "centerAlign"><div><img src = "./images/icons/stock.png"></div><div class ="blueText">Stock</div><div>{StockPercent}%</div></div>',
				'</td>',
				'<td id= "tdImgNext" class="infoChangeButtonDiv" data-button = "Next" rowspan="2"><img id = "imgNext" class = "nextPrevButton" src = "./images/icons/next.png"></td>',
				'</tr>',
				'<tr>',
				'<td><div style: margin: auto;>{ImageHeader}<div></td>',
				'</table>',
				'<div style = "margin-top: 1em;">',
				'<tpl for="Planogram">',
				'<div class="planogram-legend-div"><div style = "background-color:{values.Color}"; class = "planogram-legend-rect"></div><div class= "planogram-legend-text">{values.Name}</div></div>',
				'</tpl>',
				'</div>',
				'<tpl for="Images">',
				'<div class="purityImageDiv centerAlign"><img class= "purityProcessedImage" src = {values.url}>Last updated on {[this.formatDateAsString(values.capturedOn)]}</div>',  // need to confirm either we need to shoew capturedOn
				'</tpl>',
				'</div>',
				{
					formatDateAsString: function (input) {
						if (input) {
							return moment(input).format(Cooler.Enums.DateFormat.PurityProcessedDate);
						}
						return ''
					}
				}
			);
			this.imageTpl = imageTpl;
		}


		var facings = record.facings,
			planogramDetail = record.planogram ? record.planogram : { shelves: {} },
			facingDetail = this.updateMissingProductDetail(planogramDetail, facings),
			images = record.images ? record.images : {},
			maxColumnCount = planogramDetail.columns > facingDetail.columns ? planogramDetail.columns : facingDetail.columns ? facingDetail.columns : 0,
			planogramCompliance = record.planogramCompliance,
			purityPercent = record.purityPercentage,
			stockPercent = record.stockPercentage,
			assetPurityid = recordId,
			imageHeader = 'Alerted Images';
		if (this.alertImageIndex > 0) {
			imageHeader = 'Latest Images';
		}
		this.imageHeader = imageHeader;
		percentWithImage = { PlanogramCompliance: planogramCompliance, PurityPercent: purityPercent, StockPercent: stockPercent, Images: images, Planogram: this.productLegendArray, ImageHeader: this.imageHeader };


		facingDetail.Title = "REALOGRAM";

		facingDetail.isPlanogram = false;
		facingDetail.maxColumnCount = maxColumnCount;
		planogramDetail.Title = "PLANOGRAM";
		planogramDetail.isPlanogram = true;
		planogramDetail.maxColumnCount = maxColumnCount;
		var purityInfo = this.imageTpl.apply(percentWithImage);
		var facing = this.planogramTpl.apply(facingDetail);
		var planogram = this.planogramTpl.apply(planogramDetail);
		if (!this.coolerWin) {
			var coolerWin = new Ext.Window({
				width: '85%',
				height: 700,
				modal: false,
				layout: 'border',
				autoScroll: true,
				closeAction: 'hide',
				resizable: false,
				items: [
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerPlanogramDisplay',
						region: 'west',
						width: '34%',
						html: planogram,
						autoScroll: true
					},
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerOppurtunityDisplay',
						region: 'center',
						html: facing,
						autoScroll: true
					},
					{
						xtype: 'panel',
						frame: false,
						itemId: 'coolerImage',
						region: 'east',
						width: '34%',
						html: purityInfo,
						autoScroll: true
					}
				]
			});
			this.coolerWin = coolerWin;
			this.coolerWin.on('show', this.onCoolerImageWindowShow, this);
		}
		this.coolerWin.setTitle('Asset purity: ' + assetPurityid);
		var oppurtunityPanelBody = this.coolerWin.getComponent('coolerOppurtunityDisplay').body;
		var planogramPanelBody = this.coolerWin.getComponent('coolerPlanogramDisplay').body;
		var imageTplBody = this.coolerWin.getComponent('coolerImage').body;
		if (oppurtunityPanelBody) {
			oppurtunityPanelBody.update(facing);
		}
		if (planogramPanelBody) {
			planogramPanelBody.update(planogram);
		}
		if (imageTplBody) {
			imageTplBody.update(purityInfo);
		}
		if (this.coolerWin.isVisible()) {
			this.coolerWin.hide();
		}
		this.coolerWin.show();
	},
	updateMissingProductDetail: function (planogramDetail, facing) {
		this.productLegendArray = [];
		if (!planogramDetail.shelves.length > 0) {
			return facing ? facing : { shelves: {} };
		}
		var shelves = planogramDetail.shelves;
		var columnCount = 0, shelve, products;
		for (var i = 0, len = shelves.length; i < len; i++) {
			shelve = shelves[i];
			products = shelve.products;
			columnCount = products.length;
			for (var j = 0; j < columnCount; j++) {
				var product = products[j];
				var productId = product.id;
				var value = { Name: product.fullName, Color: product.color };
				if (!this.objContains(this.productLegendArray, value)) {
					this.productLegendArray.push(value);
				}
				var facingProduct = facing.shelves[i].products[j];
				if (!facingProduct) {
					facingProduct = product;
					facingProduct.missing = true;
					facingProduct.hideMissing = true;
					facingProduct.color = product.color;
				}
				else if (facingProduct && facingProduct.id != productId) {
					facingProduct.missing = true;
					facingProduct.color = product.color;
				}
				else if (facingProduct && facingProduct.isEmpty && !product.isEmpty) {
					facingProduct.missing = true;
					facingProduct.color = product.color;
				}
				facing.shelves[i].products[j] = facingProduct;
			}
		}
		return facing;
	},
	onCoolerImageWindowShow: function (coolerWin) {

		var infoChangeButtonDiv = document.getElementsByClassName("infoChangeButtonDiv");
		if (this.alertImageIndex > 0) {
			var nxtButtonDiv = document.getElementById("tdImgNext");
			nxtButtonDiv.classList.remove('clickable');
			nxtButtonDiv.classList.add('unClickable');
			var prevButtonDiv = document.getElementById("tdImgPrev");
			prevButtonDiv.classList.remove('unClickable');
			prevButtonDiv.classList.add('clickable');
			this.imageHeader = 'Latest Images';
		}
		else {
			var nxtButtonDiv = document.getElementById("tdImgNext");
			nxtButtonDiv.classList.remove('unClickable');
			nxtButtonDiv.classList.add('clickable');
			var prevButtonDiv = document.getElementById("tdImgPrev");
			prevButtonDiv.classList.remove('clickable');
			prevButtonDiv.classList.add('unClickable');
			this.imageHeader = 'Alerted Images';
		}
		for (var i = 0, len = infoChangeButtonDiv.length; i < len; i++) {
			infoChangeButtonDiv[i].addEventListener("click", function (ele) {

				//Grid detail
				//var grid = this.grid;
				var store = this.imageDataView.getStore();
				//var selectionModel = grid.getSelectionModel();
				//var selectedRecord = selectionModel.getSelections()[0];
				var rowIndex = this.alertImageIndex;

				// bottom tool bar values
				//var bottomToolbar = grid.getBottomToolbar();

				var lastRecordCount = store.data.items.length - 1;
				//var pageData = bottomToolbar.getPageData();
				//var activePage = pageData.activePage;
				//var totalPages = pageData.pages;

				// params for relaod next/Previous grid page if required
				var params = {};
				this.selectLast = this.selectFirst = false;
				var target = ele.target || ele.srcElement;
				var button = target.dataset.button || target.parentNode.dataset.button;

				switch (button) {
					case 'Previous':
						if (rowIndex <= 0) {
							var nxtButtonDiv = document.getElementById("tdImgNext");
							nxtButtonDiv.classList.remove('unClickable');
							nxtButtonDiv.classList.add('clickable');
							var prevButtonDiv = document.getElementById("tdImgPrev");
							prevButtonDiv.classList.remove('clickable');
							prevButtonDiv.classList.add('unClickable');
							var nodeIndex = 0;
							this.alertImageIndex = 0;
							this.imageDataView.fireEvent('click', this.imageDataView, this.alertImageIndex, this.imageDataView.getNode(nodeIndex))
						}
						else {
							this.alertImageIndex = 0;
							var nodeIndex = 0;
							var nxtButtonDiv = document.getElementById("imgPrev");
							nxtButtonDiv.style.pointerEvents = 'none';
							this.imageDataView.fireEvent('click', this.imageDataView, this.alertImageIndex, this.imageDataView.getNode(nodeIndex));
						}
						break;
					case 'Next':

						if (rowIndex + 1 >= lastRecordCount) {
							var nxtButtonDiv = document.getElementById("tdImgNext");
							nxtButtonDiv.classList.remove('clickable');
							nxtButtonDiv.classList.add('unClickable');
							this.alertImageIndex = rowIndex + 1;
							var nodeIndex = 0;
							if (this.alertImageIndex >= 1) {
								nodeIndex = 3;
								this.alertImageIndex = 3;
							}
							else {
								nodeIndex = 0;
								this.alertImageIndex = 0;
							}
							this.imageDataView.fireEvent('click', this.imageDataView, this.alertImageIndex, this.imageDataView.getNode(nodeIndex))
						}
						else {
							this.alertImageIndex = rowIndex + 1;
							var nodeIndex = 0;
							if (this.alertImageIndex == 1) {
								nodeIndex = 3;
								this.alertImageIndex = 3;
							}
							else {
								nodeIndex = 0;
								this.alertImageIndex = 0;
							}
							this.imageDataView.fireEvent('click', this.imageDataView, this.alertImageIndex, this.imageDataView.getNode(nodeIndex));
						}
						break;
				}
				//if (this.selectFirst || this.selectLast) {
				//	store.load({ params: params });
				//}
			}.bind(this), false);
		}
	},
	objContains: function (arr, obj) {
		var i = arr.length;
		while (i--) {
			if (JSON.stringify(arr[i]) === JSON.stringify(obj)) {
				return true;
			}
		}
		return false;
	}
});
Cooler.Alert = new Cooler.AlertCl({ uniqueId: 'Alert' });
Cooler.AssetAlert = new Cooler.AlertCl({ uniqueId: 'AssetAlert' });