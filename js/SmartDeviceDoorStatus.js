Cooler.SmartDeviceDoorStatusCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDeviceDoorStatus',
	useElastic: true,
	title: 'Door Status',
	securityModule: 'Door',
	constructor: function (config) {
		Cooler.SmartDeviceDoorStatusCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});

	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceDoorStatusId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Open Event Time', dataIndex: 'DoorOpen', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Close Event Time', dataIndex: 'EventTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Event Type', dataIndex: 'EventType', width: 180, type: 'string'},
			{ header: 'Door Open Duration(sec)', dataIndex: 'DoorOpenDuration', width: 90, type: 'int', align: 'right' },
			{ header: 'Time of Day', dataIndex: 'SmartDeviceTimeOfDay', type: 'string' },
			{ header: 'Weekday / Weekend', dataIndex: 'SmartDeviceWeekend', type: 'string' },
			{ header: 'Hour in Day', dataIndex: 'HourInDay', type: 'int', align: 'right' },
			{ header: 'Door Count', dataIndex: 'DoorCount', width: 90, type: 'int', align: 'right' },
			{ header: 'Additional Info', dataIndex: 'VisionErrorCodesInfo', width: 150, type: 'int', renderer: this.visionErrorCodesRenderer, sortable: false, menuDisabled: true },
			{ header: 'Outlet Territory', dataIndex: 'SalesTerritoryName', width: 90, type: 'string' },
			{ header: 'Door', dataIndex: 'DoorName', width: 90, type: 'string' },
			{ header: 'Capacity Type', dataIndex: 'AssetTypeCapacity', type: 'string', width: 150, align: 'right' },
			{ header: 'Door Open Target', dataIndex: 'DoorOpenTarget', type: 'int', align: 'right', width: 150 },
			{ header: 'Door Open Temperature', dataIndex: 'DoorOpenTemperature', type: 'int', align: 'right', width: 150 },
			{ header: 'Door Close Temperature', dataIndex: 'DoorCloseTemperature', type: 'int', align: 'right', width: 150 },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' }

		], { eventTime: false });

	},
	//eventTypeRenderer: function (value, model, record) {
	//	return value ? "Door open timeout event" : "Door close event";
	//},
	visionErrorCodesRenderer: function (value, model, record) {
		if (typeof value !== 'number') {
			return;
		}
		var values = [],
			errorCodes = [
				"Camera 1 I2C configuration Fail",
				"Camera 2 I2C configuration Fail",
				"Camera 1 image capture timeout",
				"Camera 2 image capture timeout",
				"Camera 1 image over size",
				"Camera 2 image over size",
				"STM Flash Configuration error",
				"Door angle1 is not crossed",
				"Door angle2 is not crossed",
				"Camera 1 did not complete image capture and Camera 2 triggered",
				"Take picture disable",
				"Door open time out",
				"STM32 tunrned on but no response from it",
				"STM Hard Fault",
				"Door is opened while device is connected",
				"Image capture time is not due"
			];

		for (var i = 0; len = errorCodes.length, i < len; i++) {
			if (((value >> i) % 2 != 0)) {
				values.push(errorCodes[i]);
			}
		}
		return values.join(', ');
	}
});

Cooler.SmartDeviceDoorStatus = new Cooler.SmartDeviceDoorStatusCl({ uniqueId: 'SmartDeviceDoorStatus' });
Cooler.SmartDeviceDoorStatusReadOnly = new Cooler.SmartDeviceDoorStatusCl({ independent: true });
Cooler.SmartDeviceAssetDoorStatus = new Cooler.SmartDeviceDoorStatusCl({ uniqueId: 'SmartDeviceAssetDoorStatus' });
Cooler.SmartDeviceAlertDoorStatus = new Cooler.SmartDeviceDoorStatusCl({ uniqueId: 'SmartDeviceAlertDoorStatus' });