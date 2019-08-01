Cooler.SmartDevicePowerEventCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDevicePowerEvent',
	useElastic: true,
	title: 'Power Event',
	securityModule: 'PowerEvent',
	constructor: function (config) {
		Cooler.SmartDevicePowerEventCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDevicePowerEventId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Power Status', dataIndex: 'PowerOnOff', type: 'string', width: 120 },
            { header: 'Record Type', dataIndex: 'RecordType', type: 'string' },
			{ header: 'Is Power On With No Rtc', dataIndex: 'IsPowerOnWithNoRtc', type: 'bool', renderer: ExtHelper.renderer.Boolean }
		]);
	}
});
Cooler.SmartDevicePowerEvent = new Cooler.SmartDevicePowerEventCl({ uniqueId: 'SmartDevicePowerEvent' });
Cooler.SmartDevicePowerEventReadOnly = new Cooler.SmartDevicePowerEventCl({ independent: true });
Cooler.SmartDeviceAssetPowerEvent = new Cooler.SmartDevicePowerEventCl({ uniqueId: 'SmartDeviceAssetPowerEvent' });
Cooler.SmartDeviceAlertPowerEvent = new Cooler.SmartDevicePowerEventCl({ uniqueId: 'SmartDeviceAlertPowerEvent' });