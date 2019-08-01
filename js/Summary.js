Cooler.CoolerSummary = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Cooler Info: {0}',
		listTitle: 'Summary Statewise',
		keyColumn: 'CoolerInfoId',
		captionColumn: null,
		controller: 'CoolerSummary',
		disableAdd: true,
		gridConfig: {
			plugins: [new Ext.ux.grid.GridSummary()],
			allowPaging: false,
			listeners: {
				'cellclick': this.onListGridCellClick
			}
		}
	});
	Cooler.CoolerSummary.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.CoolerSummary, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'StateId', type: 'int' },
		{ name: 'LocationId', type: 'int' },
		{ name: 'TotalCoolers', type: 'int' },
		{ name: 'SmartCoolers', type: 'int' },
		{ name: 'ActiveCoolers', type: 'int' },
		{ name: 'UnhealthyCoolers', type: 'int' },
		{ name: 'HumidCoolers', type: 'int' },
		{ name: 'TemperatureIssueCoolers', type: 'int' },
		{ name: 'LightIssueCoolers', type: 'int' },
		{ name: 'SoundIssueCoolers', type: 'int' },
		{ name: 'PurityIssueCoolers', type: 'int' },
		{ name: 'Stock', type: 'int' },
		{ name: 'StockBelow150', type: 'int' },
		{ name: 'Category', type: 'string' }
	]),
	onListGridCellClick: function (grid, rowIndex, colIndex, e) {
		var cm = grid.getColumnModel();
		var colHeader = cm.getColumnHeader(colIndex);
		var r = grid.getStore().getAt(rowIndex);

		var child;
		if (r.get('StateId') > 0) {
			//User is on State screen, show city data
			child = Cooler.CoolerSummaryCitywise;
			child.ShowList({}, { extraParams: { groupBy: 'auto', stateId: r.get('StateId') } });
		} else if (r.get('LocationId') > 0) {
			//User is on location screen, show location related coolers
			child = Cooler.CoolerInfoFiltered;
			child.ShowList({}, { extraParams: { locationId: r.get('LocationId') } });
		} else {
			child = Cooler.CoolerSummaryLocationwise;
			child.ShowList({}, { extraParams: { groupBy: 'auto', city: r.get('Category'), stateId: Cooler.CoolerSummaryCitywise.grid.baseParams.stateId } });
		}
		child.grid.setTitle(r.get('Category'));
	},
	cm: function () {
		var columnTitle = 'State';
		switch (this.uniqueId) {
			case 'Summary-Citywise':
				columnTitle = 'City';
				break;
			case 'Summary-Locationwise':
				columnTitle = 'Location';
				break;
		}
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: columnTitle, dataIndex: 'Category', width: 100, renderer: Cooler.renderer.Hyperlink },
			{ header: 'Total', dataIndex: 'TotalCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Smart', dataIndex: 'SmartCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Active', dataIndex: 'ActiveCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Unhealthy', dataIndex: 'UnhealthyCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Humid', dataIndex: 'HumidCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Temperature Issue', dataIndex: 'TemperatureIssueCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Light Issue', dataIndex: 'LightIssueCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Sound Issue', dataIndex: 'SoundIssueCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Purity Issue', dataIndex: 'PurityIssueCoolers', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Stock Below 150', dataIndex: 'StockBelow150', width: 80, align: 'right', summaryType: 'sum' },
			{ header: 'Stock', dataIndex: 'Stock', width: 80, align: 'right', summaryType: 'sum' }
		]);
		cm.defaultSortable = true;

		return cm;
	}
});

Cooler.CoolerSummaryStatewise = new Cooler.CoolerSummary({ uniqueId: 'Summary-Statewise', listTitle: 'Summary Statewise' });
Cooler.CoolerSummaryCitywise = new Cooler.CoolerSummary({ uniqueId: 'Summary-Citywise', listTitle: 'Summary Citywise' });
Cooler.CoolerSummaryLocationwise = new Cooler.CoolerSummary({ uniqueId: 'Summary-Locationwise', listTitle: 'Summary Locationwise' });
