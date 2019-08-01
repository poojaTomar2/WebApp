Ext.define('Df.plugin.EditableGrid', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.editable-grid',
	editorColumnCss: 'input-column',
	addIconCls: null,
	deleteIconCls: null,
	addText: 'Add',
	deleteText: 'Delete',
	saveText: 'Save',
	allowAdd: true,
	allowDelete: true,
	init: function (grid) {
		var readOnly = grid.readOnly;
		var items = [];
		if (!readOnly && this.allowAdd) {
			items.push({
				text: this.addText,
				iconCls: this.addIconCls,
				type: 'plus',
				itemId: 'addButton',
				handler: this.onAddNew,
				scope: this
			});
		}
		if (!readOnly && this.allowDelete) {
			items.push({
				text: this.deleteText,
				iconCls: this.deleteIconCls,
				handler: this.onDelete,
				scope: this,
				itemId: 'deleteButton'
			});
		}
		if (!readOnly && (typeof this.allowAdd === 'boolean' || typeof this.allowDelete === 'boolean') && grid.store.autoSync !== true) {
			items.push({
				text: this.saveText,
				handler: this.onSave,
				scope: this,
				itemId: 'saveButton'
			});
		}

		if (items.length > 0) {
			grid.addDocked({
				xtype: 'toolbar',
				dock: 'top',
				items: items
			});
		}

		var existingEditor = grid.findPlugin('cellediting');
		if (readOnly) {
			this.on('render', this.removeEditorPlugin, this);
		} else {
			if (!existingEditor) {
				grid.addPlugin({
					ptype: 'cellediting',
					clicksToEdit: 1
				});
			}
		}

		var columns = grid.columns;
		var editorColumnCss = this.editorColumnCss;
		for (var i = 0, len = columns.length; i < len; i++) {
			var col = columns[i];
			if (col.editor) {
				var currentCls = (col.tdCls || "").split(' ');
				var index = currentCls.indexOf(editorColumnCss);
				if (readOnly) {
					if (index > -1) {
						currentCls.splice(index, 1);
					}
				} else {
					if (index === -1) {
						currentCls.push(editorColumnCss);
					}
				}
				col.tdCls = currentCls.join(' ');
			}
		}

		this.callParent(arguments);
		grid.relayEvents(grid.getStore(), ['write']);
		this.grid = grid;
	},

	removeEditorPlugin: function () {
		var grid = this.grid;
		var existingEditor = grid.findPlugin('cellediting');
		if (existingEditor) {
			grid.removePlugin(existingEditor);
		}
	},

	destroy: function() {
		delete this.grid;
	},

	onAddNew: function () {
		var grid = this.grid;
		var store = grid.getStore();
		var model = store.model;
		var newRecord = new model({ Id: null });
		newRecord = store.add([newRecord])[0];

		var cellEditor;
		var plugins = grid.plugins;
		for (var i = 0, len = plugins.length; i < len; i++) {
			if (plugins[i] instanceof Ext.grid.plugin.CellEditing) {
				cellEditor = plugins[i];
				break;
			}
		}
		if (cellEditor) {
			var columns = grid.columns;
			for (var i = 0, len = columns.length; i < len; i++) {
				if (!columns[i].hidden && columns[i].getEditor(newRecord)) {
					if (cellEditor.startEdit(newRecord, columns[i])) {
						break;
					}
				}
			}
		}
	},

	onDelete: function () {
		var grid = this.grid;
		var record = grid.getSelectionModel().getSelection()[0];
		if (record) {
			Ext.Msg.confirm('Delete', 'Do you really want to delete this record ?', function (msg) {
				if (msg === 'yes') {
					grid.store.remove(record);
				}
			});
		}
	},

	onSave: function () {
		this.grid.getStore().sync();
	}
});
