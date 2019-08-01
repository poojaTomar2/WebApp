Cooler.ConsumerOrder = new Cooler.Form({
	controller: 'Order',

	keyColumn: 'ConsumerOrderId',

	listTitle: 'Retailer Order',

	disableAdd: true,
	securityModule: 'RetailerOrder',
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ConsumerOrderId' } }
	},

	hybridConfig: function () {
		return [
			{ header: 'Retailer Order Id', dataIndex: 'ConsumerOrderId', type: 'int' },
			{ header: 'Customer', dataIndex: 'CustomerName', type: 'string', width: 150 },
			{ header: 'Order Date', dataIndex: 'OrderDate', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Amount', dataIndex: 'Amount', type: 'float', width: 150 },
            { header: 'Outlet Code', dataIndex: 'Code', type: 'string', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet', dataIndex: 'LocationName', type: 'string', width: 150 },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 80 }
		];
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});

		var ConsumerOrderProductGrid = Cooler.ConsumerOrderProduct.createGrid({ disabled: true });
		this.ConsumerOrderProductGrid = ConsumerOrderProductGrid;


		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [ConsumerOrderProductGrid],
			height: 450,
			split: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
	},

	onGridCellclick: function (grid, rowIndex, e) {
		var row = grid.getStore().getAt(rowIndex);
		var consumerOrderId = row.get('ConsumerOrderId');
		grid = this.ConsumerOrderProductGrid;
		if (grid) {
			var store = grid.getStore();
			store.baseParams.ConsumerOrderId = consumerOrderId;
			store.load();
			this.ConsumerOrderProductGrid.setDisabled(false);
		}
	},
	onExportDetailClick: function (button) {
		var url = 'Controllers/OrderDetailRetailer.ashx?v=' + new Date();
		var format = button.tag || 'XLSX';
		var options = {
			Title: this.listTitle,
			exportFileName: this.listTitle,
			exportFormat: format,
			visibleColumns: true,
			isSummary: true,
			action: 'export'
		}

		var grids = [this.grid, this.ConsumerOrderProductGrid];
		var params = {};
		var grid = grids[0];
		if (typeof grid == 'string') {
			grid = Ext.getCmp(grid);
		}

		var store = grid.getStore();

		Ext.apply(params, store.baseParams);
		if (typeof store.lastOptions !== 'undefined' && store.lastOptions !== null) {
			Ext.apply(params, store.lastOptions.params);
		}

		var cols = [];
		var selectedFields = [];
		var selectedConcatenatedFields = [];
		var visibleColumns = options.visibleColumns;
		delete options.visibleColumns;
		for (var i = 0; i < grids.length; i++) {
			grid = grids[i];
			if (typeof grid == 'string') {
				grid = Ext.getCmp(grid);
			}

			if (visibleColumns) {
				cols.push(Ext.ux.util.Export.getGridColInfo({ grid: grid }));
			}

			selectedFields.push(Ext.decode(Ext.ux.GetRequiredColumns(grid.colModel.config, grid.store.fields.items)));
			selectedConcatenatedFields.push(Ext.decode(Ext.ux.GetConcatenatedFields(grid.colModel.config)));
		}
		var selectedFieldsLength = selectedFields.length;
		for (var i = 1; i < selectedFieldsLength; i++) {

			selectedFields = selectedFields[0].concat(selectedFields[i]);
		}
		options.selectedFields = Ext.encode(selectedFields);

		var selectedConcatenatedFieldsLength = selectedConcatenatedFields.length;
		for (var i = 1; i < selectedConcatenatedFieldsLength; i++) {
			selectedConcatenatedFields = selectedConcatenatedFields[0].concat(selectedConcatenatedFields[i]);
		}
		options.selectedConcatenatedFields = Ext.encode(selectedConcatenatedFields);

		var colLength = cols.length;
		for (var i = 1; i < colLength; i++) {
			cols = cols[0].concat(cols[i]);
		}
		if (visibleColumns) {
			params.cols = Ext.encode(grids.length == 1 ? cols[0] : cols);
		}

		Ext.apply(params, options);

		var d = new Date()
		var gmtHours = -d.getTimezoneOffset();
		params.TimeOffSet = gmtHours;
		ExtHelper.HiddenForm.submit({
			action: url,
			params: params
		});
		return;
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var exportButtonDetail = new Ext.SplitButton({
			text: 'Export Summary',
			menu: {
				items: [
					{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLSX' },
					{ text: 'CSV', iconCls: 'exportCSV', tag: 'CSV' }
				], listeners: { itemclick: this.onExportDetailClick, scope: this }
			}, handler: this.onExportDetailClick, scope: this, iconCls: 'exportExcel'
		});
		tbarItems.push(exportButtonDetail);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});