Cooler.LocationProduct = new Cooler.Form({
	keyColumn: 'LocationProductId',
	captionColumn: null,
	title: 'Product',
	controller: 'LocationProduct',
	quickSaveController: 'LocationProduct',
	newListRecordData: { ProductId: '', ProductCategoryId: '' },
	gridPlugins: [new DA.form.plugins.Inline()],
	hybridConfig: function () {
		var productCombo = DA.combo.create({ store: Cooler.comboStores.Product, allowBlank: false, mode: 'local' });
		var productCategoryCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.ProductCategory, allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'LocationProductId', type: 'int' },
			{ header: 'Product', dataIndex: 'ProductId', type: 'int', displayIndex: 'Product', editor: productCombo, renderer: ExtHelper.renderer.Combo(productCombo), width: 150 },
			{ header: 'Product Category', dataIndex: 'ProductCategoryId', type: 'int', displayIndex: 'DisplayValue', editor: productCategoryCombo, renderer: ExtHelper.renderer.Combo(productCategoryCombo), width: 150 },
			{ header: 'Name', dataIndex: 'ProductName', editor: new Ext.form.TextField({ maxLength: 100, allowBlank: false }), type: 'string', allowBlank: false },
			{ header: 'Price', dataIndex: 'Price', editor: new Ext.form.NumberField({ allowBlank: false, minValue: 0, maxValue: 9999 }), type: 'float' }
		];
	}

});

