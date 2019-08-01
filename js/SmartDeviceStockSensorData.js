Cooler.SmartDeviceStockSensorData = Ext.extend(Cooler.SmartDeviceEventLog, {
	controller: 'SmartDeviceStockSensorData',
	title: 'Stock Sensor',
	useElastic: true,
	securityModule: 'SmartDeviceStockSensorData',
	constructor: function (config) {
		Cooler.SmartDeviceStockSensorData.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return this.addEventColumns([
			{ dataIndex: 'SmartDeviceStockSensorDataId', type: 'int', header: 'Id', align: 'right', elasticDataIndex: 'Id', elasticDataIndexType: 'string' },
			{ dataIndex: 'StockData', type: 'int', header: 'Stock' },
			{ dataIndex: 'DistanceData', type: 'int', header: 'Distance' },
			{ dataIndex: 'Product', type: 'string', header: 'Product' },
			{ dataIndex: 'ContainerLength', type: 'int', header: 'Container Length(mm)' },
			{ dataIndex: 'BoxWidth', type: 'int', header: 'Box Width(mm)' },
			//{ dataIndex: 'ContainerTypeId', type: 'int', header: 'Container Type', renderer: this.containerTypeRenderer },
			{ dataIndex: 'ContainerType', type: 'string', header: 'Container Type' }

		]);
	},
	//containerTypeRenderer: function (value, model, record) {
	//	var returnValue;
	//	if (record.data.ContainerTypeId == 0) {
	//		returnValue = "Horizontal";
	//	}
	//	else {
	//		returnValue = "Vertical";
	//	}
	//	return returnValue;
	//}
});
Cooler.SmartDeviceStockSensorDataC1 = new Cooler.SmartDeviceStockSensorData({ uniqueId: 'SmartDeviceStockSensorData' });
Cooler.SmartDeviceStockSensorDataReadOnly = new Cooler.SmartDeviceStockSensorData({ uniqueId: 'SmartDeviceStockSensorDataReadOnly' });
Cooler.SmartDeviceStockSensorDataReadOnly1 = new Cooler.SmartDeviceStockSensorData({ uniqueId: 'SmartDeviceStockSensorDataReadOnly1' });
Cooler.SmartDeviceStockSensorDataReadOnly2 = new Cooler.SmartDeviceStockSensorData({ uniqueId: 'SmartDeviceStockSensorDataReadOnly2' });
Cooler.SmartDeviceStockSensorDataLog = new Cooler.SmartDeviceStockSensorData({ independent: true });