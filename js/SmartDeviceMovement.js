Cooler.SmartDeviceMovementCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	title: 'Movement',
	useElastic: true,
	controller: 'SmartDeviceMovement',
	securityModule: 'Movement',
	constructor: function (config) {
		Cooler.SmartDeviceMovementCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	onGridCreated: function (grid) {
		grid.on("celldblclick", this.celldblclick, this);
		grid.on("cellclick", this.cellclick, this);
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceMovementId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Movement Type', dataIndex: 'MovementType', width: 120, type: 'string' },
			{ header: 'Start Time', dataIndex: 'StartTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'End Time', dataIndex: 'EventTime', width: 180, type: 'date', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Duration', dataIndex: 'MovementDuration', width: 80, type: 'int', align: 'right' },
			//{ header: 'Movement', dataIndex: 'Movement', width: 140, type: 'string' },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 80, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 80, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ dataIndex: 'MovementCount', type: 'int', header: 'Movement Count', align: 'right', width: 100 },
			{ header: 'Door Open', dataIndex: 'IsDoorOpen', width: 70, type: 'int', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Displacement(Km)', dataIndex: 'Displacement', width: 100, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Accuracy(Meter)', dataIndex: 'Accuracy', width: 100, type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Power Status', dataIndex: 'PowerStatusText', width: 120, type: 'string' },
			{ header: 'App Name', dataIndex: 'AppName', width: 160, type: 'string', align: 'right' },
			{ header: 'App Version', dataIndex: 'AppVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'SDK Version', dataIndex: 'SDKVersion', width: 160, type: 'string', align: 'right' },
			{ header: 'GPS Source', dataIndex: 'GPSSource', width: 120, type: 'string' }
		], { eventTime: false });
	},
	celldblclick: function (grid, rowIndex, e) {
		var column = this.cm.config[e];
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		var data = rec.data;
		if (data.MovementType != "GPS") {
			return;
		}
		Cooler.showGPSLocation(data.Latitude, data.Longitude, data.Accuracy);
	}
});

Cooler.SmartDeviceMovement = new Cooler.SmartDeviceMovementCl({ uniqueId: 'SmartDeviceMovement' });
Cooler.SmartDeviceAssetMovement = new Cooler.SmartDeviceMovementCl({ uniqueId: 'SmartDeviceAssetMovement' });
Cooler.SmartDeviceMovementReadOnly = new Cooler.SmartDeviceMovementCl({ independent: true });
Cooler.SmartDeviceAlertMovement = new Cooler.SmartDeviceMovementCl({ uniqueId: 'SmartDeviceAlertMovement' });