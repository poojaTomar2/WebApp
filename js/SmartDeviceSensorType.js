Cooler.SmartDeviceSensorType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Sensor Types',
		keyColumn: 'SmartDeviceSensorTypeId',
		captionColumn: null,
		allowExport: false,
		gridIsLocal: true,
		controller: 'SmartDeviceSensorType',
		newListRecordData: { SensorTypeId: '' },
		gridConfig: {
			custom: {
				loadComboTypes: true
			}
		}
	});
	Cooler.SmartDeviceSensorType.superclass.constructor.call(this, config);
};
Ext.extend(Cooler.SmartDeviceSensorType, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'SensorTypeId', type: 'int' },
		{ name: 'SmartDeviceSensorTypeId', type: 'int' },
		{ name: 'Name', type: 'string' }
	]),
	cm: function () {
		var sensorTypeCombo = DA.combo.create({ baseParams: { comboType: 'SensorType' }, width: 200, listWidth: 180, controller: "Combo", allowBlank: false });
		var cm = new Ext.ux.grid.ColumnModel([
		{ header: 'Sensor Type', dataIndex: 'SensorTypeId',displayIndex: 'Name', width: 200, editor: sensorTypeCombo }
		]);
		return cm;
	}
});
Cooler.SmartDeviceSensorType = new Cooler.SmartDeviceSensorType();
