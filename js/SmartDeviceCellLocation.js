Cooler.SmartDeviceCellLocationCl = Ext.extend(Cooler.SmartDeviceEventLog, {
	keyColumn: 'SmartDeviceCellLocationId',
	useElastic: true,
	controller: 'SmartDeviceCellLocation',
	title: 'Cell Location',
	disableAdd: true,
	securityModule: 'CellLocation',
	constructor: function (config) {
		Cooler.SmartDeviceCellLocationCl.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	onGridCreated: function (grid) {
		grid.on("celldblclick", this.celldblclick, this);
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ header: 'Id', dataIndex: 'SmartDeviceCellLocationId', type: 'int', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ header: 'Cell Location Id', dataIndex: 'CellLocationId', type: 'int', align: 'right' },
			{ header: 'MCC', dataIndex: 'MCC', type: 'int', align: 'right' },
			{ header: 'MNC', dataIndex: 'MNC', type: 'int', align: 'right' },
			{ header: 'Cell Id', dataIndex: 'CellId', type: 'int', align: 'right' },
			{ header: 'Latitude', dataIndex: 'Latitude', type: 'float', width: 80, align: 'right', allowDecimal: true },
			{ header: 'Longitude', dataIndex: 'Longitude', type: 'float', width: 80, align: 'right', allowDecimal: true },
			{ header: 'Lac', dataIndex: 'Lac', type: 'int', align: 'right' },
			{ header: 'House Number', dataIndex: 'HouseNumber', type: 'string', width: 200 },
			{ header: 'Road', dataIndex: 'Road', type: 'string', width: 60 },
			{ header: 'State', dataIndex: 'CellLocationState', type: 'string', width: 60 },
			{ header: 'Postal Code', dataIndex: 'CellLocationPostalCode', type: 'string', width: 80 },
			{ header: 'City', dataIndex: 'CellLocationCity', type: 'string', width: 60 },
			{ header: 'Country Code', dataIndex: 'CountryCode', type: 'string', align: 'right' },
			{ header: 'Country', dataIndex: 'CellLocationCountry', type: 'string', width: 60 },
			{ header: 'Receive Quality', dataIndex: 'ReceiveQuality', type: 'int', width: 60 },
			{ header: 'Receive Level', dataIndex: 'ReceiveLevel', type: 'int', width: 60 },
			{ header: 'Info', dataIndex: 'Info', type: 'string', width: 60, renderer: ExtHelper.renderer.ToolTip() }
		]);
	},
	celldblclick: function (grid, rowIndex, e) {
		var column = this.cm.config[e];
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		var data = rec.data;
		Cooler.showGPSLocation(data.Latitude, data.Longitude, '');
	}
});
Cooler.SmartDeviceCellLocation = new Cooler.SmartDeviceCellLocationCl({ uniqueId: 'SmartDeviceCellLocation' });
Cooler.SmartDeviceCellLocationReadOnly = new Cooler.SmartDeviceCellLocationCl({ independent: true });
Cooler.SmartDeviceAssetCellLocation = new Cooler.SmartDeviceCellLocationCl({ uniqueId: 'SmartDeviceAssetCellLocation' });