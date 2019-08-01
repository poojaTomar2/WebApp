Cooler.AlertDefinitionProductStock = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Product-wise Stock',
		keyColumn: 'AlertDefinitionProductStockId',
		captionColumn: null,
		newListRecordData: { ProductId: '' },
		gridIsLocal: true
	});
	Cooler.AlertDefinitionProductStock.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertDefinitionProductStock, Cooler.Form, {
	hybridConfig: function () {
		var productCombo = DA.combo.create({ name: 'ProductId', hiddenName: 'ProductId', store: Cooler.comboStores.Product, mode: 'local', listWidth: 220, allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'Product', dataIndex: 'ProductId', width: 150, type: 'int', editor: productCombo },
			{ header: 'Stock %', dataIndex: 'StockPercentage', width: 150, type: 'int', editor: new Ext.form.NumberField({ allowBlank: false, minValue: 1, maxValue: 100, allowDecimals: false }) }
		];
	},
	onGridCreated: function (grid) {
		grid.on('validateedit', this.onBeforeValidateEdit, this);
	},
	onBeforeValidateEdit: function (rowData) {
		var field = rowData.field,
			store = rowData.record.store,
			value = rowData.value,
			exists = false; 
		store.each(function (data) {
			if (data.data.ProductId == value) {
				exists = true;
				return false;
			}
		});
		if (exists) {
			Ext.Msg.alert('Alert', 'Duplicate product not allowed');
			rowData.cancel = true;
		}
	}
});

Cooler.AlertDefinitionProductStock = new Cooler.AlertDefinitionProductStock();