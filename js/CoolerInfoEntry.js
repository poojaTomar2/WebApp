Cooler.CoolerEntryClass = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Cooler Info: {0}',
		listTitle: 'Cooler Info',
		keyColumn: 'CoolerInfoId',
		captionColumn: null,
		controller: 'CoolerInfo',
		copyButton: true,
		comboTypes: [
			'AssetType'
		],
		gridConfig: {
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'CoolerInfoId' } }
		}
	});
	Cooler.CoolerEntryClass.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.CoolerEntryClass, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'CoolerInfoId', type: 'int' },
		{ name: 'AssetId', type: 'int' },
		{ name: 'Stock', type: 'int' },
		{ name: 'StockDetails', type: 'string' },
		{ name: 'DoorOpen', type: 'date' },
		{ name: 'DoorClose', type: 'date' },
		{ name: 'DoorOpenDuration', type: 'int' },
		{ name: 'LightIntensity', type: 'int' },
		{ name: 'Temperature', type: 'float' },
		{ name: 'Humidity', type: 'int' },
		{ name: 'SoundLevel', type: 'int' },
		{ name: 'Latitude', type: 'float' },
		{ name: 'Longitude', type: 'float' },
		{ name: 'StockRemoved', type: 'int' },
		{ name: 'PurityIssue', type: 'bool' },
		{ name: 'LocationId', type: 'int' },
		{ name: 'Location', type: 'string' },
		{ name: 'AssetTypeId', type: 'int' },
		{ name: 'AssetType', type: 'string' },
		{ name: 'SerialNumber', type: 'string' },
		{ name: 'IsActive', type: 'bool' }
	]),

	comboStores: {
		Location: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},


	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'CoolerInfoId', width: 100, align: 'right' },
			{ header: 'Asset', dataIndex: 'AssetId', width: 100, align: 'right' },
			{ id: 'stock', header: 'Stock', dataIndex: 'Stock', width: 100, align: 'right' },
			{ header: 'Door Open', dataIndex: 'DoorOpen', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Door Close', dataIndex: 'DoorClose', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Door Open Duration', dataIndex: 'DoorOpenDuration', width: 100, align: 'right' },
			{ header: 'Light Intensity', dataIndex: 'LightIntensity', width: 100, align: 'right' },
			{ header: 'Temperature', dataIndex: 'Temperature', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Humidity', dataIndex: 'Humidity', width: 100, align: 'right' },
			{ header: 'Sound Level', dataIndex: 'SoundLevel', width: 100, align: 'right' },
			{ header: 'Latitude', dataIndex: 'Latitude', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Longitude', dataIndex: 'Longitude', width: 80, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Sales', dataIndex: 'StockRemoved', width: 100, align: 'right' },
			{ header: 'Purity Issue', dataIndex: 'PurityIssue', width: 100, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Outlet', dataIndex: 'Location', width: 100 },
			{ header: 'Asset Type', dataIndex: 'AssetTypeId', displayIndex: 'AssetType', renderer: 'proxy', store: this.comboStores.AssetType, width: 150 },
            { header: 'Serial Number', dataIndex: 'SerialNumber', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Is Active', dataIndex: 'IsActive', width: 100, renderer: ExtHelper.renderer.Boolean }
		]);
		cm.defaultSortable = true;

		return cm;
	},

	createForm: function (config) {
		return Ext.apply(config, {
			items: [
				{ fieldLabel: 'Asset Id', name: 'AssetId', xtype: 'numberfield', allowDecimals: false },
				{ fieldLabel: 'Stock', name: 'Stock', xtype: 'numberfield', allowDecimals: false },
				{ name: 'StockDetails', xtype: 'textarea' },
				{ fieldLabel: 'Door Open', name: 'DoorOpen', xtype: 'xdatetime' },
				{ fieldLabel: 'Door Close', name: 'DoorClose', xtype: 'xdatetime' },
				{ fieldLabel: 'Light Intensity', name: 'LightIntensity', xtype: 'numberfield', allowDecimals: false },
				{ fieldLabel: 'Temperature', name: 'Temperature', xtype: 'numberfield' },
				{ fieldLabel: 'Humidity', name: 'Humidity', xtype: 'numberfield', allowDecimals: false },
				{ fieldLabel: 'Sound Level', name: 'SoundLevel', xtype: 'numberfield', allowDecimals: false },
				{ fieldLabel: 'Latitude', name: 'Latitude', xtype: 'numberfield', decimalPrecision: 6 },
				{ fieldLabel: 'Longitude', name: 'Longitude', xtype: 'numberfield', decimalPrecision: 6 },
				{ fieldLabel: 'Sales', name: 'StockRemoved', xtype: 'numberfield' },
				{ fieldLabel: 'Purity Issue', name: 'PurityIssue', xtype: 'checkbox' }
			]
		});
	}
});

Cooler.CoolerEntry = new Cooler.CoolerEntryClass();

