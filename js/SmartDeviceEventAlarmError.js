Cooler.SmartDeviceEventAlarmErrorC1 = Ext.extend(Cooler.SmartDeviceEventLog, {
	title: 'Event Alarm Error',
	controller: 'SmartDeviceEventAlarmError',
	securityModule: 'EventAlarmError',
	constructor: function (config) {
		Cooler.SmartDeviceEventAlarmErrorC1.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceEventAlarmErrorId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			//{ dataIndex: 'SmartDeviceTypeId', header: 'Device Type', width: 120, type: 'int', displayIndex: 'SmartDeviceType', store: this.comboStores.SmartDeviceType, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.SmartDeviceType })},
			{ header: 'Event Type', dataIndex: 'EventType', width: 180, type: 'string' },
			{ header: 'Events', dataIndex: 'EventBitsString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Alarms', dataIndex: 'AlarmBitsString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Operation Status', dataIndex: 'OperationStatusString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Relay Status', dataIndex: 'RelayStatusString', type: 'string', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Error Code', dataIndex: 'ErrorCode', width: 180, type: 'int', renderer: this.errorCodeRenderer },
			{ header: 'Error Time', dataIndex: 'ErrorTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' }
		]);
	},

	errorCodeRenderer: function (value, model, record) {
		var toReturn = "";
		if (typeof value !== 'number') {
			return toReturn;
		}
		else if (value == 1) {
			toReturn = "No CIR UART Msg";
		}
		else if (value == 2) {
			toReturn = "EMD response timeout for Sollatek";
		}
		return toReturn;
	}
});

Cooler.SmartDeviceEventAlarmError = new Cooler.SmartDeviceEventAlarmErrorC1({ uniqueId: 'SmartDeviceEventAlarmError' });
Cooler.SmartDeviceEventAlarmErrorReadOnly = new Cooler.SmartDeviceEventAlarmErrorC1({ uniqueId: 'SmartDeviceEventAlarmErrorReadOnly' });