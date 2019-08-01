Cooler.SmartDevicePowerConsumptionCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDevicePowerConsumption',
	useElastic: true,
	title: 'Power Usage',
	securityModule: ' PowerConsumption',
	constructor: function (config) {
		Cooler.SmartDevicePowerConsumptionCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDevicePowerConsumptionId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Power Consumption', dataIndex: 'PowerConsumption', type: 'float', align: 'right' },
			{ header: 'Power Consumption Avg', dataIndex: 'Average', type: 'float', width: 200, align: 'right' },
			{ header: 'Start Time', dataIndex: 'StartTime', type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
			{ header: 'End Time', dataIndex: 'EndTime', type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 }
		]);
	}
});

Cooler.SmartDevicePowerConsumption = new Cooler.SmartDevicePowerConsumptionCl({ uniqueId: 'SmartDevicePowerConsumption' });
Cooler.SmartDevicePowerConsumptionReadOnly = new Cooler.SmartDevicePowerConsumptionCl({ independent: true });
Cooler.SmartDeviceAssetPowerConsumption = new Cooler.SmartDevicePowerConsumptionCl({ uniqueId: 'SmartDeviceAssetPowerConsumption' });
Cooler.SmartDeviceAlertPowerConsumption = new Cooler.SmartDevicePowerConsumptionCl({ uniqueId: 'SmartDeviceAlertPowerConsumption' });