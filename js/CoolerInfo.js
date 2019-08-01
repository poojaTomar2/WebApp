Cooler.CoolerInfo = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Cooler Info: {0}',
		listTitle: 'Cooler Info',
		keyColumn: 'CoolerInfoId',
		captionColumn: null,
		controller: 'CoolerInfo',
		securityModule: 'Operator',
		comboTypes: [
			'AssetType'
		],
		disableAdd: true,
		gridConfig: {
			custom: {
				loadComboTypes: true,
				quickSearch: {
					addColumns: false,
					indexes: [
					 { text: 'Serial Number', dataIndex: 'SerialNumber' }
					]
				}
			},
			defaults: { sort: { dir: 'DESC', sort: 'CoolerInfoId' } },
			listeners: {
				'cellclick': this.onListGridCellClick,
				scope: this
			}
		}
	});
	Cooler.CoolerInfo.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.CoolerInfo, Cooler.Form, {

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
	refreshAssetInfo: function (assetId) {
		Ext.Ajax.request({
			url: 'controllers/Asset.ashx',
			success: this.onSuccess,
			failure: this.onFailure,
			params: { action: 'load', id: assetId },
			scope: this
		});
	},
	onSuccess: function (response) {
		var data = Ext.decode(response.responseText).data;
		this.assetInfo.body.update(this.assetTpl.apply(data));
	},
	onFailure: function () {

	},
	onListGridCellClick: function (grid, rowIndex, colIndex, e) {
		var cm = grid.getColumnModel();
		var colHeader = cm.getColumnHeader(colIndex);
		var r = grid.getStore().getAt(rowIndex);

		this.refreshAssetInfo(r.get('AssetId'));
	},
	comboStores: {
		Location: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		AssetType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'CoolerInfoId', width: 100, align: 'right' },
            { header: 'Serial Number', dataIndex: 'SerialNumber', width: 100, hyperlinkAsDoubleClick: true },
			{ header: 'Door Open', dataIndex: 'DoorOpen', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Door Close', dataIndex: 'DoorClose', width: 160, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Door Open Duration', dataIndex: 'DoorOpenDuration', width: 100, align: 'right' },
			{ header: 'Stock', dataIndex: 'Stock', width: 100, align: 'right' },
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
			{ header: 'Is Active', dataIndex: 'IsActive', width: 100, renderer: ExtHelper.renderer.Boolean }
		]);
		cm.defaultSortable = true;

		return cm;
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var fromDateField = new Ext.form.DateField({ name: 'FromDate' });
		var toDateField = new Ext.form.DateField({ name: 'ToDate' });

		this.goButton = new Ext.Button({
			text: 'Go', handler: function () {
				this.grid.baseParams.fromDate = fromDateField.getValue();
				this.grid.baseParams.toDate = toDateField.getValue();
				this.grid.loadFirst();
			}, scope: this
		});

		tbarItems.push('|');
		tbarItems.push('From:');
		tbarItems.push(fromDateField);
		tbarItems.push('To:');
		tbarItems.push(toDateField);
		tbarItems.push(this.goButton);
		tbarItems.push('|');
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	assetTpl: new Ext.XTemplate(
		'<table width="100%">',
			'<tr><td><b>Serial Number:</b></td><td align="right">{SerialNumber}</td></tr>',
			'<tr><td colspan="2"> <b>Smart</b>: {[this.YesNo(values.IsSmart)]} <b>Healthy</b>: {[this.YesNo(!values.IsUnhealthy)]}</b></td></tr>',
			'<tr><td><b>Install Position:</b></td><td align="right">{[values.Latitude]}, {[values.Longitude]}</td></tr>',
			'<tr><td><b>Current Position:</b></td><td align="right">{[values.LatestLatitude]}, {[values.LatestLongitude]}</td></tr>',
			'<tr><td><b>Displacement:</b></td><td align="right">{[values.Displacement.toFixed(2)]} </td></tr>',
			//'<tr><td><b>Door Open:</b></td><td align="right">{[this.DateTime(values.DoorOpen)]}</td></tr>',
			//'<tr><td><b>Door Close:</b></td><td align="right">{[this.DateTime(values.DoorClose)]}</td></tr>',
			'<tr><td><b>Door Duration:</b></td><td align="right">{[ (Ext.isDate(values.DoorOpen) && Ext.isDate(values.DoorClose)) ? (((Number(values.DoorClose) - Number(values.DoorOpen)) / 1000).toFixed("0") + "s") : "-" ]}</td></tr>',
			'<tr><td><b>Purity Issue:</b></td><td align="right">{[this.YesNo(values.PurityIssue)]}</td></tr>',
			//'<tr><td><b>Temperature:</b></td><td align="right">{Temperature}</td></tr>',
			//'<tr><td><b>Light Intensity:</b></td><td align="right">{LightIntensity}</td></tr>',
			'<tr><td><b>Asset Model:</b></td><td align="right">{[values.AssetType]}</td></tr>',
			'<tr><td><b>Outlet:</b></td><td align="right">{[values.Location]}</td></tr>',
			'<tr><td><b>Address:</b></td><td align="right">{[values.Street]} {[values.Street2]} {[values.Street3]} {[values.State]} {[values.Country]}</td></tr>',
			'<tr><td><b>Asset Ping:</b></td><td align="right">{[Cooler.renderer.DateTimeWithTimeZoneForTpl(values.AssetLastPing, values.TimezoneId)]}</td></tr>',
		'</table>',
		'<tpl if="1 === 1"><div class="assetDetail">{[Cooler.stockRenderer(values.StockDetails)]}</div></tpl>',
		{
			YesNo: function (value) {
				return value ? "Yes" : "No";
			},
			DateTime: function (value) {
				return value ? value.format('m/d/y H:i:s') : '';
			}
		}
	),

	configureListTab: function (config) {
		Ext.apply(this.grid, {
			region: 'center'
		});

		this.grid.on({
			render: Cooler.attachStockMouseOver
		});

		this.assetInfo = new Ext.Panel({ title: 'Cooler Info', html: '', region: 'east', width: 250, split: true });

		Ext.apply(config, {
			layout: 'border',
			title: 'Cooler Info: All',
			defaults: { border: false },
			items: [this.grid, this.assetInfo]
		});

		return config;
	}
});
Cooler.CoolerInfoFiltered = new Cooler.CoolerInfo({ uniqueId: 'CoolerInfo-Filtered', listTitle: 'Cooler Info: Filtered on Location' });

