Cooler.CoolerInfoChild = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Cooler Info Child: {0}',
		listTitle: 'Cooler Info Child',
		keyColumn: 'CoolerInfoId',
		captionColumn: null,
		controller: 'CoolerInfoChild',
		disableAdd: true,
		gridConfig: {
			defaults: { sort: { dir: 'DESC', sort: 'CoolerInfoId' } }
		}
	});
	Cooler.CoolerInfoChild.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.CoolerInfoChild, Cooler.Form, {

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
		{ name: 'PurityIssue', type: 'bool' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'CoolerInfoId', width: 100, align: 'right' },
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
			{ header: 'Purity Issue', dataIndex: 'PurityIssue', width: 100, renderer: ExtHelper.renderer.Boolean }
		]);
		cm.defaultSortable = true;

		return cm;
	},

	onGridCreated: function (grid) {
		grid.on({
			render: Cooler.attachStockMouseOver
		});
	}
});

Cooler.CoolerInfoChild = new Cooler.CoolerInfoChild();

