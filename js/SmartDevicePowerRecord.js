Cooler.SmartDevicePowerRecordCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDevicePowerRecord',
	title: 'Power Record',
	useElastic: true,
	securityModule: 'PowerRecord',
	constructor: function (config) {
		Cooler.SmartDevicePowerRecordCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ header: 'Id', dataIndex: 'SmartDevicePowerRecordId', type: 'int', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Power On Event Id', dataIndex: 'EventIdPowerOn', type: 'int', align: 'right', width: 150 },
			{ header: 'Power On Event Time', dataIndex: 'PowerOn', type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
			{ header: 'Power Off Event Id', dataIndex: 'EventIdPowerOff', type: 'int', align: 'right', width: 150 },
			{ header: 'Power Off', dataIndex: 'PowerOff', type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
		    { header: 'Power Off Duration', dataIndex: 'PowerOffDuration', type: 'int', width: 100 },
            { header: 'Record Type', dataIndex: 'RecordType', type: 'string' }
		]);
	}
});

Cooler.SmartDevicePowerRecord = new Cooler.SmartDevicePowerRecordCl();
Cooler.SmartDevicePowerRecordReadOnly = new Cooler.SmartDevicePowerRecordCl({ independent: true });