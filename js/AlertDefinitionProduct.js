Cooler.AlertDefinitionProduct = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Products',
		keyColumn: 'AlertDefinitionProductId',
		captionColumn: null,
		newListRecordData: { ProductId: '' },
		gridIsLocal: true
	});
	Cooler.AlertDefinitionProduct.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertDefinitionProduct, Cooler.Form, {
	hybridConfig: function () {
		var productCombo = DA.combo.create({ name: 'ProductId', hiddenName: 'ProductId', store: Cooler.comboStores.Product, mode: 'local', listWidth: 260, allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'Product', dataIndex: 'ProductId', width: 260, type: 'int', editor: productCombo }
		];
	}
});

Cooler.AlertDefinitionProduct = new Cooler.AlertDefinitionProduct();