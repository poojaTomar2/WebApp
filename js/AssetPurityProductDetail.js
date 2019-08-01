Cooler.AssetPurityProductDetailForm = Ext.extend(Cooler.Form, {

	controller: 'ProductOutOfStock',

	keyColumn: 'ProductId',

	title: 'Product detail',

	disableAdd: true,

	disableDelete: true,

	hideExtraColumns: false,

	constructor: function (config) {
		Cooler.AssetPurityProductDetailForm.superclass.constructor.call(this, config || {});
	},

	onGridCreated: function (grid) {
		grid.store.on('beforeload', this.onBeforeGridStoreLoad, this);
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ProductId', type: 'int' },
			{ dataIndex: 'ProductSKU', type: 'string', header: 'SKU', sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ProductName', type: 'string', header: 'Product Name', width: 220, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FacingInCooler', type: 'int', header: 'Facings in Cooler', sortable: false, align: 'right', menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FacingInPlanogram', type: 'int', header: 'Facings in Planogram', sortable: false, align: 'right', menuDisabled: true, quickFilter: false },
			{ dataIndex: 'PercentageOfProduct', header: '% of Product', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2), sortable: false, menuDisabled: true, quickFilter: false }
		];
	},

	onBeforeGridStoreLoad: function (store) {
		store.baseParams.otherAction = 'ProductDetail';
	}
});
Cooler.AssetPurityProductDetail = new Cooler.AssetPurityProductDetailForm({ uniqueId: 'AssetPurityProductDetail' });