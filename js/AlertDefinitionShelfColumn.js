Cooler.AlertDefinitionShelfColumn = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		listTitle: 'Shelf-wise Out Of Stock',
		keyColumn: 'AlertDefinitionShelveColumnId',
		captionColumn: null,
		newListRecordData: { ShelfNumber: '', ColumnNumber: '' },
		gridIsLocal: true
	});
	Cooler.AlertDefinitionShelfColumn.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AlertDefinitionShelfColumn, Cooler.Form, {
	hybridConfig: function () {
		var productCombo = DA.combo.create({ name: 'ProductId', hiddenName: 'ProductId', store: Cooler.comboStores.Product, mode: 'local', listWidth: 220 });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'Shelf Number', dataIndex: 'ShelfNumber', width: 100, type: 'int', editor: new Ext.form.NumberField({ allowBlank: false, minValue: 1, maxValue: 20, allowDecimals: false }) },
			{ header: 'Column Number', dataIndex: 'ColumnNumber', type: 'string', width: 150, editor: new Ext.form.TextField({ maxLength: 50, allowBlank: false }) }
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
		switch (field) {
			case "ShelfNumber":
				store.each(function (data) {
					if (data.data.ShelfNumber == value) {
						exists = true;
						return false;
					}
				});
				if (exists) {
					Ext.Msg.alert('Alert', 'Duplicate "Shelf Number" not allowed');
					rowData.cancel = true;
					return false;
				}
				break;
			case "ColumnNumber":
				value = value.replace(/ /g, '').replace(/,,/g, ',').replace(/,$/, "");
				if (value.startsWith(',')) {
					value = value.substring(0);
				}
				//testing duplicate values
				if (/(?:^|,)([^,]+)(?=.*,\1(?:,|$))/.test(value)) {
					Ext.Msg.alert('Alert', 'Duplicate "Column Number" not allowed');
					rowData.cancel = true;
					return false;
				}
				//testing value between 1 to 20
				if (!(/^(2[0]|1[0-9]|[0-9])(,(2[0]|1[0-9]|[0-9]))*$/).test(value)) {
					Ext.Msg.alert('Alert', '"Column Number" values must be between 1 to 20');
					rowData.cancel = true;
					return false;
				}
				rowData.record.set("ColumnNumber", value);
				rowData.value = value;
				break;
		}
	}
});

Cooler.AlertDefinitionShelfColumn = new Cooler.AlertDefinitionShelfColumn();