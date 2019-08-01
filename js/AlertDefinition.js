Cooler.AlertDefinition = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Alert Definition: {0}',
		listTitle: 'Alert Definition',
		keyColumn: 'AlertDefinitionId',
		captionColumn: 'Name',
		controller: 'AlertDefinition',
		securityModule: 'AlertDefinition',
		comboTypes: [
			'EmailTemplate',
			'AlertRecipientType',
			'AlertNotificationTime',
			'AlertType',
			'NotificationContactType',
			'OutletSOVIType',
			'Market',
			'LocationType',
			'LocationClassification',
			'Role',
			'SubOpportunityType'
		]
	});
	Cooler.AlertDefinition.superclass.constructor.call(this, config);
};

var isSalesOrganizationChange = false;
var isSalesOfficeChange = false;
var isSalesGroupChange = false;
var isSalesTerritoryChange = false;

Ext.extend(Cooler.AlertDefinition, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'AlertDefinitionId', type: 'int' },
		{ name: 'AlertTypeId', type: 'int' },
		{ name: 'OutletTypeId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'MovementDetected', type: 'float' },
		{ name: 'PowerOffDuration', type: 'float' },
		{ name: 'DoorOpenDuration', type: 'float' },
		{ name: 'DoorCloseDuration', type: 'float' },
		{ name: 'DoorOpeningLessThan', type: 'float' },
		{ name: 'DoorOpeningGreaterThan', type: 'float' },
		{ name: 'TemperatureBelow', type: 'float' },
		{ name: 'TemperatureAbove', type: 'float' },
		{ name: 'IsActive', type: 'bool' },
		{ name: 'AssetId', type: 'int' },
		{ name: 'AssetModelId', type: 'int' },
		{ name: 'MinLight', type: 'int' },
		{ name: 'MaxLight', type: 'int' },
		{ name: 'OfflineAlertTime', type: 'int' },
		{ name: 'OnlineAlertTime', type: 'int' },
		{ name: 'MissingThreshold', type: 'int' },
		{ name: 'AlertBody', type: 'string' },
		{ name: 'DailyAlert', type: 'bool' },
		{ name: 'ClientName', type: 'string' },
		{ name: 'AlertType', type: 'string' },
		{ name: 'City', type: 'string' },
		{ name: 'State', type: 'string' },
		{ name: 'StateId', type: 'int' },
		{ name: 'SalesrepId', type: 'int' },
		{ name: 'SupervisorId', type: 'int' },
		{ name: 'Salesrep', type: 'string' },
		{ name: 'Supervisor', type: 'string' },
		{ name: 'DisconnectThreshold', type: 'int' },
		{ name: 'AlertAgeThreshold', type: 'int' },
		{ name: 'NoDataThreshold', type: 'int' },
		{ name: 'BatteryThreshold', type: 'int' },
		{ name: 'BatteryCloseThreshold', type: 'int' },
		{ name: 'StockThreshold', type: 'int' },
		{ name: 'PurityThreshold', type: 'int' },
		{ name: 'PlanogramThreshold', type: 'int' },
		{ name: 'OpenAlertCount', type: 'int' },
		{ name: 'UpdatedAlertCount', type: 'int' },
		{ name: 'GPSThreshold', type: 'int' },
		{ name: 'AssetSerialNumber', type: 'string' },
		{ name: 'Priority', type: 'string' },
		{ name: 'Location', type: 'string' },
		{ name: 'ColasThreshold', type: 'int' },
		{ name: 'FlavoursThreshold', type: 'int' },
		{ name: 'CombineThreshold', type: 'int' },
		{ name: 'LaneThreshold', type: 'int' },
		{ name: 'StockMin', type: 'int' },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'IsSystemAlert', type: 'bool' },
		{ name: 'SalesOrganization', type: 'string' },
		{ name: 'SalesOrganizationId', type: 'int' },
		{ name: 'NoTransmissionThreshold', type: 'int' },
		{ name: 'IsCoolerMissing', type: 'bool' }
	]),
	comboStores: {
		EmailTemplate: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertRecipientType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertNotificationTime: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AlertPriority: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		NotificationContactType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		OutletSOVIType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Market: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		LocationType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		LocationClassification: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Role: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SubOpportunityType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Name', dataIndex: 'Name', width: 200 },
			{ header: 'Type', dataIndex: 'AlertType' },
			{ header: 'Asset Serial Number', dataIndex: 'AssetSerialNumber', width: 140, hyperlinkAsDoubleClick: true },
			{ header: 'Priority', dataIndex: 'Priority', width: 60 },
			{ header: 'Is Active', dataIndex: 'IsActive', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Open Alert', dataIndex: 'OpenAlertCount', width: 100, align: 'right', hyperlinkAsDoubleClick: true },
			{ header: 'Updated Alert', dataIndex: 'UpdatedAlertCount', width: 100, align: 'right', hyperlinkAsDoubleClick: true },
			{ header: 'Movement Detected', dataIndex: 'MovementDetected', width: 100, align: 'right' },
			{ header: 'Power Off Duration', dataIndex: 'PowerOffDuration', width: 100, align: 'right' },
			{ header: 'Door Open Duration', dataIndex: 'DoorOpenDuration', width: 100, align: 'right' },
			{ header: 'Door Close Duration', dataIndex: 'DoorCloseDuration', width: 100, align: 'right' },
			{ header: 'Door Opening Less Than', dataIndex: 'DoorOpeningLessThan', width: 100, align: 'right' },
			{ header: 'Door Opening Greater Than', dataIndex: 'DoorOpeningGreaterThan', width: 100, align: 'right' },
			{ header: 'Temperature Below', dataIndex: 'TemperatureBelow', width: 100, align: 'right' },
			{ header: 'Temperature Above', dataIndex: 'TemperatureAbove', width: 100, align: 'right' },
			{ header: 'Min Light', dataIndex: 'MinLight', width: 100, align: 'right' },
			{ header: 'Max Light', dataIndex: 'MaxLight', width: 100, align: 'right' },
			{ header: 'Offline Alert Time', dataIndex: 'OfflineAlertTime', width: 100, align: 'right' },
			{ header: 'Online Alert Time', dataIndex: 'OnlineAlertTime', width: 100, align: 'right' },
			{ header: 'Missing/Faulty time', dataIndex: 'MissingThreshold', width: 100, align: 'right' },
			{ header: 'Cooler Disconnect Threshold', dataIndex: 'DisconnectThreshold', width: 100, align: 'right' },
			{ header: 'Alert Age Threshold', dataIndex: 'AlertAgeThreshold', width: 100, align: 'right' },
			{ header: 'No Data Threshold', dataIndex: 'NoDataThreshold', width: 100, align: 'right' },
			{ header: 'Battery Open Threshold', dataIndex: 'BatteryThreshold', width: 100, align: 'right' },
			{ header: 'Battery Close Threshold', dataIndex: 'BatteryCloseThreshold', width: 100, align: 'right' },
			{ header: 'Stock Threshold', dataIndex: 'StockThreshold', width: 100, align: 'right' },
			{ header: 'Purity Threshold', dataIndex: 'PurityThreshold', width: 100, align: 'right' },
			{ header: 'Planogram Threshold', dataIndex: 'PlanogramThreshold', width: 100, align: 'right' },
			{ header: 'GPS Displacement Threshold', dataIndex: 'GPSThreshold', width: 100, align: 'right' },
			{ header: 'Colas Threshold', dataIndex: 'ColasThreshold', width: 100, align: 'right' },
			{ header: 'Flavours Threshold', dataIndex: 'FlavoursThreshold', width: 100, align: 'right' },
			{ header: 'Colas + Flavours', dataIndex: 'CombineThreshold', width: 100, align: 'right' },
			{ header: 'Lane Threshold', dataIndex: 'LaneThreshold', width: 100, align: 'right' },
			{ header: 'Min Stock', dataIndex: 'StockMin', width: 100, align: 'right' },
			{ header: 'Alert Text', dataIndex: 'AlertBody', width: 100 },
			{ header: 'Daily Alert', dataIndex: 'DailyAlert', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', width: 100 },
			{ header: 'Outlet', dataIndex: 'Location', width: 100 },
			{ header: 'Sales Organization', dataIndex: 'SalesOrganization', width: 100 },
			{ header: 'City', dataIndex: 'City', width: 100 },
			{ header: 'State', dataIndex: 'State', width: 100 },
			{ header: 'SalesRep', dataIndex: 'Salesrep', type: 'string', width: 140 },
			{ header: 'Supervisor', dataIndex: 'Supervisor', type: 'string', width: 140 },
			{ header: 'Is System Alert?', dataIndex: 'IsSystemAlert', width: 100, type: 'bool', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		cm.defaultSortable = true;
		return cm;
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.cellclick, this);
	},
	cellclick: function (grid, rowIndex, e, options) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e]
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		if (Number(rec.get('OpenAlertCount')) === 0 && Number(rec.get('UpdatedAlertCount')) === 0) {
			return;
		}

		switch (column.dataIndex) {
			case 'OpenAlertCount':
				Cooler.Alert.ShowList('', { title: rec.get('Name') + ' (' + rec.get('OpenAlertCount') + ')', extraParams: { AlertDefinitionId: rec.get('AlertDefinitionId'), StatusId: 1, isFromAlert: false } });
				break;
		}

		switch (column.dataIndex) {
			case 'UpdatedAlertCount':
				Cooler.Alert.ShowList('', { title: rec.get('Name') + ' (' + rec.get('UpdatedAlertCount') + ')', extraParams: { AlertDefinitionId: rec.get('AlertDefinitionId'), StatusId: 3, isFromAlert: false } });
				break;
		}
	},
	onAlertBodyTextChange: function (alertTooltip, appendText) {
		var tooltipText = String.format("{0}{1}{2}", "Allowed parameter:<br> ", appendText, "<br><br> Text inside {|...|} should be the same as mentioned above. <br> Normal text is also allowed which will not replace");
		if (alertTooltip.body) {
			alertTooltip.body.update(tooltipText);
		} else {
			alertTooltip.html = tooltipText;
		}
	},

	resetFormValue: function () {
		this.formPanel.items.each(function (column) {
			column.items.each(function (item) {
				if (item.hidden) {
					if (!item.getXType() == "combo") {
						item.setValue(0);
					}
					else {
						item.setValue('');
					}

				}
			});
		});
	},

	onAlertTypeComboSelect: function (combo, record, index) {
		this.powerOffOnly.setFieldVisible(false);
		this.forHubOnly.setFieldVisible(false);
		this.withAccuracy.setFieldVisible(false);
		this.alertDefinitionProductStock.setDisabled(true);
		this.alertDefinitionShelfColumn.setDisabled(true);
		this.alertDefinitionProduct.setDisabled(true);
		this.alertDefinitionDoorPercentageChange.setDisabled(true);
		this.movementDetected.setFieldVisible(false);
		this.doorOpenDuration.setFieldVisible(false);
		this.doorOpeningMin.setFieldVisible(false);
		this.doorOpeningMax.setFieldVisible(false);
		this.isWeeklyCheckbox.setValue(false);
		this.isWeeklyCheckbox.setFieldVisible(true);
		this.minTemperature.setFieldVisible(false);
		this.maxTemperature.setFieldVisible(false);
		this.isWeeklyCheckbox.setFieldVisible(false);
		this.minLight.setFieldVisible(false);
		this.maxLight.setFieldVisible(false);
		this.disconnectThreshold.setFieldVisible(false);
		this.batteryOpenThreshold.setFieldVisible(false);
		this.batteryCloseThreshold.setFieldVisible(false);
		this.noDataThreshold.setFieldVisible(false);
		this.movementCountThreshold.setFieldVisible(false);
		this.gpsThreshold.setFieldVisible(false);
		this.gpsMotionThreshold.setFieldVisible(false);
		this.stockThreshold.setFieldVisible(false);
		this.purityThreshold.setFieldVisible(false);
		this.planogramThreshold.setFieldVisible(false);
		this.offlineAlertTime.setFieldVisible(false);
		this.onlineAlertTimenew.setFieldVisible(false);
		this.flavoursThreshold.setFieldVisible(false);
		this.colasThreshold.setFieldVisible(false);
		this.combineThreshold.setFieldVisible(false);
		this.laneThreshold.setFieldVisible(false);
		this.outletSOVITypeCombo.setFieldVisible(false);
		this.market.setFieldVisible(true);
		this.classificationCombo.setFieldVisible(true);
		this.locationTypeCombo.setFieldVisible(true);
		this.subOpportunityTypeCombo.allowBlank = true;
		this.subOpportunityTypeCombo.setFieldVisible(false);
		//this.organizationCombo.setFieldVisible(true);
		this.noTransmissionThreshold.setFieldVisible(false);
		this.lightOffHours.setFieldVisible(false);
		this.salesCountMin.setFieldVisible(false);
		this.salesCountMax.setFieldVisible(false);
		this.salesOrderDaysCombo.setFieldVisible(false);
		this.batteryGSMThreshold.setFieldVisible(false);
		this.coolerMissing.setFieldVisible(false);
		this.stockMin.setFieldVisible(false);
		this.doorOpeningMin.allowBlank = true;
		this.doorOpeningMax.allowBlank = true;
		this.minTemperature.allowBlank = true;
		this.maxTemperature.allowBlank = true;
		this.salesOrderDaysCombo.allowBlank = true;
		this.salesCountMin.allowBlank = true;
		this.salesCountMax.allowBlank = true;
		var alertTypeId = combo.getValue();
		var alertTooltip = this.alertBodyArea.toolTip;
		var allowedForAlertText;
		this.clientCombo.allowBlank = true;
		if (alertTypeId != Cooler.Enums.AlertType.OutletSOVI) {
			this.outletSOVITypeCombo.reset();
			this.flavoursThreshold.setValue(0);
			this.colasThreshold.setValue(0);
			this.combineThreshold.setValue(0);
		}
		this.outletSOVITypeCombo.allowBlank = true;
		this.outletSOVITypeCombo.validate();
		this.assetCombo.setDisabled(false);
		this.assetModel.setDisabled(false);
		this.clientCombo.validate();
		switch (alertTypeId) {
			case Cooler.Enums.AlertType.StockAlertProductWise:
				this.alertDefinitionProductStock.setDisabled(false);
				allowedForAlertText = "Product : {|Product|}<br> Stock: {|Stock|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.DoorOpenMinAndSales:
			case Cooler.Enums.AlertType.LightOffHoursAndSales:
			case Cooler.Enums.AlertType.TemperatureAndSales:
			case Cooler.Enums.AlertType.SmartRewardIssue:
			case Cooler.Enums.AlertType.HighUtilizationLowSales:
			case Cooler.Enums.AlertType.LowUtilizationHighSales:
				this.assetCombo.reset();
				this.assetModel.reset();
				this.assetCombo.setDisabled(true);
				this.assetModel.setDisabled(true);
				if (alertTypeId == Cooler.Enums.AlertType.SmartRewardIssue) {
					this.subOpportunityTypeCombo.setFieldVisible(true);
					this.subOpportunityTypeCombo.allowBlank = false;
					this.subOpportunityTypeCombo.validate();
					this.classificationCombo.setFieldVisible(false);
					this.locationTypeCombo.setFieldVisible(false);
					this.market.setFieldVisible(false);
					//this.organizationCombo.setFieldVisible(false);
					allowedForAlertText = "IssueText : {|IssueText|}";
				}
				else if (alertTypeId == Cooler.Enums.AlertType.DoorOpenMinAndSales || alertTypeId == Cooler.Enums.AlertType.HighUtilizationLowSales || alertTypeId == Cooler.Enums.AlertType.LowUtilizationHighSales) {
					this.salesOrderDaysCombo.setFieldVisible(true);
					this.salesOrderDaysCombo.allowBlank = false;
					this.salesOrderDaysCombo.validate();
					if (alertTypeId == Cooler.Enums.AlertType.HighUtilizationLowSales) {
						this.doorOpeningMin.setFieldVisible(true);
						//this.doorOpeningMax.setFieldVisible(true);
						this.doorOpeningMin.allowBlank = false;
						this.doorOpeningMin.validate();
						this.salesCountMin.setFieldVisible(true);
						this.salesCountMin.allowBlank = false;
						this.salesCountMin.validate();
					}
					else {
						this.doorOpeningMax.setFieldVisible(true);
						//this.doorOpeningMin.setFieldVisible(true);
						this.doorOpeningMax.allowBlank = false;
						this.doorOpeningMax.validate();
						if (alertTypeId == Cooler.Enums.AlertType.LowUtilizationHighSales) {
							this.salesCountMax.setFieldVisible(true);
							this.salesCountMax.allowBlank = false;
							this.salesCountMax.validate();
						}
						else {
							this.salesCountMin.setFieldVisible(true);
							this.salesCountMin.allowBlank = false;
							this.salesCountMin.validate();
						}
					}
					allowedForAlertText = "Door Count : {|DoorCount|} <br> Sales Count : {|SalesCount|} <br> Event Time : {|EventTime|}";
				}
				else if (alertTypeId == Cooler.Enums.AlertType.LightOffHoursAndSales) {
					this.salesCount.setFieldVisible(true);
					this.salesCount.allowBlank = false;
					this.salesCount.validate();
					this.lightOffHours.setFieldVisible(true);
					this.lightOffHours.allowBlank = false;
					this.lightOffHours.validate();
					allowedForAlertText = "Light Off Hours : {|LightOffHours|} <br> Sales Count : {|SalesCount|}"
				}
				else if (alertTypeId == Cooler.Enums.AlertType.TemperatureAndSales) {
					this.salesCount.setFieldVisible(true);
					this.salesCount.allowBlank = false;
					this.salesCount.validate();
					this.minTemperature.setFieldVisible(true);
					this.minTemperature.allowBlank = false;
					this.minTemperature.validate();
					this.maxTemperature.setFieldVisible(true);
					this.maxTemperature.allowBlank = false;
					this.maxTemperature.validate();
					allowedForAlertText = "Temperature : {|Temperature|} <br> Sales Count : {|SalesCount|} <br> Event Time : {|EventTime|}"
				}
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.LowStock:
				this.laneThreshold.setFieldVisible(true);
			case Cooler.Enums.AlertType.OutOfStock:
				allowedForAlertText = "Product : {|Product|} <br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.OutletSOVI:
				this.assetCombo.reset();
				this.assetModel.reset();
				this.assetCombo.setDisabled(true);
				this.assetModel.setDisabled(true);
				this.clientCombo.allowBlank = false;
				this.clientCombo.validate();
				this.outletSOVITypeCombo.setFieldVisible(true);
				this.flavoursThreshold.setFieldVisible(true);
				this.colasThreshold.setFieldVisible(true);
				this.combineThreshold.setFieldVisible(true);
				this.outletSOVITypeCombo.allowBlank = false;
				this.outletSOVITypeCombo.validate();
				allowedForAlertText = "Client Time : {|ClientTime|} <br> Colas Percentage : {|ColasPercentage|} <br> Flavors : {|FlavorsPercentage|} <br> Combine Percentage : {|CombinePercentage|}<br> SOVIType : {|SOVIType|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.DoorPercentage:
				this.alertDefinitionDoorPercentageChange.setDisabled(false);
				allowedForAlertText = "Day : {|EventTime|} <br> DoorPercentage: {|DoorPercentage|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break
			case Cooler.Enums.AlertType.StockAlertShelfWise:
				this.alertDefinitionShelfColumn.setDisabled(false);
				allowedForAlertText = "Shelf : {|Shelf|} <br> Column : {|Column|} <br> Product : {|Product|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.Movement:
			case Cooler.Enums.AlertType.DeviceAccumulatedMovement:
			case Cooler.Enums.AlertType.HubAccumulatedMovement:
			case Cooler.Enums.AlertType.HubMovementDuration:
				this.movementDetected.setFieldVisible(true);
				allowedForAlertText = "Movement Duration : {|MovementDuration|} <br> Latitude : {|Latitude|} <br> Longitude : {|Longitude|}<br> Event Time : {|EventTime|} <br> Start Time : {|StartTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText)
				break;
			case Cooler.Enums.AlertType.Door:
				this.doorOpenDuration.setFieldVisible(true);
				allowedForAlertText = "Door Open Duration : {|DoorOpenDuration|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.SystemDoor:
				this.doorOpenDuration.setFieldVisible(true);
				allowedForAlertText = "Door Open Duration : {|DoorOpenDuration|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.DoorOpenMin:
				this.doorOpeningMin.setFieldVisible(true);
				this.isWeeklyCheckbox.setFieldVisible(true);
				allowedForAlertText = "Door Count : {|DoorCount|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.DoorOpenMax:
				this.doorOpeningMax.setFieldVisible(true);
				this.isWeeklyCheckbox.setFieldVisible(true);
				allowedForAlertText = "Door Count : {|DoorCount|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.EnvironmentHealth://Hub temprature alert only
			case Cooler.Enums.AlertType.Health://Asset temprature alert only
				this.minTemperature.setFieldVisible(true);
				this.maxTemperature.setFieldVisible(true);
				allowedForAlertText = "Temperature : {|Temperature|} <br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.EnvironmentLight://Hub light alert only
			case Cooler.Enums.AlertType.Light://Asset light alert only
				this.minLight.setFieldVisible(true);
				this.maxLight.setFieldVisible(true);
				allowedForAlertText = "Light : {|LightIntensity|} <br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.CoolerMalfunction:
				this.minTemperature.setFieldVisible(true);
				this.maxTemperature.setFieldVisible(true);
				this.minLight.setFieldVisible(true);
				this.maxLight.setFieldVisible(true);
				this.offlineAlertTime.setFieldVisible(true);
				this.onlineAlertTimenew.setFieldVisible(true);
				allowedForAlertText = "Temperature : {|Temperature|} <br> Light : {|LightIntensity|} <br> Battery : {|BatteryLevel|} <br> Sound Level : {|SoundLevel|} <br> Humidity : {|Humidity|} <br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.CoolerConnectivity:
				this.disconnectThreshold.setFieldVisible(true);
				allowedForAlertText = "Cooler Disconnect Duration : {|CoolerDisconnectDuration|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.NoData:
				this.noDataThreshold.setFieldVisible(true);
				allowedForAlertText = "No Data Duration : {|NoDataDuration|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.Battery:
			case Cooler.Enums.AlertType.VHCoreBattery:
				this.batteryOpenThreshold.setFieldVisible(true);
				this.batteryCloseThreshold.setFieldVisible(true);
				if (alertTypeId == Cooler.Enums.AlertType.VHCoreBattery) {
					this.market.setFieldVisible(false);
					this.classificationCombo.setFieldVisible(false);
					this.locationTypeCombo.setFieldVisible(false);
				}
				allowedForAlertText = "Battery : {|BatteryLevel|}<br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.Stock:
				this.stockThreshold.setFieldVisible(true);
				allowedForAlertText = "Stock Percentage: {|StockPercentage|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText)
				break;
			case Cooler.Enums.AlertType.Purity:
				this.purityThreshold.setFieldVisible(true);
				allowedForAlertText = "Purity Percentage: {|PurityPercentage|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.PlanogramAlert:
				this.planogramThreshold.setFieldVisible(true);
				allowedForAlertText = "Planogram Compliance : {|PlanogramCompliance|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.GpsDisplacement:
				this.gpsThreshold.setFieldVisible(true);
				this.powerOffOnly.setFieldVisible(true);
				this.forHubOnly.setFieldVisible(true);
				this.withAccuracy.setFieldVisible(true);
				allowedForAlertText = "GPS Displacement : {|GPSDisplacement|}<br> Latitude : {|Latitude|} <br> Longitude : {|Longitude|}<br>Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.MovementCount:
				this.movementCountThreshold.setFieldVisible(true);
				allowedForAlertText = "Movement Count : {|MovementCount|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.MissingData:
			case Cooler.Enums.AlertType.NoDoorData:
				allowedForAlertText = "Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.Power:
				allowedForAlertText = "Power Status : {|PowerStatus|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.ProductPositionAlert:
				this.alertDefinitionProduct.setDisabled(false);
				allowedForAlertText = "Shelf : {|Shelf|} <br> Column : {|Column|} <br> Product : {|Product|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.OutofStockSKUBased:
				this.alertDefinitionProduct.setDisabled(false);
				allowedForAlertText = "SKU : {|SKU|} <br> Product : {|Product|} <br> EventTime : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.OutofStockPlanogramBased:
				allowedForAlertText = "SKU : {|SKU|} <br> Product : {|Product|} <br> EventTime : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.StokeSensorAlert:
				this.stockMin.setFieldVisible(true);
				allowedForAlertText = "Minimum Stock Count : {|StockCount|} <br> Product : {|Product|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			case Cooler.Enums.AlertType.NonAuthorizedMovement:
				this.gpsThreshold.setFieldVisible(true);
				this.gpsMotionThreshold.setFieldVisible(true);
				break;
			case Cooler.Enums.AlertType.NoInitialTransmission:
				this.noTransmissionThreshold.setFieldVisible(true);
				break;
			case Cooler.Enums.AlertType.Battery_GSM:
				this.batteryGSMThreshold.setFieldVisible(true);
				break;
			case Cooler.Enums.AlertType.CoolerMissing:
				this.coolerMissing.setFieldVisible(true);
				break;
			case Cooler.Enums.AlertType.SmartTemperatureAlert://Smart temprature alert only
				this.minTemperature.setFieldVisible(true);
				this.maxTemperature.setFieldVisible(true);
				allowedForAlertText = "Temperature : {|Temperature|} <br> Event Time : {|EventTime|}";
				this.onAlertBodyTextChange(alertTooltip, allowedForAlertText);
				break;
			default:
				var tooltipText = "Please select an alert type to see the Alert tags.";
				if (alertTooltip.body) {
					alertTooltip.body.update(tooltipText);
				} else {
					alertTooltip.html = tooltipText;
				}
				break;
		}
		this.resetFormValue();
	},

	onOutletSOVITypeComboSelect: function (combo, record, index) {
		var value = combo.getValue();
		if (value > 0) {
			this.flavoursThreshold.setFieldVisible(false);
			this.colasThreshold.setFieldVisible(false);
			this.combineThreshold.setFieldVisible(false);
			switch (value) {
				case Cooler.Enums.OutletSOVIType.Colas:
					this.colasThreshold.setFieldVisible(true);
					this.flavoursThreshold.setValue(0);
					this.combineThreshold.setValue(0);
					break;
				case Cooler.Enums.OutletSOVIType.Flavours:
					this.flavoursThreshold.setFieldVisible(true);
					this.colasThreshold.setValue(0);
					this.combineThreshold.setValue(0);
					break;
				default:
					this.combineThreshold.setFieldVisible(true);
					this.colasThreshold.setValue(0);
					this.flavoursThreshold.setValue(0);
			}
		}
	},

	onBeforeLoad: function (param) {
		this.salesOrgCheckedvals = [];
		this.salesOfficeCheckedvals = [];
		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
		this.responsibleSalesHierarchyLevel_0.setValue('');
		this.responsibleSalesHierarchyLevel_1.setValue('');
		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
		this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		this.responsibleSmartDeviceTypeIdStore.getStore().load();

	},

	onDataLoaded: function (alertDefinitionForm, data) {
		this.salesHierarchyArray = [];
		if (data != '' && data != undefined) {
			this.salesHierarchyValues = data.data.SalesOrganizationIds;
		}
		var salesHierarchyIds = data.data.SalesOrganizationIds;

		if (salesHierarchyIds == '' || salesHierarchyIds == undefined) {
			this.salesHierarchyValues = "";
			this.salesHierarchyArray = [];
			this.salesOrgCheckedvals = [];
			this.salesOfficeCheckedvals = [];
			this.salesGroupCheckedvals = [];
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals = [];
			this.responsibleSalesHierarchyLevel_0.setValue('');
			this.responsibleSalesHierarchyLevel_1.setValue('');
			this.responsibleSalesHierarchyLevel_2.setValue('');
			this.responsibleSalesHierarchyLevel_3.setValue('');
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		}
		if (salesHierarchyIds != null && salesHierarchyIds != undefined) {
			if (salesHierarchyIds.length > 0) {
				// For Sales Organization
				this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
				this.responsibleSalesHierarchyLevel_0.setValue('');
				this.responsibleSalesHierarchyLevel_0.setValue('' + salesHierarchyIds + '');
				this.salesOrgCheckedvals = [];
				this.salesOrgCheckedvals.push(this.responsibleSalesHierarchyLevel_0.getValue());
				// For Sales Office
				this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
				this.responsibleSalesHierarchyLevel_1.setValue('');
				this.responsibleSalesHierarchyLevel_1.setValue('' + salesHierarchyIds + '');
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(this.responsibleSalesHierarchyLevel_1.getValue());
				// For Sales Group
				this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
				this.responsibleSalesHierarchyLevel_2.setValue('');
				this.responsibleSalesHierarchyLevel_2.setValue('' + salesHierarchyIds + '');
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(this.responsibleSalesHierarchyLevel_2.getValue());
				// For Sales Territory
				this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
				this.responsibleSalesHierarchyLevel_3.setValue('');
				this.responsibleSalesHierarchyLevel_3.setValue('' + salesHierarchyIds + '');
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_3.getValue());
				// For TeleSelling Sales Hierarchy 
				this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
				this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
				this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + salesHierarchyIds + '');
				this.salesTelesellingTerritoryCheckedvals = [];
				this.salesTelesellingTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getValue());
			}
		}
		this.responsibleforSalesHierarchyLevel_0.getStore().load();
		if (this.salesHierarchyValues) {
			this.salesHierarchyArray = this.salesHierarchyValues.split(',').map(Number);
		}
		var limitLocation = Number(DA.Security.info.Tags.LimitLocation);
		//this.salesHierarchyArray = [];
		//this.salesHierarchyArray = data.data.SalesOrganizationIds.split(',').map(Number);
		var record = data.data;
		//var startDateFieldForm = this.formPanel.find('name', 'StartDate'), startDateField;
		if (this.startDateField) {
			var startDateFieldValue = this.startDateField.getValue();
			var startDateMinValue = new Date();
			startDateMinValue.setHours(0, 0, 0, 0);
			record.Id == 0 ? this.startDateField.setMinValue(startDateMinValue) : this.startDateField.setMinValue(startDateFieldValue);
		}

		if (record.Id == 0) {
			this.outletTypeCombo.setValue(this.outletTypeCombo.store.data.first().id);
		}
		var tags = DA.Security.info.Tags;
		if (this.activeRecordId == 0 && (tags.LimitCountry == "1" || tags.LimitLocation == "1")) {
			this.onSalesOrganizationSelectAll(); // Selecting all organization if LimitCountry or LimitLocation set to 1
		}
	},

	createForm: function (config) {
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var outletTypeStore = [
			[6282, "Market"], [6283, "Warehouse"], [0, "All"]
		];
		var outletTypeCombo = DA.combo.create({ fieldLabel: 'Outlet Type', hiddenName: 'OutletTypeId', store: outletTypeStore, listWidth: 150, allowBlank: true, value: 6282 });

		var responsibleforSalesHierarchyLevel_0 = DA.combo.create({ baseParams: { comboType: 'SalesOrganization', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_0 = responsibleforSalesHierarchyLevel_0;
		this.responsibleforSalesHierarchyLevel_0.store.on('load', this.loadSalesOrganization, this);

		var responsibleforSalesHierarchyLevel_1 = DA.combo.create({ baseParams: { comboType: 'SalesOffice', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_1 = responsibleforSalesHierarchyLevel_1;
		this.responsibleforSalesHierarchyLevel_1.store.on('load', this.loadSalesOffice, this);

		var responsibleforSalesHierarchyLevel_2 = DA.combo.create({ baseParams: { comboType: 'SalesGroup', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_2 = responsibleforSalesHierarchyLevel_2;
		this.responsibleforSalesHierarchyLevel_2.store.on('load', this.loadSalesGroup, this);

		var responsibleforSalesHierarchyLevel_3 = DA.combo.create({ baseParams: { comboType: 'SalesTerritory', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_3 = responsibleforSalesHierarchyLevel_3;
		this.responsibleforSalesHierarchyLevel_3.store.on('load', this.loadSalesTerritory, this);

		var responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds = DA.combo.create({ baseParams: { comboType: 'TeleSellingSalesHierarchy', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds = responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.store.on('load', this.loadTeleSellingSalesHierarchy, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_0 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesOrganizationSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_0 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesOrganizationDeSelectAll, scope: this });
		var searchSalesOrganizationData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchSalesOrganizationData.on('keyup', this.onSearchSalesOrganizationDataKeyUp, this);

		var responsibleSalesHierarchyLevel_0 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Organization',
			hiddenName: 'SalesOrganizationIds1',
			name: 'SalesOrganizationIds1',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_0.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_0.on('change', this.onSalesOrganizationChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_1 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesOfficeSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_1 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesOfficeDeSelectAll, scope: this });
		var searchSalesOfficeData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchSalesOfficeData.on('keyup', this.onSearchSalesOfficeDataKeyUp, this);

		var responsibleSalesHierarchyLevel_1 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Office',
			hiddenName: 'SalesOfficeIds',
			name: 'SalesOfficeIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_1.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_1.on('change', this.onSalesOfficeChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_2 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesGroupSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_2 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesGroupDeSelectAll, scope: this });
		var searchSalesGroupData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchSalesGroupData.on('keyup', this.onSearchSalesGroupDataKeyUp, this);

		var responsibleSalesHierarchyLevel_2 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Group',
			hiddenName: 'SalesGroupIds',
			name: 'SalesGroupIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_2.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_2.on('change', this.onSalesGroupChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_3 = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesTerritorySelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_3 = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesTerritoryDeSelectAll, scope: this });
		var searchSalesTerritoryData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchSalesTerritoryData.on('keyup', this.onSearchSalesTerritoryDataKeyUp, this);

		var responsibleSalesHierarchyLevel_3 = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Sales Territory',
			hiddenName: 'SalesTerritoryIds',
			name: 'SalesTerritoryIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_3.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_3.on('change', this.onSalesTerritoryChange, this);

		var selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.Button({ text: 'Select All', cls: 'selectBtnFloatLeft selectBtn', handler: this.onSalesTeleSellingSelectAll, scope: this });
		var deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.Button({ text: 'Unselect All', cls: 'selectBtnFloatRight selectBtn', handler: this.onSalesTeleSellingDeSelectAll, scope: this });
		var searchTeleSellingSalesData = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		searchTeleSellingSalesData.on('keyup', this.onSearchTeleSellingSalesDataDataKeyUp, this);

		var responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'TeleSelling Sales Hierarchy',
			hiddenName: 'TeleSellingSalesHierarchyIds',
			name: 'TeleSellingSalesHierarchyIds',
			displayField: 'DisplayValue',
			cls: 'clsSalesHierarchy',
			store: responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore(),
			width: 180,
			height: 82
		});
		responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.on('change', this.onTeleSellingSalesChange, this);

		var responsibleSmartDeviceTypeIdStore = DA.combo.create({ baseParams: { comboType: 'SmartDeviceType', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.responsibleSmartDeviceTypeIdStore = responsibleSmartDeviceTypeIdStore;
		var responsibleSmartDeviceTypeCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Smart Device',
			hiddenName: 'SmartDeviceTypeIds',
			name: 'SmartDeviceTypeIds',
			displayField: 'DisplayValue',
			store: responsibleSmartDeviceTypeIdStore.getStore(),
			width: 200,
			height: 100
		});
		this.responsibleSmartDeviceTypeCombo = responsibleSmartDeviceTypeCombo;
		this.responsibleSalesHierarchyLevel_0 = responsibleSalesHierarchyLevel_0;
		this.responsibleSalesHierarchyLevel_1 = responsibleSalesHierarchyLevel_1;
		this.responsibleSalesHierarchyLevel_2 = responsibleSalesHierarchyLevel_2;
		this.responsibleSalesHierarchyLevel_3 = responsibleSalesHierarchyLevel_3;
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;

		this.selectAllButtonResponsibleSalesHierarchyLevel_0 = selectAllButtonResponsibleSalesHierarchyLevel_0;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_0 = deSelectAllButtonResponsibleSalesHierarchyLevel_0;
		this.searchSalesOrganizationData = searchSalesOrganizationData;


		this.selectAllButtonResponsibleSalesHierarchyLevel_1 = selectAllButtonResponsibleSalesHierarchyLevel_1;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_1 = deSelectAllButtonResponsibleSalesHierarchyLevel_1;
		this.searchSalesOfficeData = searchSalesOfficeData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_2 = selectAllButtonResponsibleSalesHierarchyLevel_2;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_2 = deSelectAllButtonResponsibleSalesHierarchyLevel_2;
		this.searchSalesGroupData = searchSalesGroupData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_3 = selectAllButtonResponsibleSalesHierarchyLevel_3;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_3 = deSelectAllButtonResponsibleSalesHierarchyLevel_3;
		this.searchSalesTerritoryData = searchSalesTerritoryData;

		this.selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds = deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds;
		this.searchTeleSellingSalesData = searchTeleSellingSalesData;

		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var allowedAlertText = "Please select an alert type to see the Alert tags.";
		var stateCombo = DA.combo.create({ fieldLabel: 'State', name: 'StateId', hiddenName: 'StateId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'State' }, controller: "Combo" });
		var salesOrderDays = [[Cooler.Enums.Days.WeekDays, '7 Days'], [Cooler.Enums.Days.MonthDays, '30 Days']];
		var alertTypeCombo = DA.combo.create({ fieldLabel: 'Type', name: 'AlertTypeId', allowBlank: false, hiddenName: 'AlertTypeId', listWidth: 220, store: Cooler.AlertDefinition.comboStores.AlertType, mode: 'local' }),
			movementDetected = new Ext.form.NumberField({ fieldLabel: 'Movement Detected(Sec)', name: 'MovementDetected', allowDecimals: false }),
			doorOpenDuration = new Ext.form.NumberField({ fieldLabel: 'Door Open Duration(Sec)', name: 'DoorOpenDuration', allowDecimals: false }),
			doorOpeningMin = new Ext.form.NumberField({ fieldLabel: 'Door Opening Less Than', name: 'DoorOpeningLessThan', allowDecimals: false }),
			doorOpeningMax = new Ext.form.NumberField({ fieldLabel: 'Door Opening Greater Than', name: 'DoorOpeningGreaterThan', allowDecimals: false }),
			minTemperature = new Ext.form.NumberField({ fieldLabel: 'Temperature Below', name: 'TemperatureBelow', allowDecimals: false }),
			maxTemperature = new Ext.form.NumberField({ fieldLabel: 'Temperature Above', name: 'TemperatureAbove', allowDecimals: false }),
			minLight = new Ext.form.NumberField({ fieldLabel: 'Min Light', name: 'MinLight', allowDecimals: false, minValue: -255, maxValue: 32767 }),
			maxLight = new Ext.form.NumberField({ fieldLabel: 'Max Light', name: 'MaxLight', allowDecimals: false, minValue: -255, maxValue: 32767 }),
			disconnectThreshold = new Ext.form.NumberField({ fieldLabel: 'Cooler Disconnect Threshold(Hrs)', name: 'DisconnectThreshold', allowDecimals: false }),
			alertAgeThreshold = new Ext.form.NumberField({ fieldLabel: 'Alert Age Threshold(Min)', name: 'AlertAgeThreshold', allowDecimals: false }),
			batteryOpenThreshold = new Ext.form.NumberField({ fieldLabel: 'Battery Open Threshold', name: 'BatteryThreshold', allowDecimals: false }),
			batteryCloseThreshold = new Ext.form.NumberField({ fieldLabel: 'Battery Close Threshold', name: 'BatteryCloseThreshold', allowDecimals: false }),
			noDataThreshold = new Ext.form.NumberField({ fieldLabel: 'No Data Threshold(Min)', name: 'NoDataThreshold', allowDecimals: false }),
			movementCountThreshold = new Ext.form.NumberField({ fieldLabel: 'Max Movement Count', name: 'MovementCountThreshold', allowDecimals: false }),
			gpsThreshold = new Ext.form.NumberField({ fieldLabel: 'GPS Displacement Threshold(Meter)', name: 'GPSThreshold', allowDecimals: false }),
			stockThreshold = new Ext.form.NumberField({ fieldLabel: 'Stock Threshold(%)', name: 'StockThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			purityThreshold = new Ext.form.NumberField({ fieldLabel: 'Purity Threshold(%)', name: 'PurityThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			planogramThreshold = new Ext.form.NumberField({ fieldLabel: 'Planogram Threshold(%)', name: 'PlanogramThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }), offlineAlertTime = new Ext.form.NumberField({ fieldLabel: 'Offline Alert Time(Min)', name: 'OfflineAlertTime', allowDecimals: false }),
			onlineAlertTimenew = new Ext.form.NumberField({ fieldLabel: 'Online Alert Time(Min)', name: 'OnlineAlertTime', allowDecimals: false }),
			locationCombo = DA.combo.create({ fieldLabel: 'Outlet', hiddenName: 'LocationId', itemId: 'locationCombo', baseParams: { comboType: 'Location' }, listWidth: 230, controller: "Combo" }),
			colasThreshold = new Ext.form.NumberField({ fieldLabel: 'Colas Threshold(%)', name: 'ColasThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			flavoursThreshold = new Ext.form.NumberField({ fieldLabel: 'Flavours Threshold(%)', name: 'FlavoursThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			combineThreshold = new Ext.form.NumberField({ fieldLabel: 'Colas + Flavours Threshold(%)', name: 'CombineThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, controller: "Combo" }),
			assetCombo = DA.combo.create({ fieldLabel: 'Asset', hiddenName: 'AssetId', listWidth: 220, baseParams: { comboType: 'Asset' }, controller: "Combo" }),
			laneThreshold = new Ext.form.NumberField({ fieldLabel: 'Lane Threshold', name: 'LaneThreshold', allowDecimals: false, minValue: 0, maxValue: 100 }),
			outletSOVITypeCombo = ExtHelper.CreateCombo({ fieldLabel: 'SOVI Type', hiddenName: 'OutletSOVITypeId', mode: 'local', store: this.comboStores.OutletSOVIType, width: 130 }),
			classificationCombo = DA.combo.create({ fieldLabel: 'Customer Tier', hiddenName: 'ClassificationId', store: this.comboStores.LocationClassification, mode: 'local' }),
			market = DA.combo.create({ fieldLabel: 'Market', hiddenName: 'MarketId', store: this.comboStores.Market, mode: 'local' }),
			locationTypeCombo = DA.combo.create({ fieldLabel: 'Trade Channel', name: 'LocationTypeId', hiddenName: 'LocationTypeId', store: this.comboStores.LocationType, mode: 'local' }),
			assetModel = DA.combo.create({ fieldLabel: 'Asset Model', hiddenName: 'AssetModelId', baseParams: { comboType: 'AssetType' }, controller: "Combo" }),
			subOpportunityTypeCombo = DA.combo.create({ fieldLabel: 'Sub Opportunity', hiddenName: 'SubOpportunityTypeId', store: this.comboStores.SubOpportunityType, mode: 'local' }),
			lightOffHours = new Ext.form.NumberField({ fieldLabel: 'Light Off Hours', name: 'LightOffHours', allowDecimals: false }),
			salesCountMin = new Ext.form.NumberField({ fieldLabel: 'Sales Count Min', name: 'SalesCountMin', allowDecimals: false }),
			salesCountMax = new Ext.form.NumberField({ fieldLabel: 'Sales Count Max', name: 'SalesCountMax', allowDecimals: false }),
			stockMin = new Ext.form.NumberField({ fieldLabel: 'Stock Min', name: 'StockMin', allowDecimals: false, minValue: 0, maxValue: 1000 }),
			salesOrderDaysCombo = DA.combo.create({ fieldLabel: 'Sales Order Days', hiddenName: 'SalesOrderDays', mode: 'local', store: salesOrderDays }),
			powerOffOnly = DA.combo.create({ fieldLabel: 'Power Off Status Only?', hiddenName: 'PowerOffOnly', store: "yesno" }),
			gpsMotionThreshold = new Ext.form.NumberField({ fieldLabel: 'GPS Motion Threshold(Min)', name: 'MotionThreshold', allowDecimals: false }),
			alertBodyArea = new Ext.form.TextArea({
				fieldLabel: 'Alert Text', name: 'AlertBody', listeners: {
					render: function (field) {
						var toolTip = new Ext.ToolTip({ id: 'alertBodyToolTipId', target: field.getEl(), html: allowedAlertText });
						this.toolTip = toolTip;
					}
				}
			},
				noTransmissionThreshold = new Ext.form.NumberField({ fieldLabel: 'No Transmission Threshold(Days)', name: 'NoTransmissionThreshold', allowDecimals: false }),
				batteryGSMThreshold = new Ext.form.NumberField({ fieldLabel: 'BatteryGSM Threshold', name: 'BatteryGSMThreshold', allowDecimals: false }), this);
				coolerMissing = new Ext.form.Checkbox({ fieldLabel: 'Is Cooler Missing?', name: 'IsCoolerMissing', dataIndex: 'IsCoolerMissing', xtype: 'checkbox' }, this);

		var forHubOnly = new Ext.form.Checkbox({ fieldLabel: 'For Hub Only?', name: 'ForHubOnly', dataIndex: 'ForHubOnly' });
		var withAccuracy = new Ext.form.Checkbox({ fieldLabel: 'Thresold With Accuracy?', name: 'WithAccuracy', dataIndex: 'WithAccuracy' });
		var salesOrgCheckedvals = [];
		var salesOfficeCheckedvals = [];
		var salesGroupCheckedvals = [];
		var salesTerritoryCheckedvals = [];
		var salesTelesellingterritoryCheckedvals = [];

		this.salesOrgCheckedvals = salesOrgCheckedvals;
		this.salesOfficeCheckedvals = salesOfficeCheckedvals;
		this.salesGroupCheckedvals = salesGroupCheckedvals;
		this.salesTerritoryCheckedvals = salesTerritoryCheckedvals;
		this.salesTelesellingTerritoryCheckedvals = salesTelesellingterritoryCheckedvals;

		this.forHubOnly = forHubOnly;
		this.withAccuracy = withAccuracy;
		this.alertTypeCombo = alertTypeCombo;
		this.movementDetected = movementDetected;
		this.doorOpenDuration = doorOpenDuration;
		this.doorOpeningMin = doorOpeningMin;
		this.doorOpeningMax = doorOpeningMax;
		this.minTemperature = minTemperature;
		this.maxTemperature = maxTemperature;
		this.minLight = minLight;
		this.maxLight = maxLight;
		this.disconnectThreshold = disconnectThreshold;
		this.alertAgeThreshold = alertAgeThreshold;
		this.batteryOpenThreshold = batteryOpenThreshold;
		this.batteryCloseThreshold = batteryCloseThreshold;
		this.noDataThreshold = noDataThreshold;
		this.movementCountThreshold = movementCountThreshold;
		this.gpsThreshold = gpsThreshold;
		this.gpsMotionThreshold = gpsMotionThreshold;
		this.stockThreshold = stockThreshold;
		this.purityThreshold = purityThreshold;
		this.planogramThreshold = planogramThreshold;
		this.offlineAlertTime = offlineAlertTime;
		this.onlineAlertTimenew = onlineAlertTimenew;
		this.alertBodyArea = alertBodyArea;
		this.colasThreshold = colasThreshold;
		this.flavoursThreshold = flavoursThreshold;
		this.clientCombo = clientCombo;
		this.assetCombo = assetCombo;
		this.laneThreshold = laneThreshold;
		this.outletSOVITypeCombo = outletSOVITypeCombo;
		this.combineThreshold = combineThreshold;
		this.assetModel = assetModel;
		this.market = market;
		this.classificationCombo = classificationCombo;
		this.locationTypeCombo = locationTypeCombo;
		this.subOpportunityTypeCombo = subOpportunityTypeCombo;
		this.lightOffHours = lightOffHours;
		this.salesCountMin = salesCountMin;
		this.salesCountMax = salesCountMax;
		this.stockMin = stockMin;
		this.salesOrderDaysCombo = salesOrderDaysCombo;
		this.powerOffOnly = powerOffOnly;
		this.batteryGSMThreshold = batteryGSMThreshold;
		this.coolerMissing = coolerMissing;
		alertTypeCombo.on('select', this.onAlertTypeComboSelect, this);
		//clientCombo.on('change', this.onClientComboChange, this);
		outletSOVITypeCombo.on('select', this.onOutletSOVITypeComboSelect, this);
		this.outletTypeCombo = outletTypeCombo;
		this.noTransmissionThreshold = noTransmissionThreshold;
		//var salesOrganizationForStore = DA.combo.create({ baseParams: { comboType: 'SalesOrganization', limit: '0', isFormAlertDefinition: true }, controller: "Combo" });
		//this.salesOrganizationForStore = salesOrganizationForStore;
		var isWeeklyCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Is Weekly?', name: 'IsWeekly', type: 'bool' });
		this.isWeeklyCheckbox = isWeeklyCheckbox;

		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: String.format('{0}?action={1}', EH.BuildUrl('SalesHierarchyTreeView'), 'getSalesHierarchy'),
			baseAttrs: { checked: false }

		});
		this.startDateField = new Ext.form.DateField({ fieldLabel: 'Start Date', name: 'StartDate', width: 180 });
		var col1 = {
			columnWidth: .4,
			labelWidth: 140,
			defaults: {
				width: 180
			},
			items: [
				{ fieldLabel: 'Name', name: 'Name', xtype: 'textfield', maxLength: 250 },
				alertTypeCombo,
				alertBodyArea,
				DA.combo.create({ fieldLabel: 'Priority', name: 'PriorityId', allowBlank: false, hiddenName: 'PriorityId', listWidth: 220, store: this.comboStores.AlertPriority, mode: 'local' }),
				DA.combo.create({ fieldLabel: 'Is Active', hiddenName: 'IsActive', store: "yesno" }),
				DA.combo.create({ fieldLabel: 'Daily Alert', hiddenName: 'DailyAlert', store: "yesno" }),
				this.startDateField,
				doorOpenDuration,
				doorOpeningMin,
				doorOpeningMax,
				minTemperature,
				maxTemperature,
				minLight,
				maxLight,
				disconnectThreshold,
				movementDetected,
				batteryOpenThreshold,
				batteryCloseThreshold,
				noDataThreshold,
				movementCountThreshold,
				gpsThreshold,
				gpsMotionThreshold,
				offlineAlertTime,
				onlineAlertTimenew,
				stockThreshold,
				purityThreshold,
				planogramThreshold,
				outletSOVITypeCombo,
				colasThreshold,
				flavoursThreshold,
				combineThreshold,
				laneThreshold,
				salesOrderDaysCombo,
				salesCountMin,
				salesCountMax,
				stockMin,
				subOpportunityTypeCombo,
				powerOffOnly,
				forHubOnly,
				withAccuracy,
				alertAgeThreshold,
				noTransmissionThreshold,
				batteryGSMThreshold,
				gpsMotionThreshold,
				coolerMissing,
				{ fieldLabel: 'Is System Alert?', name: 'IsSystemAlert', dataIndex: 'IsSystemAlert', xtype: 'checkbox' },
				isWeeklyCheckbox,
				{ fieldLabel: 'Is Email Sent?', name: 'IsMailSent', dataIndex: 'IsMailSent', xtype: 'checkbox' },
				responsibleSmartDeviceTypeCombo

			]
		};
		var salesHierarchyIds = new Ext.form.Hidden({ name: 'SalesOrganizationIds' });
		this.salesHierarchyIds = salesHierarchyIds

		var col2 = {
			columnWidth: .3,
			labelWidth: 100,
			defaults: {
				width: 180
			},
			items: [
				clientCombo,
				assetModel,
				assetCombo,
				locationCombo,
				outletTypeCombo,
				classificationCombo,
				//market,
				locationTypeCombo,

				selectAllButtonResponsibleSalesHierarchyLevel_0,
				deSelectAllButtonResponsibleSalesHierarchyLevel_0,
				searchSalesOrganizationData,
				responsibleSalesHierarchyLevel_0,

				selectAllButtonResponsibleSalesHierarchyLevel_1,
				deSelectAllButtonResponsibleSalesHierarchyLevel_1,
				searchSalesOfficeData,
				responsibleSalesHierarchyLevel_1
			]
		};
		var col3 = {
			columnWidth: .3,
			items: [
				selectAllButtonResponsibleSalesHierarchyLevel_2,
				deSelectAllButtonResponsibleSalesHierarchyLevel_2,
				searchSalesGroupData,
				responsibleSalesHierarchyLevel_2,

				selectAllButtonResponsibleSalesHierarchyLevel_3,
				deSelectAllButtonResponsibleSalesHierarchyLevel_3,
				searchSalesTerritoryData,
				responsibleSalesHierarchyLevel_3,

				selectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds,
				deSelectAllButtonResponsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds,
				searchTeleSellingSalesData,
				responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds,
				salesHierarchyIds
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', defaultType: 'textfield', border: false },
			height: 650,
			border: false,
			autoScroll: true,
			items: [col1, col2, col3]
		});
		return config;
	},

	onSalesOrganizationSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_0 = this.responsibleforSalesHierarchyLevel_0.getStore();
		var salesOrganizationHierarchyIds = [];
		var len = storeLevel_0.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_0.getAt(i).data.LookupId;
			salesOrganizationHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_0.setValue('' + salesOrganizationHierarchyIds + '');
		this.salesOrgCheckedvals = [];
		this.salesOrgCheckedvals.push(salesOrganizationHierarchyIds.join(','));

		var storeLevel_1 = this.responsibleforSalesHierarchyLevel_1.getStore();
		var salesOfficeHierarchyIds = [];
		var len = storeLevel_1.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_1.getAt(i).data.LookupId;
			salesOfficeHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_1.setValue('' + salesOfficeHierarchyIds + '');
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},
	onSalesOrganizationDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_0.setValue('');
		this.responsibleSalesHierarchyLevel_1.setValue('');
		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesOrgCheckedvals = [];
		this.salesOfficeCheckedvals = [];
		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals = [];
	},
	onSalesOfficeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_1 = this.responsibleforSalesHierarchyLevel_1.getStore();
		var salesOfficeHierarchyIds = [];
		var len = storeLevel_1.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_1.getAt(i).data.LookupId;
			salesOfficeHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_1.setValue('' + salesOfficeHierarchyIds + '');
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},
	onSalesOfficeDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_1.setValue('');
		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesOfficeCheckedvals = [];
		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
	},
	onSalesGroupSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_2 = this.responsibleforSalesHierarchyLevel_2.getStore();
		var salesGroupHierarchyIds = [];
		var len = storeLevel_2.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_2.getAt(i).data.LookupId;
			salesGroupHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_2.setValue('' + salesGroupHierarchyIds + '');
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},
	onSalesGroupDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		this.responsibleSalesHierarchyLevel_2.setValue('');
		this.responsibleSalesHierarchyLevel_3.setValue('');

		this.salesGroupCheckedvals = [];
		this.salesTerritoryCheckedvals = [];
	},
	onSalesTerritorySelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();

		var storeLevel_3 = this.responsibleforSalesHierarchyLevel_3.getStore();
		var salesTerritoryHierarchyIds = [];
		var len = storeLevel_3.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = storeLevel_3.getAt(i).data.LookupId;
			salesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_3.setValue('' + salesTerritoryHierarchyIds + '');
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
	},
	onSalesTerritoryDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		this.responsibleSalesHierarchyLevel_3.setValue('');
		this.salesTerritoryCheckedvals = [];
	},
	onSalesTeleSellingSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		var store = this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore();
		var teleSellingSalesTerritoryHierarchyIds = [];
		var len = store.totalLength;
		for (var i = 0; i < len; i++) {
			var lookupIds = store.getAt(i).data.LookupId;
			teleSellingSalesTerritoryHierarchyIds.push(lookupIds);
		}
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + teleSellingSalesTerritoryHierarchyIds + '');
		this.salesTelesellingTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals.push(teleSellingSalesTerritoryHierarchyIds.join(','));
	},
	onSalesTeleSellingDeSelectAll: function (data) {
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
		this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');

		this.salesTelesellingTerritoryCheckedvals = [];
	},

	onSearchSalesOrganizationDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesOrgCheckedvals.join(',');
		var value = field.getValue();
		var store = this.responsibleforSalesHierarchyLevel_0.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
		}

		var orgFilterSelectvalue = this.responsibleSalesHierarchyLevel_0.getValue();

		if (value == "" || orgFilterSelectvalue == "") {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}
		//For Sales Office
		if (orgFilterSelectvalue != '') {
			var salesOfficeFilterData = this.responsibleforSalesHierarchyLevel_1.getStore();
			var salesOfficeStore = salesOfficeFilterData;
			var selectedIds = orgFilterSelectvalue.split(',');

			var arr = selectedIds;
			var temp = arr.filter(function (x) {
				return (x !== (undefined || null || ''));
			});
			arr = temp;
			lookupIds = temp;
			if (lookupIds[0] != '' && lookupIds[0] != null) {
				salesOfficeStore.filterBy(function (record, id) {
					var len = lookupIds.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsVal = [];
				var len = salesOfficeStore.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = salesOfficeStore.getAt(j).data.LookupId;
					salesHierarchyIdsVal.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			}
			//For Sales Group
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var storeGroup = salesGroupFilterData;
			var selectedHierarchyId = salesHierarchyIdsVal;
			var selectedHierarchyItems = selectedHierarchyId;
			lookupIds_2 = selectedHierarchyItems;
			if (lookupIds_2 != '' && lookupIds_2 != null && lookupIds_2 != undefined) {
				storeGroup.filterBy(function (record, id) {
					var len = lookupIds_2.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds_2[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_2 = [];
				var length = storeGroup.data.length;
				for (var j = 0; j < length; j++) {
					var salesHierarchyId = storeGroup.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_2.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			}
			//For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var storeTerritory = salesTerritoryFilterData;
			var selectedstoreTerritoryId = salesHierarchyIdsLevel_2;
			var selectedTerritoryItems = selectedstoreTerritoryId;
			lookupIds_3 = selectedTerritoryItems;
			if (lookupIds_3 != '' && lookupIds_3 != null) {
				storeTerritory.filterBy(function (record, id) {
					var lookupIdsLen = lookupIds_3.length;
					for (var i = 0; i < lookupIdsLen; i++) {
						if (record.get('CustomValue') == lookupIds_3[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_3 = [];
				var len = storeTerritory.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = storeTerritory.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_3.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},
	onSearchSalesOfficeDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesOfficeCheckedvals.join(',');
		var value = field.getValue();
		var store = this.responsibleforSalesHierarchyLevel_1.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
		}
		var officeFilterSelectvalue = this.responsibleSalesHierarchyLevel_1.getValue();
		if (value == "" || officeFilterSelectvalue == "") {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}
		//For Sales Office
		if (officeFilterSelectvalue != "") {
			//For Sales Group
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var storeGroup = salesGroupFilterData;
			var selectedHierarchyId = officeFilterSelectvalue.split(',');
			var selectedHierarchyItems = selectedHierarchyId;

			selectedHierarchyItems = selectedHierarchyItems.filter(function (x) {
				return (x !== (undefined || null || ''));
			});

			lookupIds_2 = selectedHierarchyItems;
			if (lookupIds_2 != '' && lookupIds_2 != null && lookupIds_2 != undefined) {
				storeGroup.filterBy(function (record, id) {
					var len = lookupIds_2.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds_2[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_2 = [];
				var length = storeGroup.data.length;
				for (var j = 0; j < length; j++) {
					var salesHierarchyId = storeGroup.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_2.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			}
			//For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var storeTerritory = salesTerritoryFilterData;
			var selectedstoreTerritoryId = salesHierarchyIdsLevel_2;
			var selectedTerritoryItems = selectedstoreTerritoryId;
			lookupIds_3 = selectedTerritoryItems;
			if (lookupIds_3 != '' && lookupIds_3 != null) {
				storeTerritory.filterBy(function (record, id) {
					var lookupIdsLen = lookupIds_3.length;
					for (var i = 0; i < lookupIdsLen; i++) {
						if (record.get('CustomValue') == lookupIds_3[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsLevel_3 = [];
				var len = storeTerritory.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = storeTerritory.getAt(j).data.LookupId;
					salesHierarchyIdsLevel_3.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},
	onSearchSalesGroupDataKeyUp: function (field) {
		var salesHierarchy_Ids = this.salesGroupCheckedvals;
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_2.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		var groupFilterSelectvalue = this.responsibleSalesHierarchyLevel_2.getValue();
		if (value == "" || groupFilterSelectvalue == "") {
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			return;
		}

		if (groupFilterSelectvalue != "") {
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var store = salesTerritoryFilterData;
			var selectedId = groupFilterSelectvalue.split(',');
			var arr = selectedId;
			var temp = arr.filter(function (x) {
				return (x !== (undefined || null || ''));
			});
			arr = temp;
			lookupIds = temp;
			if (lookupIds[0] != '' && lookupIds[0] != null) {
				store.filterBy(function (record, id) {
					var len = lookupIds.length;
					for (var i = 0; i < len; i++) {
						if (record.get('CustomValue') == lookupIds[i].toString()) {
							return true;
						}
						if (record.get('LookupId') == lookupIds[i].toString()) {
							return true;
						}
					}
				});
				var salesHierarchyIdsVal = [];
				var len = store.data.length;
				for (var j = 0; j < len; j++) {
					var salesHierarchyId = store.getAt(j).data.LookupId;
					salesHierarchyIdsVal.push(salesHierarchyId);
				}
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
		}
	},
	onSearchSalesTerritoryDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_3.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
		if (value == "") {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
	},
	onSearchTeleSellingSalesDataDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
		}
		if (value == "") {
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
		}
	},

	onSalesOrganizationChange: function (combo, newValue, oldValue) {
		isSalesOrganizationChange = true;
		isOldValuehigher = false;
		var tempSOrg = this.salesOrgCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOrgCheckedvals = [];
		this.salesOrgCheckedvals.push(tempSOrg.join(','));

		var tempSO = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(tempSO.join(','));

		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesOrgCheckedvals.push(newValue);
				var salesOrgIds = $.unique((this.salesOrgCheckedvals.join(',')).split(','));
				this.salesOrgCheckedvals = [];
				this.salesOrgCheckedvals.push(salesOrgIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesOrgSelectedvals = this.salesOrgCheckedvals.join(',').split(',');
				for (var k = 0; k < salesOrgSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesOrgSelectedvals[k] == oldValueArr[l]) {
							salesOrgSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesOrgSelectedvals.length > 0) {

					this.salesOrgCheckedvals = [];
					this.salesOrgCheckedvals.push(salesOrgSelectedvals.join(','));
					//this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
				}
				removeuncheckedValueFromSalesHierarchy(0, oldValueArr.join(','));
			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesOrgCheckedvals.push(newValue);
			var salesOrgIds = $.unique((this.salesOrgCheckedvals.join(',')).split(','));
			this.salesOrgCheckedvals = [];
			this.salesOrgCheckedvals.push(salesOrgIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesOrgSelectedVals = this.salesOrgCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesOrgSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesOrgSelectedVals[i] == oldSelectedVals[j]) {
						salesOrgSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesOrgSelectedVals.length > 0) {
				this.salesOrgCheckedvals = [];
				this.salesOrgCheckedvals.push(salesOrgSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesOrgCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchy(0, oldVal.join(','));
			}
			else {
				this.salesOrgCheckedvals = [];
				removeuncheckedValueFromSalesHierarchy(0, oldVal.join(','));
				//this.salesOfficeCheckedvals = [];
				//this.salesGroupCheckedvals = [];
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];	
			}

		}

		var store = '';
		if (this.salesOrgCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesOrgCheckedvals.length > 0 && isOldValuehigher == false) {
			var salesOfficeFilterData = this.responsibleforSalesHierarchyLevel_1.getStore();
			store = salesOfficeFilterData;
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;
			store.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});

			// For Sales Group
			var salesOfficeHierarchyIds = [];
			var len = store.data.length;
			for (var j = 0; j < len; j++) {
				var salesOfficeHierarchyId = store.getAt(j).data.LookupId;
				salesOfficeHierarchyIds.push(salesOfficeHierarchyId);
			}
			if (salesOfficeHierarchyIds.length > 0) {
				this.salesOfficeCheckedvals.push(salesOfficeHierarchyIds.join(','));
				var temp = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(temp.join(','));
			}
			var officeSelectedHierarchy = $.unique(this.salesOfficeCheckedvals.join(',').split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(officeSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');

			var storeSalesGroupFilterData = '';
			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			storeSalesGroupFilterData = salesGroupFilterData;
			var selectedItems = salesOfficeHierarchyIds;
			lookupIds = selectedItems;
			storeSalesGroupFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesGroupHierarchyIds = [];
			for (var k = 0; k < storeSalesGroupFilterData.data.length; k++) {
				var salesGroupHierarchyId = storeSalesGroupFilterData.getAt(k).data.LookupId;
				salesGroupHierarchyIds.push(salesGroupHierarchyId);
			}
			if (salesGroupHierarchyIds.length > 0) {
				this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));
				var temp = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(temp.join(','));
			}
			var groupSelectedHierarchy = $.unique(this.salesGroupCheckedvals.join(',').split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');

			// For Sales Territory
			var storeSalesTerritoryFilterData = '';
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			storeSalesTerritoryFilterData = salesTerritoryFilterData;
			var selectedItems = salesGroupHierarchyIds;
			lookupIds = selectedItems;

			storeSalesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < storeSalesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = storeSalesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');

		}
		else {
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('');
			// For Sales Office
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_1.setValue('');
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},
	onSalesOfficeChange: function (combo, newValue, oldValue) {

		isSalesOfficeChange = true;
		isOldValuehigher = false;
		var tempSO = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesOfficeCheckedvals = [];
		this.salesOfficeCheckedvals.push(tempSO.join(','));

		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesOfficeCheckedvals.push(newValue);
				var salesOfficeIds = $.unique((this.salesOfficeCheckedvals.join(',')).split(','));
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				var oldVal = oldValueArr;
				var newVal = newValueArr;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesOfficeSelectedvals = this.salesOfficeCheckedvals.join(',').split(',');
				for (var k = 0; k < salesOfficeSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesOfficeSelectedvals[k] == oldValueArr[l]) {
							salesOfficeSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeSelectedvals.join(','))
				removeuncheckedValueFromSalesHierarchy(1, oldValueArr.join(','));
				//if (salesOfficeSelectedvals.length > 0) {
				//	this.salesOfficeCheckedvals = [];
				//	this.salesOfficeCheckedvals.push(salesOfficeSelectedvals.join(','));
				//}
			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesOfficeCheckedvals.push(newValue);
			var salesOfficeIds = $.unique((this.salesOfficeCheckedvals.join(',')).split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(salesOfficeIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesOfficeSelectedVals = this.salesOfficeCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesOfficeSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesOfficeSelectedVals[i] == oldSelectedVals[j]) {
						salesOfficeSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesOfficeSelectedVals.length > 0) {
				this.salesOfficeCheckedvals = [];
				this.salesOfficeCheckedvals.push(salesOfficeSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesOfficeCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchy(1, oldVal.join(','));
			}
			else {
				this.salesOfficeCheckedvals = [];
				removeuncheckedValueFromSalesHierarchy(1, oldVal.join(','));
				//this.salesGroupCheckedvals = [];
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];

			}
		}

		var store = '';
		if (this.salesOfficeCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesOfficeCheckedvals.length > 0 && isOldValuehigher == false) {

			var salesGroupFilterData = this.responsibleforSalesHierarchyLevel_2.getStore();
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;
			salesGroupFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesGroupHierarchyIds = [];
			for (var k = 0; k < salesGroupFilterData.data.length; k++) {
				var salesGroupHierarchyId = salesGroupFilterData.getAt(k).data.LookupId;
				salesGroupHierarchyIds.push(salesGroupHierarchyId);
			}
			if (salesGroupHierarchyIds.length > 0) {
				this.salesGroupCheckedvals.push(salesGroupHierarchyIds.join(','));
				var temp = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(temp.join(','));
			}

			var groupSelectedHierarchy = $.unique(this.salesGroupCheckedvals.join(',').split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesGroupCheckedvals.join(',') + '');

			// For Sales Territory
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			var selectedItems = salesGroupHierarchyIds;
			lookupIds = selectedItems;

			salesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < salesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = salesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			// For Sales Office
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('');
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},
	onSalesGroupChange: function (combo, newValue, oldValue) {

		isSalesGroupChange = true;
		isOldValuehigher = false;
		var tempSG = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesGroupCheckedvals = [];
		this.salesGroupCheckedvals.push(tempSG.join(','));

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		var lookupIds = [];
		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				isOldValuehigher = false;
				this.salesGroupCheckedvals.push(newValue);
				var salesGroupeIds = $.unique((this.salesGroupCheckedvals.join(',')).split(','));
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(salesGroupeIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				isOldValuehigher = true;
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesGroupSelectedvals = this.salesGroupCheckedvals.join(',').split(',');
				for (var k = 0; k < salesGroupSelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesGroupSelectedvals[k] == oldValueArr[l]) {
							salesGroupSelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesGroupSelectedvals.length > 0) {
					this.salesGroupCheckedvals = [];
					this.salesGroupCheckedvals.push(salesGroupSelectedvals.join(','));
					removeuncheckedValueFromSalesHierarchy(2, oldValueArr.join(','));
				}
				else {
					this.salesGroupCheckedvals = [];
					this.salesTerritoryCheckedvals = [];
				}

			}
		}
		else if (newValue != '' && oldValue == '') {
			isOldValuehigher = false;
			this.salesGroupCheckedvals.push(newValue);
			var salesGroupIds = $.unique((this.salesGroupCheckedvals.join(',')).split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(salesGroupIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			isOldValuehigher = true;
			var salesGroupSelectedVals = this.salesGroupCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			var oldVal = [];
			for (var i = 0; i < salesGroupSelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesGroupSelectedVals[i] == oldSelectedVals[j]) {
						salesGroupSelectedVals.splice(i, 1);
						oldVal.push(oldSelectedVals[j]);
						break;
					}
				}
			}
			if (salesGroupSelectedVals.length > 0) {
				this.salesGroupCheckedvals = [];
				this.salesGroupCheckedvals.push(salesGroupSelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesGroupCheckedvals.join(',') + '');
				removeuncheckedValueFromSalesHierarchy(2, oldVal.join(','));
			}
			else {
				this.salesGroupCheckedvals = [];
				removeuncheckedValueFromSalesHierarchy(2, oldVal.join(','));
				//this.salesTerritoryCheckedvals = [];
				//this.salesTelesellingTerritoryCheckedvals = [];

			}
		}

		var store = '';
		if (this.salesGroupCheckedvals.length > 0 && isOldValuehigher == true) {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
		}
		else if (this.salesGroupCheckedvals.length > 0 && isOldValuehigher == false) {
			// For Sales Territory
			var storeSalesTerritoryFilterData = '';
			var salesTerritoryFilterData = this.responsibleforSalesHierarchyLevel_3.getStore();
			storeSalesTerritoryFilterData = salesTerritoryFilterData;
			var selectedItems = newValue.split(',');
			lookupIds = selectedItems;

			storeSalesTerritoryFilterData.filterBy(function (record, id) {
				var len = lookupIds.length;
				for (var i = 0; i < len; i++) {
					if (record.get('CustomValue') == lookupIds[i].toString()) {
						return true;
					}
				}
			});
			var salesTerritoryHierarchyIds = [];
			for (var l = 0; l < storeSalesTerritoryFilterData.data.length; l++) {
				var salesTerritoryHierarchyId = storeSalesTerritoryFilterData.getAt(l).data.LookupId;
				salesTerritoryHierarchyIds.push(salesTerritoryHierarchyId);
			}
			if (salesTerritoryHierarchyIds.length > 0) {
				this.salesTerritoryCheckedvals.push(salesTerritoryHierarchyIds.join(','));
				var temp = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
					return (x !== (undefined || null || ''));
				});
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(temp.join(','));
			}
			var territorySelectedHierarchy = $.unique(this.salesTerritoryCheckedvals.join(',').split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');

		}
		else {
			// For Sales Group
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_2.setValue('');
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			//this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},
	onSalesTerritoryChange: function (combo, newValue, oldValue) {

		isSalesTerritoryChange = true;

		var tempST = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});
		this.salesTerritoryCheckedvals = [];
		this.salesTerritoryCheckedvals.push(tempST.join(','));

		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				this.salesTerritoryCheckedvals.push(newValue);
				var salesTerritoryIds = $.unique((this.salesTerritoryCheckedvals.join(',')).split(','));
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(salesTerritoryIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salesTerritorySelectedvals = this.salesTerritoryCheckedvals.join(',').split(',');
				for (var k = 0; k < salesTerritorySelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salesTerritorySelectedvals[k] == oldValueArr[l]) {
							salesTerritorySelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salesTerritorySelectedvals.length > 0) {
					this.salesTerritoryCheckedvals = [];
					this.salesTerritoryCheckedvals.push(salesTerritorySelectedvals.join(','));
					this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
				}
				else {

					this.salesTerritoryCheckedvals = [];
				}
			}
		}
		else if (newValue != '' && oldValue == '') {
			this.salesTerritoryCheckedvals.push(newValue);
			var salesTerritoryIds = $.unique((this.salesTerritoryCheckedvals.join(',')).split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(salesTerritoryIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			var salesTerritorySelectedVals = this.salesTerritoryCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			for (var i = 0; i < salesTerritorySelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesTerritorySelectedVals[i] == oldSelectedVals[j]) {
						salesTerritorySelectedVals.splice(i, 1);
						break;
					}
				}
			}
			if (salesTerritorySelectedVals.length > 0) {
				this.salesTerritoryCheckedvals = [];
				this.salesTerritoryCheckedvals.push(salesTerritorySelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesTerritoryCheckedvals.join(',') + '');
			}
			else {
				this.salesTerritoryCheckedvals = [];
			}
		}

		if (this.salesTerritoryCheckedvals.length == 0) {
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('');
		}

	},
	onTeleSellingSalesChange: function (combo, newValue, oldValue) {
		isTeleSellingChange = true;
		var tempTST = this.salesTelesellingTerritoryCheckedvals.join(',').split(',').filter(function (x) {
			return (x !== (undefined || null || ''));
		});

		this.salesTelesellingTerritoryCheckedvals = [];
		this.salesTelesellingTerritoryCheckedvals.push(tempTST.join(','));

		if (newValue != '' && oldValue != '') {
			var newValueArr = newValue.split(',');
			var oldValueArr = oldValue.split(',');
			if (newValueArr.length > oldValueArr.length) {
				this.salesTelesellingTerritoryCheckedvals.push(newValue);
				var salessalesTelesellingTerritoryIds = $.unique((this.salesTelesellingTerritoryCheckedvals.join(',')).split(','));
				this.salesTelesellingTerritoryCheckedvals = [];
				this.salesTelesellingTerritoryCheckedvals.push(salessalesTelesellingTerritoryIds.join(','));
			}
			else if (newValueArr.length < oldValueArr.length) {
				for (var i = 0; i < oldValueArr.length; i++) {
					for (var j = 0; j < newValueArr.length; j++) {
						if (oldValueArr[i] == newValueArr[j]) {
							oldValueArr.splice(i, 1);
							newValueArr.splice(j, 1);
							i = 0;
							j = 0;
							break;
						}
					}
				}
				var salessalessalesTelesellingTerritorySelectedvals = this.salesTelesellingTerritoryCheckedvals.join(',').split(',');
				for (var k = 0; k < salessalessalesTelesellingTerritorySelectedvals.length; k++) {
					for (var l = 0; l < oldValueArr.length; l++) {
						if (salessalessalesTelesellingTerritorySelectedvals[k] == oldValueArr[l]) {
							salessalessalesTelesellingTerritorySelectedvals.splice(k, 1);
							break;
						}
					}
				}
				if (salessalessalesTelesellingTerritorySelectedvals.length > 0) {
					this.salesTelesellingTerritoryCheckedvals = [];
					this.salesTelesellingTerritoryCheckedvals.push(salessalessalesTelesellingTerritorySelectedvals.join(','));
					this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
				}
				else {
					this.salesTerritoryCheckedvals = [];
				}
			}
		}
		else if (newValue != '' && oldValue == '') {
			this.salesTelesellingTerritoryCheckedvals.push(newValue);
			var salesTelesellingTerritoryIds = $.unique((this.salesTelesellingTerritoryCheckedvals.join(',')).split(','));
			this.salesTelesellingTerritoryCheckedvals = [];
			this.salesTelesellingTerritoryCheckedvals.push(salesTelesellingTerritoryIds.join(','));
		}
		else if (newValue == '' && oldValue != '') {
			var salesTelesellingTerritorySelectedVals = this.salesTelesellingTerritoryCheckedvals.join(',').split(',');
			var oldSelectedVals = oldValue.split(',');
			for (var i = 0; i < salesTelesellingTerritorySelectedVals.length; i++) {
				for (var j = 0; j < oldSelectedVals.length; j++) {
					if (salesTelesellingTerritorySelectedVals[i] == oldSelectedVals[j]) {
						salesTelesellingTerritorySelectedVals.splice(i, 1);
						break;
					}
				}
			}
			if (salesTelesellingTerritorySelectedVals.length > 0) {
				this.salesTelesellingTerritoryCheckedvals = [];
				this.salesTelesellingTerritoryCheckedvals.push(salesTelesellingTerritorySelectedVals.join(','));
				this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesTelesellingTerritoryCheckedvals.join(',') + '');
			}
			else {
				this.salesTelesellingTerritoryCheckedvals = [];
			}
		}

		if (this.salesTelesellingTerritoryCheckedvals.length == 0) {
			// For Sales Territory
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
		}

	},

	loadSalesOrganization: function (a) {
		if (!this.mask) {
			var mask = new Ext.LoadMask(this.formPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		this.responsibleforSalesHierarchyLevel_1.getStore().load();
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_0.setValue('');
			this.responsibleSalesHierarchyLevel_0.setValue('' + this.salesHierarchyValues + '');
			var salesOrgIds = $.unique((this.responsibleSalesHierarchyLevel_0.getValue()).split(','));
			this.salesOrgCheckedvals = [];
			this.salesOrgCheckedvals.push(salesOrgIds.join(','));
			//this.salesOrgCheckedvals.push(this.responsibleSalesHierarchyLevel_0.getValue());	
		}
		else {
			this.salesOrgCheckedvals = [];
			this.responsibleforSalesHierarchyLevel_0.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_0.setValue('');
		}
		var tags = DA.Security.info.Tags;
		if (this.activeRecordId == 0 && (tags.LimitCountry == "1" || tags.LimitLocation == "1")) {
			this.onSalesOrganizationSelectAll(); // Selecting all organization if LimitCountry or LimitLocation set to 1
		}
	},
	loadSalesOffice: function () {

		this.responsibleforSalesHierarchyLevel_2.getStore().load();
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_1.setValue('');
			this.responsibleSalesHierarchyLevel_1.setValue('' + this.salesHierarchyValues + '');
			var officeSelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_1.getValue().split(','));
			this.salesOfficeCheckedvals = [];
			this.salesOfficeCheckedvals.push(officeSelectedHierarchy.join(','));
			//this.salesOfficeCheckedvals.push(this.responsibleSalesHierarchyLevel_1.getValue());
		}
		else {
			this.responsibleforSalesHierarchyLevel_1.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_1.setValue('');
		}
	},
	loadSalesGroup: function () {

		this.responsibleforSalesHierarchyLevel_3.getStore().load();
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_2.setValue('');
			this.responsibleSalesHierarchyLevel_2.setValue('' + this.salesHierarchyValues + '');
			var groupSelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_2.getValue().split(','));
			this.salesGroupCheckedvals = [];
			this.salesGroupCheckedvals.push(groupSelectedHierarchy.join(','));
			//this.salesGroupCheckedvals.push(this.responsibleSalesHierarchyLevel_2.getValue());	
		}
		else {
			this.responsibleforSalesHierarchyLevel_2.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_2.setValue('');
		}
	},
	loadSalesTerritory: function () {
		this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().load();
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_3.setValue('');
			this.responsibleSalesHierarchyLevel_3.setValue('' + this.salesHierarchyValues + '');
			var territorySelectedHierarchy = $.unique(this.responsibleSalesHierarchyLevel_3.getValue().split(','));
			this.salesTerritoryCheckedvals = [];
			this.salesTerritoryCheckedvals.push(territorySelectedHierarchy.join(','));
			//this.salesTerritoryCheckedvals.push(this.responsibleSalesHierarchyLevel_3.getValue());
		}
		else {
			this.responsibleforSalesHierarchyLevel_3.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_3.setValue('');
		}
	},
	loadTeleSellingSalesHierarchy: function () {
		if (this.salesHierarchyValues != undefined && this.salesHierarchyValues != '') {
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('' + this.salesHierarchyValues + '');
			var salessalesTelesellingTerritoryIds = $.unique((this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getValue()).split(','));
			this.salesTelesellingTerritoryCheckedvals = [];
			this.salesTelesellingTerritoryCheckedvals.push(salessalesTelesellingTerritoryIds.join(','));
		}
		else {
			this.responsibleforSalesHierarchyLevel_TeleSellingSalesHierarchyIds.getStore().clearFilter();
			this.responsibleSalesHierarchyLevel_TeleSellingSalesHierarchyIds.setValue('');
		}
		this.mask.hide();
	},

	validateGridAlert: function (grid, options) {
		var ds = grid.getStore();
		var cm = grid.getColumnModel();
		var columnCount = cm.getColumnCount();
		var rowCount = ds.getCount();
		var isValid = true;
		var errorMessage = '';
		var startEditing = false;
		var emptyRecords = [];
		var emailIndex = "Email";
		var textIndex = "Text";
		var roleIndex = "Role";
		var contactTypeIndex = "Contact Type";
		for (var row = 0; row < rowCount; row++) {
			var record = ds.getAt(row);
			if (record.dirty || (record.phantom !== undefined && !record.phantom)) {
				for (var col = 0; col < columnCount; col++) {
					var columnHeader = cm.getColumnHeader(col);
					if (cm.isCellEditable(col, row)) {
						var editor = cm.getCellEditor(col, row);
						var field = editor.field;
						var isAllowBlank = true;
						var value = record.data[cm.getDataIndex(col)];
						var alertRecipientColumn = record.data[cm.getDataIndex(0)]
						if (alertRecipientColumn == Cooler.Enums.AlertRecipientType.Email && columnHeader == emailIndex) {
							isAllowBlank = false;
						} else if (alertRecipientColumn == Cooler.Enums.AlertRecipientType.Text && columnHeader == textIndex) {
							isAllowBlank = false;
						}
						else if (alertRecipientColumn == Cooler.Enums.AlertRecipientType.Role && columnHeader == roleIndex) {
							var clientId = Cooler.AlertDefinition.clientCombo.getValue();
							if (clientId) {
								isAllowBlank = false;
							}
						}
						else if (columnHeader == contactTypeIndex && alertRecipientColumn != Cooler.Enums.AlertRecipientType.Role && alertRecipientColumn != Cooler.Enums.AlertRecipientType.Text && alertRecipientColumn != Cooler.Enums.AlertRecipientType.Email) {
							isAllowBlank = false;
						}
						else {
							isAllowBlank = true;
						}
						if (field.validateValue && !isAllowBlank) {
							if (value === null || value.length < 1 || value === this.emptyText) {
								isValid = false;
							}
							if (!isValid) {
								if (typeof (grid.getSelectionModel().select) == 'function') {
									grid.getSelectionModel().select(row, col);
								} else {
									grid.getSelectionModel().selectRow(row);
								}
								var cell = grid.getView().getCell(row, col);
								ExtHelper.ShowTip({ title: 'Error', text: cm.getColumnHeader(col) + " is invalid", showBy: cell });
								errorMessage = cm.getColumnHeader(col) + " is invalid";
								if (startEditing) {
									grid.startEditing(row, col);
								}
								break;
							}
						}
					}
				}
			} else if (record.data.Id == 0 || record.data[grid.daScope.keyColumn] == 0) {
				emptyRecords.push(record);
			}
			if (!isValid) {
				break;
			}
		}
		return { IsValid: isValid, Message: errorMessage };
	},

	CreateFormPanel: function (config) {
		var alertDefinitionShelfColumn = Cooler.AlertDefinitionShelfColumn.createGrid({ title: 'Shelf-wise Out Of Stock', height: 300, region: 'center', editable: true, allowPaging: false, root: 'shelfColumn', disabled: true }, true);
		var alertDefinitionProductStock = Cooler.AlertDefinitionProductStock.createGrid({ title: 'Product-wise Stock', height: 300, region: 'center', editable: true, allowPaging: false, root: 'productStock', disabled: true }, true);
		var alertDefinitionDoorPercentageChange = Cooler.AlertDefinitionDoorPercentageChange.createGrid({ title: 'Door Percentage', height: 300, region: 'center', editable: true, allowPaging: false, root: 'doorPercentage', disabled: true }, true);
		var alertDefinitionProduct = Cooler.AlertDefinitionProduct.createGrid({ title: 'Products', height: 300, region: 'center', editable: true, allowPaging: false, root: 'product', disabled: true }, true);
		this.alertDefinitionShelfColumn = alertDefinitionShelfColumn;
		this.alertDefinitionProductStock = alertDefinitionProductStock;
		this.alertDefinitionProduct = alertDefinitionProduct;
		this.alertDefinitionDoorPercentageChange = alertDefinitionDoorPercentageChange;
		var alertRecipient = Cooler.AlertRecipient.createGrid({ title: 'Alert Recipient', height: 300, region: 'center', editable: true, allowPaging: false, plugins: new Ext.grid.CheckColumn(), root: 'recipients' }, true);
		this.alertRecipient = alertRecipient;
		var alertException = Cooler.AlertException.createGrid({
			title: 'Alert Exception', border: true, height: 120, root: 'exceptions',
			allowPaging: false, editable: true,
			plugins: [new Ext.ux.ComboLoader(), new Ext.grid.CheckColumn()]
		}, true);
		var grid = [alertRecipient, alertException, alertDefinitionProductStock, alertDefinitionShelfColumn, alertDefinitionDoorPercentageChange, alertDefinitionProduct];
		this.childGrids = grid;
		this.childModules = [Cooler.AlertRecipient, Cooler.AlertException, Cooler.AlertDefinitionProductStock, Cooler.AlertDefinitionShelfColumn, Cooler.AlertDefinitionDoorPercentageChange, Cooler.AlertDefinitionProduct];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			enableTabScroll: true,
			activeTab: 0,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			layoutOnTabChange: true,
			items: [alertRecipient, alertException, alertDefinitionProductStock, alertDefinitionShelfColumn, alertDefinitionDoorPercentageChange, alertDefinitionProduct]
		});
		Ext.apply(config, {
			region: 'north',
			height: 420
		});
		this.on('beforeLoad', this.onBeforeLoad, this);
		this.on('dataLoaded', this.onDataLoaded, this);
		this.on('beforeSave', function (form, params, options) {
			if (data != undefined || data != null) {
				var data = this.grid.getSelectionModel().getSelected().data;
			}
			//FOR NEW VALUES SELECTED BY USERS
			var form = form.formPanel.getForm();
			var salesOrganizationIds1 = this.salesOrgCheckedvals.join(',').split(',').filter(function (x) {
				return (x !== (undefined || null || ''));
			}).join(',');
			var salesOfficeIds = this.salesOfficeCheckedvals.join(',').split(',').filter(function (x) {
				return (x !== (undefined || null || ''));
			}).join(',');
			var salesGroupIds = this.salesGroupCheckedvals.join(',').split(',').filter(function (x) {
				return (x !== (undefined || null || ''));
			}).join(',');
			var salesTerritoryIds = this.salesTerritoryCheckedvals.join(',').split(',').filter(function (x) {
				return (x !== (undefined || null || ''));
			}).join(',');
			var teleSellingSalesHierarchyIds = this.salesTelesellingTerritoryCheckedvals.join(',').split(',').filter(function (x) {
				return (x !== (undefined || null || ''));
			}).join(',');  //form.findField('TeleSellingSalesHierarchyIds').getValue();

			var ids = [];
			if (salesOrganizationIds1.length > 0) {
				ids.push(salesOrganizationIds1);
			}
			if (salesOfficeIds.length > 0) {
				ids.push(salesOfficeIds);
			}
			if (salesGroupIds.length > 0) {
				ids.push(salesGroupIds);
			}
			if (salesTerritoryIds.length > 0) {
				ids.push(salesTerritoryIds);
			}
			if (teleSellingSalesHierarchyIds.length > 0) {
				ids.push(teleSellingSalesHierarchyIds);
			}
			ids = ids.filter(function (x) {
				return (x !== (undefined || null || ''));
			});
			ids = $.unique(ids).join(',');
			this.salesHierarchyIds.setValue(ids);

			this.saveTags(this.tagsPanel, params);

			var errorMessage = null;
			var gridValidationResult = this.validateGridAlert(this.alertRecipient);
			if (!gridValidationResult.IsValid) {
				var gridTitle = this.alertRecipient.title;
				if (gridTitle == '') {
					gridTitle = this.alertRecipient.root;
				}
				errorMessage = "Validation error in " + gridTitle + " item(s)";
			}
			var tags = DA.Security.info.Tags;
			if (Ext.isEmpty(salesOrganizationIds1) && (tags.LimitCountry == "1" || tags.LimitLocation == "1")) {
				DA.Util.ShowError('Validation error', "Need to select at least one Sales Organization for this role.");
				return false;
			}
			if (errorMessage) {
				DA.Util.ShowError('Validation error', errorMessage);
				return false;
			}
			else {
				return true;
			}

		});

		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 0px'
			},
			height: 600,
			width: 1020,
			items: [this.formPanel, tabPanel]
		});
	}
});
Cooler.AlertDefinition = new Cooler.AlertDefinition();

function removeuncheckedValueFromSalesHierarchy(salesHieraarchyLevel, salesHierarchyValue) {

	if (salesHieraarchyLevel == 0) {
		var salesOfficeTempIds = [];
		var salesGroupTempIds = [];
		var salesTerritoryTempIds = [];
		var salesOfficeStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_1.getStore();
		var salesGroupStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_2.getStore();
		var salesTerritoryeStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_3.getStore();
		salesOfficeStore.clearFilter();
		salesGroupStore.clearFilter();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesOfficeStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesOfficeTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);
		if (salesOfficeTempIds.length > 0) {
			salesGroupStore.each(function (record) {
				var vals = salesOfficeTempIds;
				for (var i = 0; i < vals.length; i++) {
					if (record.get("CustomValue") == vals[i]) {
						salesGroupTempIds.push(record.data.LookupId.toString());
					}
				}
			}, this);
			if (salesGroupTempIds.length > 0) {
				salesTerritoryeStore.each(function (record) {
					var vals = salesGroupTempIds;
					for (var i = 0; i < vals.length; i++) {
						if (record.get("CustomValue") == vals[i]) {
							salesTerritoryTempIds.push(record.data.LookupId.toString());
						}
					}
				}, this);
			}
		}

		var officeSelectedIds = Cooler.AlertDefinition.salesOfficeCheckedvals.join(',').split(',').filter(function (item) {
			return salesOfficeTempIds.indexOf(item) === -1;
		});
		var groupSelectedIds = Cooler.AlertDefinition.salesGroupCheckedvals.join(',').split(',').filter(function (item) {
			return salesGroupTempIds.indexOf(item) === -1;
		});
		var territorySelectedIds = Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});
		Cooler.AlertDefinition.salesOfficeCheckedvals = [];
		Cooler.AlertDefinition.salesGroupCheckedvals = [];
		Cooler.AlertDefinition.salesTerritoryCheckedvals = [];
		if (officeSelectedIds.length > 0) {
			Cooler.AlertDefinition.salesOfficeCheckedvals.push(officeSelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_1.setValue('' + Cooler.AlertDefinition.salesOfficeCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesOfficeCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_1.setValue('' + Cooler.AlertDefinition.salesOfficeCheckedvals.join(',') + '');
		}
		if (groupSelectedIds.length > 0) {
			Cooler.AlertDefinition.salesGroupCheckedvals.push(groupSelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AlertDefinition.salesGroupCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesGroupCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AlertDefinition.salesGroupCheckedvals.join(',') + '');
		}
		if (territorySelectedIds.length > 0) {
			Cooler.AlertDefinition.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesTerritoryCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
	}
	else if (salesHieraarchyLevel == 1) {
		var salesGroupTempIds = [];
		var salesTerritoryTempIds = [];
		var salesGroupStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_2.getStore();
		var salesTerritoryeStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_3.getStore();

		salesGroupStore.clearFilter();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesGroupStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesGroupTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);
		if (salesGroupTempIds.length > 0) {
			salesTerritoryeStore.each(function (record) {
				var vals = salesGroupTempIds;
				for (var i = 0; i < vals.length; i++) {
					if (record.get("CustomValue") == vals[i]) {
						salesTerritoryTempIds.push(record.data.LookupId.toString());
					}
				}
			}, this);
		}


		var groupSelectedIds = Cooler.AlertDefinition.salesGroupCheckedvals.join(',').split(',').filter(function (item) {
			return salesGroupTempIds.indexOf(item) === -1;
		});
		var territorySelectedIds = Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});

		Cooler.AlertDefinition.salesGroupCheckedvals = [];
		Cooler.AlertDefinition.salesTerritoryCheckedvals = [];

		if (groupSelectedIds.length > 0) {
			Cooler.AlertDefinition.salesGroupCheckedvals.push(groupSelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AlertDefinition.salesGroupCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesGroupCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_2.setValue('' + Cooler.AlertDefinition.salesGroupCheckedvals.join(',') + '');
		}
		if (territorySelectedIds.length > 0) {
			Cooler.AlertDefinition.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesTerritoryCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
	}
	else if (salesHieraarchyLevel == 2) {
		var salesTerritoryTempIds = [];
		var salesTerritoryeStore = Cooler.AlertDefinition.responsibleforSalesHierarchyLevel_3.getStore();
		salesTerritoryeStore.clearFilter();
		var vals = salesHierarchyValue.split(',');

		salesTerritoryeStore.each(function (record) {
			for (var i = 0; i < vals.length; i++) {
				if (record.get("CustomValue") == vals[i]) {
					salesTerritoryTempIds.push(record.data.LookupId.toString());
				}
			}
		}, this);

		var territorySelectedIds = Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',').split(',').filter(function (item) {
			return salesTerritoryTempIds.indexOf(item) === -1;
		});
		Cooler.AlertDefinition.salesTerritoryCheckedvals = [];
		if (territorySelectedIds.length > 0) {
			Cooler.AlertDefinition.salesTerritoryCheckedvals.push(territorySelectedIds.join(','));
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
		else {
			Cooler.AlertDefinition.salesTerritoryCheckedvals = [];
			Cooler.AlertDefinition.responsibleSalesHierarchyLevel_3.setValue('' + Cooler.AlertDefinition.salesTerritoryCheckedvals.join(',') + '');
		}
	}
}

Cooler.AlertRecipient = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Alert Recipient: {0}',
		listTitle: 'Alert Recipient',
		keyColumn: 'AlertRecipientId',
		captionColumn: null,
		gridIsLocal: true,
		newListRecordData: { TemplateId: '', AlertRecipientTypeId: '', NotificationTime: '', NotificationContactTypeId: '' }
	});
	Cooler.AlertRecipient.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertRecipient, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AlertRecipientAddress', type: 'string' },
		{ name: 'AlertRecipientText', type: 'string' },
		{ name: 'AlertDefinitionId', type: 'int' },
		{ name: 'AlertRecipientTypeId', type: 'int' },
		{ name: 'NotificationContactTypeId', type: 'int' },
		{ name: 'RoleId', type: 'int' },
		{ name: 'TemplateId', type: 'int' },
		{ name: 'StartDate', type: 'date' },
		{ name: 'EndDate', type: 'date' },
		{ name: 'IsActive', type: 'bool' },
		{ name: 'NotificationTime', type: 'int' }
	]),
	onBeforeEdit: function (e) {
		var record = e.record;
		var field = e.field;
		if (record.get('AlertRecipientTypeId') == Cooler.Enums.AlertRecipientType.Email) {
			record.set('NotificationContactTypeId', '');
			record.set('AlertRecipientText', '');
			record.set('RoleId', '');
			if (field == "NotificationContactTypeId" || field == "AlertRecipientText" || field == "RoleId") {
				e.cancel = true;
			}
		} else if (record.get('AlertRecipientTypeId') == Cooler.Enums.AlertRecipientType.Text) {
			record.set('NotificationContactTypeId', '');
			record.set('AlertRecipientAddress', '');
			record.set('RoleId', '');
			if (field == "NotificationContactTypeId" || field == "AlertRecipientAddress" || field == "RoleId") {
				e.cancel = true;
			}
		}
		else if (record.get('AlertRecipientTypeId') == Cooler.Enums.AlertRecipientType.Role) {
			var clientId = Cooler.AlertDefinition.clientCombo.getValue();
			if (!clientId) {
				if (field == "RoleId") {
					e.cancel = true;
				}
			}
			this.phone.allowBlank = true;
			this.email.allowBlank = true;
			record.set('AlertRecipientText', '');
			record.set('AlertRecipientAddress', '');
			if (field == "AlertRecipientText" || field == "AlertRecipientAddress" || field == "NotificationContactTypeId") {
				e.cancel = true;
			}
		}
		else {
			record.set('AlertRecipientText', '');
			record.set('AlertRecipientAddress', '');
			record.set('RoleId', '');
			if (field == "AlertRecipientText" || field == "AlertRecipientAddress" || field == "RoleId") {
				e.cancel = true;
			}
		}
		//filter logic by ankit		
		if (record) {
			if (this.emailTemplateComboStoreJson == undefined || this.emailTemplateComboStoreJson == {}) {
				this.emailTemplateComboStoreJson = JSON.parse(JSON.stringify(this.templateCombo.store.reader.jsonData));
			}
			var emailTemplateList = [];
			var emailtemplateObj = {};
			var emailTemplateData = this.emailTemplateComboStoreJson;

			emailtemplateObj = $.grep(emailTemplateData, function (e) { return e.ReferenceValue === Cooler.Enums.EmailTemplate.OnlyAlert; });

			for (var i = 0, len = emailtemplateObj.length; i < len; i++) {
				var record = emailtemplateObj[i];
				emailTemplateList.push(record);
			}
			this.emailTemplate = emailTemplateList;
			this.templateCombo.store.loadData(this.emailTemplate);
		}
	},
	onValidateEdit: function (e) {
		var field = e.field;
		var record = e.record;
		var grid = e.grid;
		var value = e.value;
		var row = e.row;
		var col = e.column;
		if (value) {
			switch (field) {
				case 'StartDate':
					if (record.get('EndDate')) {
						if (record.get('EndDate') < value) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "Start date cannot be greater than End Date", showBy: cell });
							return false;
						}
					}
					break;
				case 'EndDate':
					if (record.get('StartDate')) {
						if (record.get('StartDate') > value) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End date cannot be less than Start Date", showBy: cell });
							return false;
						}
					}
					break;
				case 'AlertRecipientTypeId':
					if (value === Cooler.Enums.AlertRecipientType.SalesRep) {
						if (value === Cooler.Enums.AlertRecipientType.SalesRep) {
							if (record.get('RoleId')) {
								record.set('RoleId', '');
							}
							record.set('NotificationContactTypeId', Cooler.Enums.ContactType.Prefered);
							return true;
						}
					}
					else if (value === Cooler.Enums.AlertRecipientType.Role) {
						var clientId = Cooler.AlertDefinition.clientCombo.getValue();
						if (!clientId) {
							Ext.Msg.alert('Alert', 'Please select any client first');
							return false;
						}
						record.set('NotificationContactTypeId', Cooler.Enums.ContactType.Prefered);
						return true;
					}
					else {
						record.set('NotificationContactTypeId', 0);
						record.set('RoleId', '');
						return true;
					}
					break;
			}
		}
	},

	onGridCreated: function (grid) {
		grid.on('validateedit', this.onValidateEdit, this);
		grid.on('beforeedit', this.onBeforeEdit, this);
	},
	cm: function () {
		var notificationTimeCombo = DA.combo.create({ fieldLabel: 'Notification Time', name: 'NotificationTime', hiddenName: 'NotificationTime', store: Cooler.AlertDefinition.comboStores.AlertNotificationTime, mode: 'local', listWidth: 220, allowBlank: false });
		var recipientCombo = DA.combo.create({ store: Cooler.AlertDefinition.comboStores.AlertRecipientType, mode: 'local', listWidth: 220, allowBlank: false });
		var contactTypeCombo = DA.combo.create({ store: Cooler.AlertDefinition.comboStores.NotificationContactType, mode: 'local', listWidth: 220 });
		//var templateCombo = DA.combo.create({ fieldLabel: 'Template',name: 'EmailTemplateId', hiddenName: 'EmailTemplateId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'EmailTemplate', AlertTypeId: Cooler.Enums.EmailTemplate.OnlyAlert } });
		var templateCombo = DA.combo.create({ store: Cooler.AlertDefinition.comboStores.EmailTemplate, mode: 'local', listWidth: 300, allowBlank: false });
		var roleCombo = DA.combo.create({ store: Cooler.AlertDefinition.comboStores.Role, mode: 'local' });
		var email = new Ext.form.TextField();
		var phone = new Ext.form.TextField();
		this.templateCombo = templateCombo;
		this.contactTypeCombo = contactTypeCombo;
		this.phone = phone;
		this.email = email;
		this.roleCombo = roleCombo;
		this.recipientCombo = recipientCombo;
		var isActive = new Ext.grid.CheckColumn({ header: 'Is Active?', name: 'IsActive', width: 60, dataIndex: 'IsActive', sortable: false, allowBlank: false });
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Recipient Type', dataIndex: 'AlertRecipientTypeId', renderer: ExtHelper.renderer.Combo(recipientCombo), editor: recipientCombo },
			{ header: 'Role', dataIndex: 'RoleId', renderer: ExtHelper.renderer.Combo(this.roleCombo), editor: this.roleCombo },
			{ header: 'Email', dataIndex: 'AlertRecipientAddress', editor: email },
			{ header: 'Text', dataIndex: 'AlertRecipientText', editor: phone },
			{ header: 'Predefined Template', dataIndex: 'TemplateId', width: 160, renderer: ExtHelper.renderer.Combo(this.templateCombo), editor: this.templateCombo, allowBlank: false },
			{ header: 'Contact Type', dataIndex: 'NotificationContactTypeId', renderer: ExtHelper.renderer.Combo(contactTypeCombo), editor: contactTypeCombo },
			{ header: 'Start Date', dataIndex: 'StartDate', renderer: ExtHelper.renderer.Date, editor: new Ext.form.DateField({ allowBlank: false }) },
			{ header: 'End Date', dataIndex: 'EndDate', renderer: ExtHelper.renderer.Date, editor: new Ext.form.DateField({ allowBlank: false }) },
			isActive,
			{ header: 'Notification Time', dataIndex: 'NotificationTime', width: 100, editor: notificationTimeCombo, renderer: ExtHelper.renderer.Combo(notificationTimeCombo) }
		]);
		cm.defaultSortable = true;
		return cm;
	}
});

Cooler.AlertRecipient = new Cooler.AlertRecipient();

Cooler.AlertException = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Alert Exception: {0}',
		listTitle: 'Alert Exception',
		keyColumn: 'AlertExceptionId',
		captionColumn: null,
		gridIsLocal: true
	});
	Cooler.AlertException.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertException, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AlertDefinitionId', type: 'int' },
		{ name: 'StartTime', type: 'date' },
		{ name: 'EndTime', type: 'date' },
		{ name: 'Days', type: 'string' }
	]),

	cm: function () {
		var data = [
			{ LookupId: 0, DisplayValue: 'All' },
			{ LookupId: 1, DisplayValue: 'Sunday' },
			{ LookupId: 2, DisplayValue: 'Monday' },
			{ LookupId: 3, DisplayValue: 'Tuesday' },
			{ LookupId: 4, DisplayValue: 'Wednesday' },
			{ LookupId: 5, DisplayValue: 'Thursday' },
			{ LookupId: 6, DisplayValue: 'Friday' },
			{ LookupId: 7, DisplayValue: 'Saturday' }
		];
		var daysCombo = new Ext.ux.form.LovCombo({
			store: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, idProperty: 'LookupId', data: data }),
			mode: 'local',
			displayField: 'DisplayValue',
			displayFieldTpl: '{DisplayValue}',
			valueField: 'LookupId',
			width: 150,
			height: 150,
			allowBlank: false,
			readOnly: true
		});
		this.daysCombo = daysCombo;
		var startTime = new Ext.form.TimeField({ allowBlank: false, format: 'H:i A', listWidth: 80 });
		var endTime = new Ext.form.TimeField({ allowBlank: false, format: 'H:i A', listWidth: 80 });
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Start Time', dataIndex: 'StartTime', editor: startTime, renderer: Cooler.renderer.timeRenderer, ignoreFilter: true },
			{ header: 'End Time', dataIndex: 'EndTime', editor: endTime, renderer: Cooler.renderer.timeRenderer, ignoreFilter: true },
			{
				header: 'Days', dataIndex: 'Days', xtype: 'combocolumn', width: 250, editor: daysCombo, ignoreFilter: true, renderer: function (value, m, r) {
					if (value !== '') {
						var values = value.split(',');
						var store = daysCombo.getStore();
						var toReturn = [];
						for (var i = 0, len = values.length; i < len; i++) {
							var rec = store.getAt(values[i])
							toReturn.push(rec.get("DisplayValue"));
						}
						return toReturn.join(',');
					}
				}
			}

		]);
		cm.defaultSortable = true;
		return cm;
	},
	onGridCreated: function (grid) {
		grid.on('validateedit', this.onValidateEdit, this);
	},
	isValidComparison: function (value, field, time) {
		var timepart = value.split(' ')[0];
		var hours = parseInt(timepart.split(':')[0]);
		var minutes = parseInt(timepart.split(':')[1]);
		var compareValue = (hours * 100 + minutes);
		var isDateFormat = time instanceof Date;
		if (isDateFormat) {
			var compareWith = time.getHours() * 100 + time.getMinutes();
		}
		else {
			var timepart = time.split(' ')[0];
			var hours = parseInt(timepart.split(':')[0]);
			var minutes = parseInt(timepart.split(':')[1]);
			var compareWith = (hours * 100 + minutes);
		}
		if (field == 'StartTime') {
			return compareValue > compareWith ? true : false;
		}
		else {
			return compareValue < compareWith ? true : false;
		}
	},
	onValidateEdit: function (e) {
		var field = e.field;
		var record = e.record;
		var grid = e.grid;
		var value = e.value;
		var row = e.row;
		var col = e.column;
		if (value) {
			switch (field) {
				case 'StartTime':
					var endTime = record.get('EndTime');
					if (endTime) {
						if (this.isValidComparison(value, field, endTime)) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
				case 'EndTime':
					var startTime = record.get('StartTime');
					if (startTime) {
						if (this.isValidComparison(value, field, startTime)) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
			}
		}
	}
});
Cooler.AlertException = new Cooler.AlertException();