Cooler.AssetSummarizationReport = Ext.extend(Cooler.Form, {

	controller: 'AssetSummarizationReport',

	title: 'Asset Summarization Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'AssetSummarizationReport',

	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.AssetSummarizationReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetEventDataSummaryId' } }
		});
	},
	comboTypes: [
		'OutletType',
		'Client',
		'Country',
		'SmartDeviceType'
	],
	comboStores: {
		OutletType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'OutletType', type: 'string' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'ClientName', type: 'string' },
			{ dataIndex: 'Country', type: 'string' },
			{ dataIndex: 'SmartDeviceId', type: 'int' },
			{ dataIndex: 'AssetEventDataSummaryId', type: 'int' },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Event Date', type: 'date', dataIndex: 'EventDate', width: 150, renderer: ExtHelper.renderer.Date },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 150, },
			{ header: 'Outlet Type', dataIndex: 'OutletTypeId', type: 'int', displayIndex: 'OutletType', renderer: 'proxy', store: this.comboStores.OutletType, width: 100 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientId', type: 'int', displayIndex: 'ClientName', renderer: 'proxy', store: this.comboStores.Client, width: 120 },
			{ header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Sum Of Health Interval', type: 'int', dataIndex: 'SumOfHealthInterval', width: 100, align: 'right' },
			{ header: 'Average Temperature', type: 'float', dataIndex: 'AverageTemperature', width: 100, renderer: ExtHelper.renderer.Float(2), align: 'right' },
			{ header: 'Sum Of DoorCount', type: 'int', dataIndex: 'SumOfDoorCount', width: 100, align: 'right' },
			{ header: 'Sum Of Power Off Duration', type: 'int', dataIndex: 'SumOfPowerOffDuration', width: 100, align: 'right' },
			{ header: 'Average Temperature Between 1 To 12', type: 'float', dataIndex: 'AverageTemperatureBetween1To12', width: 150, align: 'right' },
			{ header: 'Is Temperature Above 7?', type: 'bool', dataIndex: 'IsTemperatureAbove7', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Sum Of Health Interval Between Temperature 1 To 12', type: 'int', dataIndex: 'SumOfHealthIntervalBetweenTemperature1To12', align: 'right', width: 150 },
			{ header: 'Light On Hours', type: 'int', dataIndex: 'LightOnHours', width: 100, align: 'right' },
			{ header: 'Light Off Hours', type: 'int', dataIndex: 'LightOffHours', width: 100, align: 'right' },
			{ header: 'Average Evaporator Temperature', type: 'float', dataIndex: 'AverageEvaporatorTemperature', renderer: ExtHelper.renderer.Float(2), width: 120, align: 'right' },
			{ header: 'Average Condensor Temperature', type: 'float', dataIndex: 'AverageCondensorTemperature', renderer: ExtHelper.renderer.Float(2), width: 120, align: 'right' },
			{ header: 'Average Ambient Temperature', type: 'float', dataIndex: 'AverageAmbientTemperature', renderer: ExtHelper.renderer.Float(2), width: 120, align: 'right' },
			{ header: 'Sum Of Door Open Duration', type: 'int', dataIndex: 'SumOfDoorOpenDuration', width: 100, align: 'right' },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'LocationType', width: 100 },
			{ header: 'IsKey Location?', type: 'bool', dataIndex: 'IsKeyLocation', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Classification', type: 'string', dataIndex: 'Classification', width: 100 },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 100 },
			{ header: 'Country', dataIndex: 'CountryId', type: 'int', displayIndex: 'Country', renderer: 'proxy', store: this.comboStores.Country, width: 100 },
			{ header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 100, },
			{ header: 'Gateway Serial Number', type: 'string', dataIndex: 'GatewaySerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Is GateWay?', type: 'bool', dataIndex: 'IsGateWay', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'IsFactory Asset?', type: 'bool', dataIndex: 'IsFactoryAsset', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Sum Of Door Open Duration Greater Than 362020', type: 'int', dataIndex: 'SumOfDoorOpenDurationGT362020', width: 120, align: 'right' },
			{ header: 'Sum Of Health Interval Temp Greater Than12', type: 'int', dataIndex: 'SumOfHealthIntervalTempGT12', width: 120, align: 'right' },
			{ header: 'Sum Of Health Interval light Intensity Not Equal To -1', type: 'int', dataIndex: 'SumOfHealthIntervallightIntensityNEQM1', width: 150, align: 'right' },
			{ header: 'Sum Of Compressor Duration', type: 'int', dataIndex: 'SumOfCompressorDuration', width: 100, align: 'right' },
			{ header: 'Sum Of Fan Duration', type: 'int', dataIndex: 'SumOfFanDuration', width: 100, align: 'right' },
			{ header: 'Sum Of Heater Duration', type: 'int', dataIndex: 'SumOfHeaterDuration', width: 100, align: 'right' },
			{ header: 'Sum Of Light Duration', type: 'int', dataIndex: 'SumOfLightDuration', width: 100, align: 'right' },
			{ header: 'Alert Summary Json Data', type: 'string', dataIndex: 'AlertSummaryInJson', width: 100 },
			{ header: 'Alarm Summary Json Data', type: 'string', dataIndex: 'AlarmSummaryInJson', width: 100 },
			{ header: 'Displacement In Km Count Greater Than 0.5', type: 'int', dataIndex: 'DisplacementInKmCountGT0P5', width: 120, align: 'right' },
			{ header: 'Movement Duration Count Greater Than 180', type: 'int', dataIndex: 'MovementDurationCountGT180', width: 120, align: 'right' },
			{ header: 'Sum Of Sales Quantity', type: 'float', dataIndex: 'SumOfSalesQuantity', width: 100, align: 'right' },
			{ header: 'Sum Of Visit Duration', type: 'int', dataIndex: 'SumOfVisitDuration', width: 100, align: 'right' },
			{ header: 'Is Asset Visited?', type: 'bool', dataIndex: 'VisitHistoryIsMissing', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Sum Of Door Open Duration Less Than Equal To 362020', type: 'int', dataIndex: 'SumOfDoorOpenDurationLTE362020', width: 150, align: 'right' },
			{ header: 'Latitude', type: 'float', dataIndex: 'Latitude', width: 100, align: 'right' },
			{ header: 'Longitude', type: 'float', dataIndex: 'Longitude', width: 100, align: 'right' },
			{ header: 'SubTrade Channel Type', type: 'string', dataIndex: 'SubTradeChannelType', width: 100 },
			{ header: 'Sales Territory Name', type: 'string', dataIndex: 'SalesTerritoryName', width: 100 },
			{ header: 'Sales Group Name', type: 'string', dataIndex: 'SalesGroupName', width: 100 },
			{ header: 'Sales Office Name', type: 'string', dataIndex: 'SalesOfficeName', width: 100 },
			{ header: 'Sales Organization Name', type: 'string', dataIndex: 'SalesOrganizationName', width: 100 },
			{ header: 'Sales Territory Code', type: 'string', dataIndex: 'SalesTerritoryCode', width: 100 },
			{ header: 'Sales Group Code', type: 'string', dataIndex: 'SalesGroupCode', width: 100, },
			{ header: 'Sales Office Code', type: 'string', dataIndex: 'SalesOfficeCode', width: 100, },
			{ header: 'Sales Organization Code', type: 'string', dataIndex: 'SalesOrganizationCode', width: 100 },
			{ header: 'Sales Target', type: 'int', dataIndex: 'SalesTarget', width: 100, align: 'right' },
			{ header: 'Door Open Target', type: 'int', dataIndex: 'DoorOpenTarget', width: 100, align: 'right' },
			{ header: 'Asset Type Capacity', type: 'float', dataIndex: 'AssetTypeCapacity', width: 100, align: 'right' },
			{ header: 'Asset TypeCapacity Range', type: 'string', dataIndex: 'AssetTypeCapacityRange', width: 100 },
			{ header: 'Asset Manufacturer Name', type: 'string', dataIndex: 'AssetManufacturerName', width: 150 },
			{ header: 'Smart Device Manufacturer Name', type: 'string', dataIndex: 'SmartDeviceManufacturerName', width: 150 },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceTypeId', type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType }), width: 130 },
			{ header: 'Min Capacity', type: 'float', dataIndex: 'MinCapacity', width: 100, align: 'right' },
			{ header: 'Max Capacity', type: 'float', dataIndex: 'MaxCapacity', width: 100, align: 'right' },
			{ header: 'Is From Health?', type: 'bool', dataIndex: 'IsFromHealth', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Door?', type: 'bool', dataIndex: 'IsFromDoor', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Power?', type: 'bool', dataIndex: 'IsFromPower', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Sales?', type: 'bool', dataIndex: 'IsFromSales', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Alert?', type: 'bool', dataIndex: 'IsFromAlert', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Alarm?', type: 'bool', dataIndex: 'IsFromAlarm', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Event?', type: 'bool', dataIndex: 'IsFromEvent', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is From Movement?', type: 'bool', dataIndex: 'IsFromMovement', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Light Off?', type: 'bool', dataIndex: 'IsLightOff', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Temperature Issue?', type: 'bool', dataIndex: 'IsTemperatureIssue', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Is Light Issue?', type: 'bool', dataIndex: 'IsLightIssue', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Last Temperature Value', type: 'float', dataIndex: 'LastTemperatureValue', width: 120, align: 'right' },
			{ header: 'Sum Of Movement Duration', type: 'int', dataIndex: 'SumOfMovementDuration', width: 150, align: 'right' },
			{ header: 'Is From Visit History?', type: 'bool', dataIndex: 'IsFromVisitHistory', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Device Light Status', type: 'string', dataIndex: 'DeviceLightStatus', width: 150, },
			{ header: 'Asset Capacity For Door', type: 'float', dataIndex: 'AssetCapacityForDoor', width: 150, },
			{ header: 'Min Ambient Temperature', dataIndex: 'MinAmbientTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Max Ambient Temperature', dataIndex: 'MaxAmbientTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Min Condensor Temperature', dataIndex: 'MinCondensorTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Max Condensor Temperature', dataIndex: 'MaxCondensorTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Min Evaporator Temperature', dataIndex: 'MinEvaporatorTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Max Evaporator Temperature', dataIndex: 'MaxEvaporatorTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Min Temperature', dataIndex: 'MinTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Max Temperature', dataIndex: 'MaxTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'Last Data Downloaded Flag', type: 'int', dataIndex: 'LastDataDownloadedFlag', width: 150, align: 'right' },
			{ header: 'Displacement In Km Less Then 0.5', type: 'bool', dataIndex: 'DisplacementInKmLT0P5', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Displacement In Km Greater Then Is Equal To 0.5 And Less Then Is Equal To 1', type: 'bool', dataIndex: 'DisplacementInKmGTIsEqToP5AndLTIsEqTo1', width: 150, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Displacement In Km Greater Then 1', type: 'bool', dataIndex: 'DisplacementInKmGTIsEqTo1', width: 150, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Min Light Intensity', type: 'int', dataIndex: 'MinLightIntensity', width: 120, align: 'right' },
			{ header: 'Max Light Intensity', type: 'int', dataIndex: 'MaxLightIntensity', width: 120, align: 'right' },
			{ header: 'Avg Light Intensity', dataIndex: 'AvgLightIntensity', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 120, align: 'right' },
			{ header: 'Is Open Front?', type: 'bool', dataIndex: 'IsOpenFront', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Fallen Magnet ', type: 'int', dataIndex: 'FallenMaganet', width: 100, align: 'right' },
			{ header: 'Displacement In Km', dataIndex: 'DisplacementInKm', renderer: ExtHelper.renderer.Float(2), type: 'float', width: 150, align: 'right' },
			{ header: 'CA Territory Name', type: 'string', dataIndex: 'CATerritoryName', width: 150, },
			{ header: 'MC Territory Name', type: 'string', dataIndex: 'MCTerritoryName', width: 150, },
			{ header: 'P1 Territory Name', type: 'string', dataIndex: 'P1TerritoryName', width: 150, },
			{ header: 'P2 Territory Name', type: 'string', dataIndex: 'P2TerritoryName', width: 150, },
			{ header: 'P3 Territory Name', type: 'string', dataIndex: 'P3TerritoryName', width: 150, },
			{ header: 'P4 Territory Name', type: 'string', dataIndex: 'P4TerritoryName', width: 150, },
			{ header: 'P5 Territory Name', type: 'string', dataIndex: 'P5TerritoryName', width: 150, }
		];
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},
	loadTotalCount: function () {
		var params = { action: 'getTotalCount', newAction: 'totalCount' };
		if (window.location.hostname == "portal-qa.ebest-iot.com") {
			params.firstSmartDeviceManufactureId = 3;
			params.secondSmartDeviceManufactureId = 133;
		}

		//if (window.location.hostname == "localhost") {
		//	params.firstSmartDeviceManufactureId = 3;
		//	params.secondSmartDeviceManufactureId = 133;
		//}
        if (window.location.hostname == "portal-dev.ebest-iot.com") {
			params.firstSmartDeviceManufactureId = 3;
			params.secondSmartDeviceManufactureId = 133;
		}
		if (window.location.hostname == "portal.visioniot.net") {
			params.firstSmartDeviceManufactureId = 3;
			params.secondSmartDeviceManufactureId = 133;
		}
		if (window.location.hostname == "portal.ebest-iot.com") {
			params.firstSmartDeviceManufactureId = 3;
			params.secondSmartDeviceManufactureId = 133;
		}
		Ext.Ajax.request({
			url: 'Controllers/AssetSummarizationReport.ashx',
			params: params,
			success: this.onSuccessLocationCount,
			failure: this.onFailure,
			scope: this
		});
		Ext.Ajax.request({
			url: 'Controllers/AssetSummarizationReport.ashx',
			params: params,
			success: this.onSuccessCount,
			failure: this.onFailure,
			scope: this
		});
	},
	beforeShowList: function (config) {
		this.loadTotalCount();
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.startDateField = new Ext.form.DateField({
			name: 'startDate', itemId: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		this.endDateField = new Ext.form.DateField({
			name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat
		});
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
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
				}
				this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
				if (!isGridFilterApply) {
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
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.store.load();
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
				this.grid.loadFirst();
			}, scope: this
		});
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	onSuccessLocationCount: function (result, request) {
		var responseText = Ext.decode(result.responseText);
		var tbar = this.grid.topToolbar;
		tbar.add('-');
		tbar.add('Customers Selected : ' + responseText.locationCount);
		tbar.add('-');
		tbar.add('Connected Coolers : ' + responseText.assetCount);
	},
	onSuccessCount: function (result, request) {
		var responseText = Ext.decode(result.responseText);
		var tbar = this.grid.topToolbar;
		tbar.add('-');
		tbar.add('Total Customers : ' + responseText.locationCountwithoutFilter);
		tbar.add('-');
		tbar.add('Count Of Coolers : ' + responseText.assetCountwithoutFilter);
	},
	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
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
Cooler.AssetSummarizationReport = new Cooler.AssetSummarizationReport({ uniqueId: 'AssetSummarizationReport' });