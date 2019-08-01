Cooler.SmartDeviceLogCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDeviceLog',
	useElastic: true,
	listTitle: 'Diagnostic',
	securityModule: 'Diagnostic',
	constructor: function (config) {
		Cooler.SmartDeviceLogCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceLogId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Event Type', dataIndex: 'EventTypeId', type: 'int', width: 150, displayIndex: 'EventType', store: this.comboStores.EventType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.EventType }) },
			{ header: 'Event Source', dataIndex: 'EventSource', type: 'string', width: 150 },
			{ header: 'Message', dataIndex: 'Message', type: 'string', width: 150 },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' }

		]);
	}
});

Cooler.SmartDeviceLog = new Cooler.SmartDeviceLogCl();
Cooler.SmartDeviceLogReadOnly = new Cooler.SmartDeviceLogCl({ independent: true });