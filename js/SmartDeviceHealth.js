Cooler.SmartDeviceHealthCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	title: 'Health Event',
	useElastic: true,
	controller: 'SmartDeviceHealthRecord',
	securityModule:'Health',
	constructor: function (config) {
		Cooler.SmartDeviceHealthCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceHealthRecordId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'Reference', type: 'string'},
			//{ header: 'Event Type1', dataIndex: 'EventType', width: 160, type: 'string', align: 'right' },
			{ header: 'Event Type', type: 'int', dataIndex: 'EventTypeId', displayIndex: 'EventType', store: this.comboStores.EventType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.EventType }) },
			{ header: 'Light', dataIndex: 'LightIntensity', width: 50, type: 'int', align: 'right', renderer: this.lightRenderer },
			{ header: 'Light Status', dataIndex: 'LightStatus', width: 160, type: 'string', align: 'right' },
			//{ header: 'Light Status', dataIndex: 'SerialNumberPrefix', type: 'string', width: 160, renderer: this.lightStatusRenderer, sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Temperature(°C)', dataIndex: 'Temperature', width: 110, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right' },
			{ header: 'Evaporator Temperature(°C)', dataIndex: 'EvaporatorTemperature', width: 110, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right' },
			{ header: 'Condensor Temperature(°C)', dataIndex: 'CondensorTemperature', width: 110, renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right' },
			//{ header: 'Door Open', dataIndex: 'IsDoorOpen', width: 70, renderer: ExtHelper.renderer.Boolean, type: 'bool' },
			{ header: 'Battery', dataIndex: 'BatteryLevel', width: 70, type: 'int', align: 'right', renderer: this.batteryValueRenderer },
			{ header: 'Battery Status', dataIndex: 'BatteryStatus', type: 'string', width: 160 },
			{ header: 'Interval(Min)', dataIndex: 'HealthInterval', type: 'int', width: 100, type: 'int', align: 'right' },
            { header: 'Cooler Voltage(V)', dataIndex: 'CoolerVoltage', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'Max Voltage(V)', dataIndex: 'MaxVoltage', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'Min Voltage(V)', dataIndex: 'MinVoltage', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'Avg Power Consumption(Watt)', dataIndex: 'AvgPowerConsumption', type: 'int', width: 125, type: 'int', align: 'right' },
			{ header: 'Total compressor ON Time(%)', dataIndex: 'TotalCompressorONTime', type: 'int', align: 'right', width: 100 },
			{ header: 'Max Cabinet Temperature(°C)', dataIndex: 'MaxCabinetTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'Min Cabinet Temperature(°C)', dataIndex: 'MinCabinetTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'Ambient Temperature(°C)', dataIndex: 'AmbientTemperature', renderer: ExtHelper.renderer.Float(2), type: 'float', align: 'right', width: 100 },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' }
		]);
	},

	lightRenderer: function (value, model, record) {
		var lightIntensity = record.data.LightIntensity,
			toReturn = 'N/A';
		if (lightIntensity == -1) {
			toReturn = 'N/A';
		}
		else {
			toReturn = lightIntensity;
		}

		return toReturn;
	},

	lightStatusRenderer: function (value, model, record) {
		var light = record.data.LightIntensity,
			toReturn = 'N/A';
		if (value.indexOf('SBB-ST') > -1) {
			toReturn = lightIntensity <= Cooler.Enums.LightValue.STFirstGenNoLight ? 'No Light' : lightIntensity > Cooler.Enums.LightValue.STFirstGenNoLight && lightIntensity <= Cooler.Enums.LightValue.STFirstGenLowBrightness ? 'Low Brightness' : lightIntensity > Cooler.Enums.LightValue.STFirstGenLowBrightness && lightIntensity <= Cooler.Enums.LightValue.STFirstGenMediumBrightness ? 'Medium Brightness' : 'Full Light Brightness';
		}
		else if (value.indexOf('SBB-SV') > -1 || value.indexOf('SBC-SV') > -1) {
			toReturn = lightIntensity <= Cooler.Enums.LightValue.SVFirstGenNoLight ? 'No Light' : lightIntensity > Cooler.Enums.LightValue.SVFirstGenNoLight && lightIntensity <= Cooler.Enums.LightValue.SVFirstGenLowBrightness ? 'Low Brightness' : lightIntensity > Cooler.Enums.LightValue.SVFirstGenLowBrightness && lightIntensity <= Cooler.Enums.LightValue.SVFirstGenMediumBrightness ? 'Medium Brightness' : 'Full Light Brightness';
		}
		else if (value.indexOf('SBC-ST') > -1) {
			toReturn = lightIntensity <= Cooler.Enums.LightValue.STSecondGenNoLight ? 'No Light' : lightIntensity > Cooler.Enums.LightValue.STSecondGenNoLight && lightIntensity <= Cooler.Enums.LightValue.STSecondGenLowBrightness ? 'Low Brightness' : lightIntensity > Cooler.Enums.LightValue.STSecondGenLowBrightness && lightIntensity <= Cooler.Enums.LightValue.STSecondGenMediumBrightness ? 'Medium Brightness' : 'Full Light Brightness';
		}
		return toReturn;
	},

	batteryValueRenderer: function (value, model, record) {
		var reference = record.data.Reference;
		var returnValue = '';
		if (reference == 'CD' || reference == 'CMD') {
			returnValue = '';
		}
		else {
			returnValue = value;
		}
		return returnValue;
	}
});

Cooler.SmartDeviceHealth = new Cooler.SmartDeviceHealthCl({ uniqueId: 'SmartDeviceHealthRecord' });
Cooler.SmartDeviceHealthReadOnly = new Cooler.SmartDeviceHealthCl({ independent: true });
Cooler.SmartDeviceAssetHealth = new Cooler.SmartDeviceHealthCl({ uniqueId: 'SmartDeviceAssetHealth' });
Cooler.SmartDeviceAlertHealth = new Cooler.SmartDeviceHealthCl({ uniqueId: 'SmartDeviceAlertHealth' });