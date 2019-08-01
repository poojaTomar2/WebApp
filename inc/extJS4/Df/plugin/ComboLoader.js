Ext.define('Df.plugin.ComboLoader', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.comboloader',
	init: function (grid) {
		this.grid = grid;
		grid.store.on({
			'beforeload': this.onBeforeLoad,
			'load': this.onLoad,
			scope: this
		});
	},

	destroy: function() {
		delete this.grid;
	},

	onBeforeLoad: function (store) {
		var grid = this.grid;
		var comboTypes = [];
		var columns = grid.columns;
		var store, stores = this.getComboStores();
		for (var i = 0, len = stores.length; i < len; i++) {
			store = stores[i];
			var comboType = store.comboType;
			if (comboType && comboTypes.indexOf(comboType) === -1) {
				comboTypes.push(comboType);
			}
		}
		store = grid.getStore();
		if (comboTypes.length > 0) {
			var toLoad = [];
			for (var i = 0, len = comboTypes.length; i < len; i++) {
				toLoad.push({ type: comboTypes[i], loaded: false });
			}
			store.getProxy().setExtraParam('comboTypes', Ext.encode(toLoad));
		} else {
			store.getProxy().setExtraParam('comboTypes', null);
		}
	},

	getComboStores: function () {
		var grid = this.grid;
		var columns = grid.columns;
		var store;
		var stores = [];
		for (var i = 0, len = columns.length; i < len; i++) {
			var column = columns[i];
			store = column.store;
			if (!store) {
				var editor = column.getEditor(null);
				if (editor && editor.store) {
					store = editor.store;
				}
			}
			if (store && store.comboType) {
				stores.push(store);
			}
		}
		return stores;
	},

	onLoad: function (store, records, success) {
		if (!success) {
			return;
		}
		var reader = store.getProxy().getReader();
		var rawData = reader.rawData;
		var comboData = rawData.combos;
		if (comboData) {
			var store, stores = this.getComboStores();
			for (var i = 0, len = stores.length; i < len; i++) {
				var store = stores[i];
				var data = comboData[store.comboType];
				if (data) {
					store.loadData(data);
				}
			}
		}
		var grid = this.grid;
		if (grid.rendered) {
			grid.getView().refresh();
		}
	}
});
