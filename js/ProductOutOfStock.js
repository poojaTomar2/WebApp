Cooler.ProductOutOfStockForm = Ext.extend(Cooler.Form, {

	controller: 'ProductOutOfStock',

	keyColumn: 'ProductId',

	title: 'Product Out Of Stock',

	disableAdd: true,

	disableDelete: true,

	hideExtraColumns: false,

	constructor: function (config) {
		Cooler.ProductOutOfStockForm.superclass.constructor.call(this, config || {});
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ProductId', type: 'int' },
			{ dataIndex: 'FullName', type: 'string', header: 'Product', width: 220, sortable: false },
			{ dataIndex: 'ShortName', type: 'string', header: 'Short Name', width: 220, sortable: false },
			{ dataIndex: 'SKU', type: 'string', header: 'SKU', width: 220, sortable: false }
		];
	}
});
Cooler.ProductOutOfStock = new Cooler.ProductOutOfStockForm({ uniqueId: 'ProductOutOfStock' });