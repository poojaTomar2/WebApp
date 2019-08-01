Ext.define('Df.grid.column.Combo', {
	extend: 'Ext.grid.column.Column',
	alias: 'widget.combocolumn',
	renderer: function (value, meta, record, rowIndex, colIndex) {
		var col = this.columns[colIndex];
		var store = col.store, displayField = col.displayField, valueField = this.valueField;
		if (!store) {
			var editor = col.getEditor(record);
			if (editor) {
				store = editor.store;
				displayField = editor.displayField;
				valueField = editor.valueField;
			}
		}
		if (store) {
			for (var i = 0, len = store.getCount() ; i < len; i++) {
				var record = store.getAt(i);
				if (record.get(valueField) === value) {
					return record.get(displayField);
				}
			}
		}
		return value;
	}
});