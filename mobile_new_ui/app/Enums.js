Ext.define('CoolerIoTMobile.Enums', {
	singleton: true,
	ActionStatus: { Void: 1, Planned: 254, Completed: 255 },
	AlertStatus: { Closed: 255, Planned: 2, Complete: 254, New: 1 },
	SmartDeviceType: { SmartTrackV1: 1, SmartTagV1: 2, SmartVisionV1: 3, SmartHub: 4, SmartTrackV2: 5 },
	DeviceStatus: { Found: 1, NotFound: 2 },
	AssetType: { Cooler: 6, WendingMachine: 7 },
	DeviceType: { Ios: "ios" },
	OrderStatus: { New: 1, Progress: 2, Completed: 3 }

});
Ext.define('CoolerIoTMobile.PositionMap', {
	override: 'Ext.util.PositionMap',
	config: {
		minimumHeight: 30
	}
});