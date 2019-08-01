Cooler.SmartDeviceTypeConfiguration = new Cooler.Form({
	controller: 'SmartDeviceTypeConfiguration',
	title: 'Smart Device Type Configuration',
	keyColumn: 'SmartDeviceTypeConfigurationId',
	comboTypes: ['Client', 'SmartDeviceConfigType'],
	securityModule: 'SmartDeviceTypeConfiguration',
	winConfig: {
		height: 660,
		width: 412
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'SmartDeviceTypeConfigurationId', type: 'int' },
			{ header: 'Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 200 },
			{ header: 'Cooler Iot Client', dataIndex: 'Client', type: 'string', width: 200 },
			{ header: 'SmartDeviceTypeConfig', dataIndex: 'SmartDeviceTypeConfig', type: 'string', width: 250 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', convert: Ext.ux.DateLocalizer, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', convert: Ext.ux.DateLocalizer, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		SmartDeviceConfigType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	createForm: function (config) {
		var smartDeviceTypeConfig = new Ext.form.Hidden({ name: 'SmartDeviceTypeConfig' }),
			clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', displayIndex: 'Client', mode: 'local', store: this.comboStores.Client, width: 220 }),
			deviceTypeCombo = DA.combo.create({
				fieldLabel: 'Device Type', id: 'hello', hiddenName: 'SmartDeviceTypeId', allowBlank: false, baseParams: { comboType: 'SmartDeviceType', isGateway: false }, controller: "Combo", listeners: {
					change: this.onDeviceTypeChange,
					scope: this
				}
			});
		this.deviceTypeCombo = deviceTypeCombo;
		this.deviceTypeCombo.on('select', this.onSelect, this);




		healthEventInterval = new Ext.form.NumberField({ fieldLabel: 'Health Event Interval', name: 'HealthEventInterval', allowBlank: false, minValue: 1, maxValue: 240, value: 60, id: 'HealthEventInterval' }),
		environmentEventInterval = new Ext.form.NumberField({ fieldLabel: 'Environment Event Interval', name: 'EnvironmentEventInterval', id: "EnvironmentEventInterval", allowBlank: false, minValue: 1, maxValue: 240, value: 60 }),
		advertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Advertisement Interval', name: 'AdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, value: 2000 }),

		energySavingAdvertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Energy Saving Advertisement Interval', name: 'EnergySavingAdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, id: 'EnergySavingAdvertisementInterval' }),
		iBeaconAdvertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Advertisement Interval', name: 'IBeaconAdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, value: 1022 }),
		eddyStoneURLAdvertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Advertisement Interval', name: 'EddyStoneURLAdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, value: 1000 }),
		eddyStoneUIDAdvertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Advertisement Interval', name: 'EddyStoneUIDAdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, value: 2000 }),
		eddyStoneTLMAdvertisementInterval = new Ext.form.NumberField({ fieldLabel: 'Advertisement Interval', name: 'EddyStoneTLMAdvertisementInterval', allowBlank: false, minValue: 20, maxValue: 10000, value: 2000 }),
		globalTxPower = DA.combo.create({ fieldLabel: 'Global TX Power', name: 'GlobalTXPower', mode: 'local', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5262 }),
		energySavingGlobalTxPower = DA.combo.create({ fieldLabel: 'Energy Saving Global TX Power', name: 'EnergySavingGlobalTXPower', mode: 'local', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, id: 'EnergySavingGlobalTXPower' }),
		iBeaconframe = new Ext.form.Checkbox({ fieldLabel: ' iBeacon frame', name: 'iBeaconframe', xtype: 'checkbox', checked: true }),
		iBeaconframeEnergySavingPeriod = new Ext.form.Checkbox({ fieldLabel: 'Energy Saving iBeacon frame', name: 'iBeaconframeEnergySaving', xtype: 'checkbox', checked: true }),
		eddyStoneUIDenergySavingPeriod = new Ext.form.Checkbox({ fieldLabel: 'Energy Saving Eddystone UID frame', name: 'eddyStoneUIDenergySaving', xtype: 'checkbox', checked: true }),
		eddyStoneURLenergySavingPeriod = new Ext.form.Checkbox({ fieldLabel: 'Energy Saving Eddystone URL frame ', name: 'eddyStoneURLenergySaving', xtype: 'checkbox', checked: true }),
		eddyStoneTLMenergySavingPeriod = new Ext.form.Checkbox({ fieldLabel: 'Energy Saving Eddystone TLM frame ', name: 'eddyStoneTLMenergySaving', xtype: 'checkbox', checked: true }),
		iBeaconUUID = new Ext.form.TextField({ fieldLabel: 'iBeacon UUID', name: 'iBeaconUUID', allowBlank: false, xtype: 'textfield', regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', value: '636f6b65000000000000636368406575' }),
		majorVersion = new Ext.form.NumberField({ fieldLabel: 'Major', name: 'MajorVersion', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 2, maxValue: 65535, value: 2 }),
		minorVersion = new Ext.form.NumberField({ fieldLabel: 'Minor', name: 'MinorVersion', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65535, value: 1 }),
		rSSIat1meter = new Ext.form.NumberField({ fieldLabel: 'RSSI value for 1 meter distance', name: 'RSSIat1meter', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: -128, maxValue: +127, value: -59 },
		iBeaconenergySavingAdvertiseInterval = new Ext.form.NumberField({ fieldLabel: 'Energy Saving Advertise Interval', name: 'IBeaconEnergySavingAdvertiseInterval', allowBlank: false, minValue: 20, maxValue: 10000, xtype: 'numberfield', decimalPrecision: 0, value: 5000 }),
		eddyStoneURLenergySavingAdvertiseInterval = new Ext.form.NumberField({ fieldLabel: 'Energy Saving Advertise Interval', name: 'EddyStoneURLEnergySavingAdvertiseInterval', allowBlank: false, minValue: 20, maxValue: 10000, xtype: 'numberfield', decimalPrecision: 0, value: 5000 }),
		eddyStoneUIDenergySavingAdvertiseInterval = new Ext.form.NumberField({ fieldLabel: 'Energy Saving Advertise Interval', name: 'EddyStoneUIDEnergySavingAdvertiseInterval', allowBlank: false, minValue: 20, maxValue: 10000, xtype: 'numberfield', decimalPrecision: 0, value: 5000 }),
		eddyStoneTLMenergySavingAdvertiseInterval = new Ext.form.NumberField({ fieldLabel: 'Energy Saving Advertise Interval', name: 'EddyStoneTLMEnergySavingAdvertiseInterval', allowBlank: false, minValue: 20, maxValue: 10000, xtype: 'numberfield', decimalPrecision: 0, value: 5000 }),
		iBeacontXPower = ExtHelper.CreateCombo({ fieldLabel: ' TX Power', name: 'IBeaconTXPower', mode: 'local', store: this.comboStores.SmartDeviceConfigType, value: Cooler.Enums.validateValue, allowBlank: false, value: 5262 }),
		iBeaconenergySavingTXPower = ExtHelper.CreateCombo({ fieldLabel: ' Energy Saving TX Power', name: 'IBeaconEnergySavingTXPower', mode: 'local', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5252 }),
		eddyStoneURLtXPower = ExtHelper.CreateCombo({ fieldLabel: ' TX Power', mode: 'local', name: 'EddyStoneURLTXPower', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5261 }),
		eddyStoneURLenergySavingTXPower = ExtHelper.CreateCombo({ fieldLabel: ' Energy Saving TX Power', mode: 'local', name: 'EddyStoneURLEnergySavingTXPower', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5252 }),
		eddyStoneUIDtXPower = ExtHelper.CreateCombo({ fieldLabel: ' TX Power', mode: 'local', name: 'EddyStoneUIDTXPower', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5261 }),
		eddyStoneUIDenergySavingTXPower = ExtHelper.CreateCombo({ fieldLabel: 'Energy Saving TX Power', mode: 'local', name: 'EddyStoneUIDEnergySavingTXPower', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5252 }),
		eddyStoneTLMtXPower = ExtHelper.CreateCombo({ fieldLabel: 'TX Power', name: 'EddyStoneTLMTXPower', mode: 'local', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5261 }),
		eddyStoneTLMenergySavingTXPower = ExtHelper.CreateCombo({ fieldLabel: 'Energy Saving TX Power', mode: 'local', name: 'EddyStoneTLMEnergySavingTXPower', store: this.comboStores.SmartDeviceConfigType, allowBlank: false, value: 5252 }),
		urlframe = new Ext.form.Checkbox({ fieldLabel: 'URL frame', name: 'URLframe', xtype: 'checkbox', checked: true }),
		urlstring = new Ext.form.TextField({ fieldLabel: 'URL String', name: 'URLstring', allowBlank: false, xtype: 'textfield', regex: new RegExp('((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)'), regexText: 'Please enter valid url', value: 'https://www.ebestiot.co/' }),
		uidFrame = new Ext.form.Checkbox({ fieldLabel: 'UID Frame', name: 'UIDFrame', xtype: 'checkbox', checked: true }),
		uidNameSpace = new Ext.form.TextField({ fieldLabel: 'UID NameSpace', name: 'UIDNameSpace', allowBlank: false, xtype: 'textfield', regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', value: '636f6b65634063656575' }),
		uidInstanceId = new Ext.form.TextField({ fieldLabel: 'UID Instance Id', name: 'UIDInstanceId', allowBlank: false, xtype: 'textfield', regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', value: '3752f1c51da1' })),
		tlmFrame = new Ext.form.Checkbox({ fieldLabel: 'TLM Frame', name: 'TLMFrame', xtype: 'checkbox' }),
		batteryModeTimeOut = new Ext.form.NumberField({ fieldLabel: 'Battery Mode TimeOut In Minutes', name: 'BatteryModeTimeOut', id: 'BatteryModeTimeOut', allowBlank: false, minValue: 1, maxValue: 1440 }),
		powerSavingStartTime = new Ext.form.TimeField({ fieldLabel: 'Start Time', allowBlank: false, format: 'H:i', listWidth: 80, name: 'StartTime', value: '00:00' }),
		powerSavingEndTime = new Ext.form.TimeField({ fieldLabel: 'End Time', allowBlank: false, format: 'H:i', listWidth: 80, name: 'EndTime', value: '00:00' }),
		gprsInterval = new Ext.form.NumberField({ fieldLabel: 'GPRS Interval', name: 'GPRSInterval', id: 'GPRSInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65000, value: 1 }),
		gpsInterval = new Ext.form.NumberField({ fieldLabel: 'GPS Interval', name: 'GPSInterval', id: 'GPSInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65000, value: 1 }),
		healthInterval = new Ext.form.NumberField({ fieldLabel: 'Health Interval', name: 'HealthInterval', id: 'HealthInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65000, value: 1 }),
		gpsWithoutMotionInterval = new Ext.form.NumberField({ fieldLabel: 'GPS Without Motion Interval', name: 'GPSWithoutMotionInterval', id: 'GPSWithoutMotionInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 1, maxValue: 65000, value: 1 }),
		gpsWithMotionInterval = new Ext.form.NumberField({ fieldLabel: 'GPS With Motion Interval', name: 'GPSWithMotionInterval', id: 'GPSWithMotionInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 2, maxValue: 1440, value: 2 }),
		stopMovementDetectInterval = new Ext.form.NumberField({ fieldLabel: 'Stop Movement Detect Interval', name: 'StopMovementDetectInterval', id: 'StopMovementDetectInterval', allowBlank: false, xtype: 'numberfield', decimalPrecision: 0, minValue: 2, maxValue: 1440, value: 2 });
		this.smartDeviceTypeConfig = smartDeviceTypeConfig;
		this.clientCombo = clientCombo;


		var formItems = [
			healthEventInterval,
			environmentEventInterval,
			advertisementInterval,
			energySavingAdvertisementInterval,
			iBeaconAdvertisementInterval,
			eddyStoneURLAdvertisementInterval,
			eddyStoneUIDAdvertisementInterval,
			eddyStoneTLMAdvertisementInterval,
			globalTxPower,
			energySavingGlobalTxPower,
			iBeaconframe,
			iBeaconframeEnergySavingPeriod,
			eddyStoneUIDenergySavingPeriod,
			eddyStoneURLenergySavingPeriod,
			eddyStoneTLMenergySavingPeriod,
			iBeaconUUID,
			majorVersion,
			minorVersion,
			rSSIat1meter,
			iBeaconenergySavingAdvertiseInterval,
			eddyStoneURLenergySavingAdvertiseInterval,
			eddyStoneUIDenergySavingAdvertiseInterval,
			eddyStoneTLMenergySavingAdvertiseInterval,
			iBeacontXPower,
			iBeaconenergySavingTXPower,
			eddyStoneURLtXPower,
			eddyStoneURLenergySavingTXPower,
			eddyStoneUIDtXPower,
			eddyStoneUIDenergySavingTXPower,
			eddyStoneTLMtXPower,
			eddyStoneTLMenergySavingTXPower,
			urlframe,
			urlstring,
			uidFrame,
			uidNameSpace,
			uidInstanceId,
			tlmFrame,
			powerSavingStartTime,
			powerSavingEndTime,
			batteryModeTimeOut,
			gprsInterval,
			gpsInterval,
			healthInterval,
			gpsWithoutMotionInterval,
			gpsWithMotionInterval,
			stopMovementDetectInterval
		];
		this.formItems = formItems;
		var statusConfig = new Ext.form.FieldSet({
			title: 'STATUS',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				healthEventInterval,
				environmentEventInterval,
				advertisementInterval,
				globalTxPower,
				energySavingAdvertisementInterval,
				energySavingGlobalTxPower
			]
		});

		this.statusConfig = statusConfig;


		//var energySavingPeriod = new Ext.form.FieldSet({
		//    title: 'Energy Saving Period',
		//    height: '100%',
		//    width: 350,
		//    defaults: {
		//        width: 210
		//    },
		//    items: [
		//        iBeaconframeEnergySavingPeriod,
		//        eddyStoneUIDenergySavingPeriod,
		//        eddyStoneURLenergySavingPeriod,
		//        eddyStoneTLMenergySavingPeriod
		//    ]
		//});
		//this.energySavingPeriod = energySavingPeriod;
		var eddyIBeaconConfig = new Ext.form.FieldSet({
			title: 'iBeacon',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				iBeaconframe,
				iBeaconUUID,
				majorVersion,
				minorVersion,
				rSSIat1meter,
				iBeaconAdvertisementInterval,
				iBeacontXPower,
				iBeaconframeEnergySavingPeriod,
				iBeaconenergySavingAdvertiseInterval,
				iBeaconenergySavingTXPower
			]
		});
		this.eddyIBeaconConfig = eddyIBeaconConfig;

		var eddyUrlConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone URL Configuration',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				urlframe,
				urlstring,
				eddyStoneURLAdvertisementInterval,
				eddyStoneURLtXPower,
				eddyStoneURLenergySavingPeriod,
				eddyStoneURLenergySavingAdvertiseInterval,
				eddyStoneURLenergySavingTXPower
			]
		});
		this.eddyUrlConfiguration = eddyUrlConfiguration;
		var eddyUIDConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone UID Configuration',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				uidFrame,
				uidNameSpace,
				uidInstanceId,
				eddyStoneUIDAdvertisementInterval,
				eddyStoneUIDtXPower,
				eddyStoneUIDenergySavingPeriod,
				eddyStoneUIDenergySavingAdvertiseInterval,
				eddyStoneUIDenergySavingTXPower
			]
		});
		this.eddyUIDConfiguration = eddyUIDConfiguration;
		var eddyTLMConfiguration = new Ext.form.FieldSet({
			title: 'EddyStone TLM Configuration',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				tlmFrame,
				eddyStoneTLMAdvertisementInterval,
				eddyStoneTLMtXPower,
				eddyStoneTLMenergySavingPeriod,
				eddyStoneTLMenergySavingAdvertiseInterval,
				eddyStoneTLMenergySavingTXPower
			]
		});
		this.eddyTLMConfiguration = eddyTLMConfiguration;

		// Power saving time set form field

		var powerSavingTimeConfiguration = new Ext.form.FieldSet({
			title: 'Power Saving Time',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				powerSavingStartTime,
				powerSavingEndTime
			]
		});
		this.powerSavingTimeConfiguration = powerSavingTimeConfiguration;

		var batteryTimeoutIntervalConfiguration = new Ext.form.FieldSet({
			title: 'Battery Timeout Interval',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				batteryModeTimeOut
			]
		});
		this.batteryTimeoutIntervalConfiguration = batteryTimeoutIntervalConfiguration;

		var setMainPowerTaskIntervalConfiguration = new Ext.form.FieldSet({
			title: 'Set Main Power Task Interval',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				gprsInterval,
				gpsInterval,
				healthInterval
			]
		});
		this.setMainPowerTaskIntervalConfiguration = setMainPowerTaskIntervalConfiguration;


		var setBattaryPowerTaskInterval = new Ext.form.FieldSet({
			title: 'Set Battary Power Task Interval',
			height: '100%',
			width: 350,
			defaults: {
				width: 210
			},
			items: [
				gpsWithoutMotionInterval,
				gpsWithMotionInterval,
				stopMovementDetectInterval
			]
		});
		this.setBattaryPowerTaskInterval = setBattaryPowerTaskInterval;

		var reportFilter = {
			xtype: 'fieldset',
			title: 'Gateway Device Configuration',
			bodyStyle: 'padding: 1px;',
			id: 'GatewayDeviceConfiguration',
			height: 270,
			items: [setMainPowerTaskIntervalConfiguration, setBattaryPowerTaskInterval]
		};

		//events on form

		this.on('beforeSave', this.onBeforeSave, this);
		this.on('dataLoaded', this.onDataLoaded, this);
		Ext.apply(config, {
			autoScroll: true,
			layout: 'form',
			border: false,
			listeners: {
				click: function () {
					this.message();
				}
			},
			items: [clientCombo, deviceTypeCombo, smartDeviceTypeConfig, statusConfig, eddyIBeaconConfig, eddyUrlConfiguration, eddyUIDConfiguration, eddyTLMConfiguration, powerSavingTimeConfiguration, batteryTimeoutIntervalConfiguration, reportFilter]

		});
		return config;
	},

	onSelect: function (me, record, index, data) {

		var addContact = Ext.get('GatewayDeviceConfiguration');
		if (record != undefined) {
			var record = record.data.LookupId;
			if (record == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record == Cooler.Enums.SmartDeviceType.SmartTrackAON || record == Cooler.Enums.SmartDeviceType.SollatekFFM2BB) {
				addContact.setVisible(true);

				document.getElementById('GatewayDeviceConfiguration').style.height = "270px";
			}
			else {
				addContact.setVisible(false);
				document.getElementById('GatewayDeviceConfiguration').style.height = "0px";
			}

		}

	},
	onDeviceTypeChange: function (combo, record, newValue) {

		if (record == Cooler.Enums.SmartDeviceType.SmartTag3rdGeneration || record == Cooler.Enums.SmartDeviceType.SmartTag4thGeneration || record == Cooler.Enums.SmartDeviceType.SmartVisionV6R2) {
			Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(false);
			Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(false);

		}
		else {
			Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(true);
			Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(true);
		}

        if (record == Cooler.Enums.SmartDeviceType.SollatekJEA ||record == Cooler.Enums.SmartDeviceType.ImberaCMD || record == Cooler.Enums.SmartDeviceType.SollatekFFMB || record == Cooler.Enums.SmartDeviceType.SollatekGBR3 || record == Cooler.Enums.SmartDeviceType.SollatekFFM2BB || record == Cooler.Enums.SmartDeviceType.SollatekFFX) {
			Ext.getCmp('EnvironmentEventInterval').setDisabled(false);
		}

		else {
			Ext.getCmp('EnvironmentEventInterval').setDisabled(true);
		}
		if (record == Cooler.Enums.SmartDeviceType.SollatekJEA || record == Cooler.Enums.SmartDeviceType.SollatekGBR1 || record == Cooler.Enums.SmartDeviceType.SollatekGBR3 || record == Cooler.Enums.SmartDeviceType.SollatekGBR4) {
			Ext.getCmp('BatteryModeTimeOut').setDisabled(false);

		}
		else {
			Ext.getCmp('BatteryModeTimeOut').setDisabled(true);
		}

		if (record == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			Ext.getCmp('HealthEventInterval').setDisabled(true);
			Ext.getCmp('EnvironmentEventInterval').setDisabled(true);
		}
		else {
			Ext.getCmp('HealthEventInterval').setDisabled(false);
		}

		if (record == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			Ext.getCmp('StopMovementDetectInterval').setDisabled(true);
		}

		else {
			Ext.getCmp('StopMovementDetectInterval').setDisabled(false);
		}

		if (record == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			Ext.getCmp('GPSInterval').setDisabled(true);
		}

		else {
			Ext.getCmp('GPSInterval').setDisabled(false);
		}
		if (record == Cooler.Enums.SmartDeviceType.SollatekFFM2BB) {
			Ext.getCmp('GPSInterval').allowBlank = false;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = false;
			Ext.getCmp('HealthEventInterval').allowBlank = false;
			Ext.getCmp('EnvironmentEventInterval').allowBlank = false;
		}
		else {
			Ext.getCmp('GPSInterval').allowBlank = true;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = true;
			Ext.getCmp('HealthEventInterval').allowBlank = true;
			Ext.getCmp('EnvironmentEventInterval').allowBlank = true;
		}

		if (record == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record == Cooler.Enums.SmartDeviceType.SmartHub2ndGen) {
			Ext.getCmp('GPSInterval').allowBlank = false;
		}



	},
	onDataLoaded: function (smartDeviceTypeConfig, data) {
		var record = data.data;
		if (record.Id != 0) {
			var smartDeviceTypeConfig = record.SmartDeviceTypeConfig;
			this.formValues = Ext.decode(smartDeviceTypeConfig);
			this.formItems.forEach(function (field) {
				field.setDisabled(false);
				field.setValue(this.formValues[field.name]);
			}, this);
            if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekJEA || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.ImberaCMD || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFMB || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekGBR3 || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFX) {
				var item = Ext.getCmp('EnvironmentEventInterval');
				Ext.apply(item, { allowBlank: false }, {});
				item.setDisabled(false);
				//Ext.apply(combo, { disable: false }, {});
				Ext.getCmp('EnvironmentEventInterval').validate();
			}
			else {
				var item = Ext.getCmp('EnvironmentEventInterval');
				Ext.apply(item, { allowBlank: true }, {});
				item.setDisabled(true);
				//Ext.apply(combo, { disable: true }, {});
				Ext.getCmp('EnvironmentEventInterval').validate();

				//Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(true);
				//Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(true);
			}
			if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTag3rdGeneration || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTag4thGeneration || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartVisionV6R2) {
				var item = Ext.getCmp('EnergySavingAdvertisementInterval');
				Ext.apply(item, { allowBlank: false }, {});
				item.setDisabled(false);
				Ext.getCmp('EnergySavingAdvertisementInterval').validate();

				var itemTXpower = Ext.getCmp('EnergySavingGlobalTXPower');
				Ext.apply(item, { allowBlank: false }, {});
				itemTXpower.setDisabled(false);
				Ext.getCmp('EnergySavingGlobalTXPower').validate();

				//Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(false);
				//Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(false);
			}
			else {
				var item = Ext.getCmp('EnergySavingAdvertisementInterval');
				Ext.apply(item, { allowBlank: true }, {});
				item.setDisabled(true);
				Ext.getCmp('EnergySavingAdvertisementInterval').validate();

				var itemTXpower = Ext.getCmp('EnergySavingGlobalTXPower');
				Ext.apply(item, { allowBlank: true }, {});
				itemTXpower.setDisabled(true);
				Ext.getCmp('EnergySavingGlobalTXPower').validate();

				//Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(true);
				//Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(true);
			}
			if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekJEA || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekGBR1 || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekGBR3 || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekGBR4) {
				var item = Ext.getCmp('BatteryModeTimeOut');
				Ext.apply(item, { allowBlank: false }, {});
				item.setDisabled(false);
				Ext.getCmp('BatteryModeTimeOut').validate();

				var itemTXpower = Ext.getCmp('BatteryModeTimeOut');
				Ext.apply(item, { allowBlank: false }, {});
				itemTXpower.setDisabled(false);
				Ext.getCmp('BatteryModeTimeOut').validate();
			}
			else {
				var item = Ext.getCmp('BatteryModeTimeOut');
				Ext.apply(item, { allowBlank: true }, {});
				item.setDisabled(true);
				Ext.getCmp('BatteryModeTimeOut').validate();

				var itemTXpower = Ext.getCmp('BatteryModeTimeOut');
				Ext.apply(item, { allowBlank: true }, {});
				itemTXpower.setDisabled(true);
				Ext.getCmp('BatteryModeTimeOut').validate();
			}

		}
		else {
			var item = Ext.getCmp('EnergySavingAdvertisementInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(true);
			Ext.getCmp('EnergySavingAdvertisementInterval').validate();

			var itemTXpower = Ext.getCmp('EnergySavingGlobalTXPower');
			Ext.apply(item, { allowBlank: true }, {});
			itemTXpower.setDisabled(true);
			Ext.getCmp('EnergySavingGlobalTXPower').validate();

			//Ext.getCmp('EnergySavingAdvertisementInterval').setDisabled(true);
			//Ext.getCmp('EnergySavingGlobalTXPower').setDisabled(true);
		}
		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			var item = Ext.getCmp('GPSInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(true);
			Ext.getCmp('GPSInterval').validate();
		}

		else {
			var item = Ext.getCmp('GPSInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(false);
			Ext.getCmp('GPSInterval').validate();
		}

		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			var item = Ext.getCmp('HealthEventInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(true);
			Ext.getCmp('HealthEventInterval').validate();


			var environmentEventInterval = Ext.getCmp('EnvironmentEventInterval');
			Ext.apply(environmentEventInterval, { allowBlank: true }, {});
			environmentEventInterval.setDisabled(true);
			Ext.getCmp('EnvironmentEventInterval').validate();
		}
		else {
			var item = Ext.getCmp('HealthEventInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(false);
			Ext.getCmp('HealthEventInterval').validate();


			var environmentEventInterval = Ext.getCmp('EnvironmentEventInterval');
			Ext.apply(environmentEventInterval, { allowBlank: true }, {});
			environmentEventInterval.setDisabled(false);
			Ext.getCmp('EnvironmentEventInterval').validate();
		}


		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartTrackAON) {
			var item = Ext.getCmp('StopMovementDetectInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(true);
			Ext.getCmp('StopMovementDetectInterval').validate();
		}

		else {
			var item = Ext.getCmp('StopMovementDetectInterval');
			Ext.apply(item, { allowBlank: true }, {});
			item.setDisabled(false);
			Ext.getCmp('StopMovementDetectInterval').validate();
		}
		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFM2BB) {
			Ext.getCmp('GPSInterval').allowBlank = false;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = false;
			Ext.getCmp('HealthEventInterval').allowBlank = false;
			Ext.getCmp('EnvironmentEventInterval').allowBlank = false;
		}
		else {
			Ext.getCmp('GPSInterval').allowBlank = true;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = true;
			Ext.getCmp('HealthEventInterval').allowBlank = true;
			Ext.getCmp('EnvironmentEventInterval').allowBlank = true;
		}

		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen) {
			Ext.getCmp('GPSInterval').allowBlank = false;
		}
		if (record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub3rdGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SmartHub2ndGen || record.SmartDeviceTypeId == Cooler.Enums.SmartDeviceType.SollatekFFM2BB) {
			Ext.getCmp('GPSInterval').allowBlank = false;
			Ext.getCmp('GPRSInterval').allowBlank = false;
			Ext.getCmp('HealthInterval').allowBlank = false;
			Ext.getCmp('GPSWithoutMotionInterval').allowBlank = false;
			Ext.getCmp('GPSWithMotionInterval').allowBlank = false;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = false;
		}
		else {
			Ext.getCmp('GPSInterval').allowBlank = true;
			Ext.getCmp('GPRSInterval').allowBlank = true;
			Ext.getCmp('HealthInterval').allowBlank = true;
			Ext.getCmp('GPSWithoutMotionInterval').allowBlank = true;
			Ext.getCmp('GPSWithMotionInterval').allowBlank = true;
			Ext.getCmp('StopMovementDetectInterval').allowBlank = true;
		}
		this.clientCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);
	},

	onBeforeSave: function (smartDeviceTypeConfig, params, options) {
		var values = smartDeviceTypeConfig.formPanel.form.getValues();
		this.clientCombo.enable();
		delete values["ClientId"];
		delete values["SmartDeviceTypeConfig"];
		delete values["SmartDeviceTypeId"];
		this.smartDeviceTypeConfig.setValue(JSON.stringify(values));
	}

});