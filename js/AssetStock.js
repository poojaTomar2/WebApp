Cooler.AssetStock = new Cooler.Form({
	keyColumn: 'AssetStockId',

	captionColumn: null,

	controller: 'AssetStock',

	disableAdd: true,

	hybridConfig: function () {
		return [
			{ header: 'Door Open', dataIndex: 'DoorOpen', width: 100, renderer: ExtHelper.renderer.DateTime, type: 'date' },
			{ header: 'Door Close', dataIndex: 'DoorClose', width: 100, renderer: ExtHelper.renderer.DateTime, type: 'date' },
			{ header: 'Total Stock ', dataIndex: 'TotalStock', width: 100, type: 'int' },
			{ header: 'Foreign Product', dataIndex: 'ForeignProduct', width: 100, type: 'int' }
		];
	}
});