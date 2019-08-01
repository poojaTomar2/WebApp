Cooler.SmartDevicePingCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDevicePing',
	title: 'Ping',
	useElastic: true,
	securityModule: 'Ping',
	constructor: function (config) {
		Cooler.SmartDevicePingCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDevicePingId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'Latitude', type: 'float', header: 'Latitude', align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ dataIndex: 'Longitude', type: 'float', header: 'Longitude', align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ dataIndex: 'ScaneDistance', type: 'float', header: 'Scan Distance(KM)', align: 'right', width: 120, renderer: this.scanDistanceCalculate },
			{ dataIndex: 'Rssi', type: 'int', header: 'RSSI', align: 'right' },
			{ dataIndex: 'EventBitsString', type: 'string', header: 'Advertisement', sortable: false, menuDisabled: true, quickFilter: false },
			{ header: 'Battery Level', dataIndex: 'DeviceBatteryStatus', type: 'string', width: 160 },
			{ dataIndex: 'AppVersion', type: 'string', header: 'App Version' },
			{ dataIndex: 'FirstSeen', type: 'date', header: 'First Seen', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ dataIndex: 'HubBatteryLevel', type: 'int', header: 'Hub Battery %' },
			{ dataIndex: 'ChargingStatus', type: 'bool', header: 'Charging?', renderer: this.chargingStatusRenderer },
			{ dataIndex: 'Reference', type: 'string' }
		]);
	},

	chargingStatusRenderer: function (value, m, r) {
		var data = r.data;
		if (r.data.SerialNumber !== r.data.GatewaySerialNumber) {
			return 'N/A';
		}
		return data.ChargingStatus ? 'Yes' : 'No';
	},

	scanDistanceCalculate: function (value, m, r) {
		var data = r.data;
		if (r.data.ScaneDistance == 0) {
			return '';
		}
		return Math.round((data.ScaneDistance)*100)/100;
	}

});

Cooler.SmartDevicePing = new Cooler.SmartDevicePingCl({ uniqueId: 'SmartDevicePing' });
Cooler.SmartDevicePingReadOnly = new Cooler.SmartDevicePingCl({ independent: true });
Cooler.SmartDeviceAssetPing = new Cooler.SmartDevicePingCl({ uniqueId: 'SmartDeviceAssetPing' });