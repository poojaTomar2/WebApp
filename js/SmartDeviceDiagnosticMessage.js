Cooler.SmartDeviceDiagnosticMessageC1 = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDeviceDiagnosticMessage',
	title: 'HUB GPRS Diagnostic',
	useElastic: true,
	securityModule: 'SmartDeviceDiagnosticMessage',
	constructor: function (config) {
		Cooler.SmartDeviceDiagnosticMessageC1.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceDiagnosticMessageId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'ModuleType', type: 'string', header: 'Event Type' },
			{ dataIndex: 'ModuleActivity', type: 'string', header: 'Module Activity' },
			{ dataIndex: 'ActivityStatus', type: 'string', header: 'Activity Status' },
			{ dataIndex: 'ActivityData', type: 'int', header: 'Activity Data' },
			{ dataIndex: 'ResetCount', type: 'int', header: 'Reset Count' }
		]);
	}
});

Cooler.SmartDeviceDiagnosticMessage = new Cooler.SmartDeviceDiagnosticMessageC1({ uniqueId: 'SmartDeviceDiagnosticMessage' });
Cooler.SmartDeviceDiagnosticMessageReadOnly = new Cooler.SmartDeviceDiagnosticMessageC1({ uniqueId: 'SmartDeviceDiagnosticMessageReadOnly' });