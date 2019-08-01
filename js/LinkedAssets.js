Cooler.LinkedAssets = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'ParentAssetId',
		captionColumn: null,
		controller: 'LinkedAssets',
		disableAdd: true
	});
	Cooler.LinkedAssets.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.LinkedAssets, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'Id', type: 'int' },
		{ name: 'AssetId', type: 'int' },
		{ name: 'ParentAssetId', type: 'int' },
		{ name: 'SerialNumber', type: 'string' },
		{ name: 'AssetType', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Parent/Child', dataIndex: 'AssetId', width: 100, renderer: function (v, m, r) { return Cooler.Asset.getSelectedAssetId() == r.get('ParentAssetId') ? 'Child' : 'Parent' } },
            { header: 'Asset Serial Number', dataIndex: 'SerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Type', dataIndex: 'AssetType', width: 150 }
		]);
		return cm;
	}
});

Cooler.LinkedAssets = new Cooler.LinkedAssets();