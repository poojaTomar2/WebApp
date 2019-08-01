Cooler.AssetSmartDevice = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'AssetSmartDeviceId',
		captionColumn: null,
		gridIsLocal: true,
		comboTypes: ['Asset'],
		controller: 'AssetSmartDevice',
		newListRecordData: { AssetId: '' },
		gridConfig: {
			custom: {
				loadComboTypes: true
			}
		}
	});
	Cooler.AssetSmartDevice.superclass.constructor.call(this, config);
};
Ext.extend(Cooler.AssetSmartDevice, Cooler.Form, {
	listRecord: Ext.data.Record.create([
	{ name: 'Id', type: 'int' },
	{ name: 'AssetId', type: 'int' },
	{ name: 'SerialNumber', type: 'string' }
	]),

	cm: function () {
		var assetCombo = DA.combo.create({ baseParams: { comboType: 'Asset' }, width: 200, listWidth: 180, controller: "Combo", allowBlank: false });
		var cm = new Ext.ux.grid.ColumnModel([
		{ header: 'Asset', dataIndex: 'AssetId', displayIndex: 'SerialNumber', width: 200, editor: assetCombo }
		]);
		return cm;
	}
});

Cooler.AssetSmartDevice = new Cooler.AssetSmartDevice();