Ext.ns("Ext.ux.grid");

Ext.ux.grid.Tags = function (cfg) {
	Ext.apply(this, cfg);
};

Ext.ux.grid.Tags.prototype = {
	init: function (grid) {
		this.grid = grid;
		var cm = grid.getColumnModel();
		var colIndex = cm.findColumnIndex(this.dataIndex);
		cm.setRenderer(colIndex, this.tagRenderer);
		grid.on({
			'cellclick': this.onCellClick,
			'beforerender': this.onBeforeGridRender,
			scope: this
		});
		var store = grid.getStore();
		// We need to monitor data changed and load both
		store.on({
			scope: this,
			'beforeload': this.onStoreBeforeLoad,
			'datachanged': this.onStoreLoad,
			'load': this.onStoreLoad
		});
	},

	onBeforeGridRender: function (grid) {
		var tbar = grid.getTopToolbar();
		if (tbar) {
			var def = { text: 'Labels', scope: this };
			var menu = new Ext.menu.Menu({
				listeners: {
					beforeshow: this.onBeforeLabelMenuShow,
					scope: this
				}
			});
			def.menu = menu;
			if (typeof tbar.add == 'function') {
				tbar.add(def);
			} else {
				tbar.push(def);
			}
		}
	},

	labelsChanged: true,

	labels: [
		'Priority 1',
		'Priority 2'
	],

	onBeforeLabelMenuShow: function (menu) {
		var grid = this.grid;
		var sm = grid.getSelectionModel();
		if (!sm.hasSelection()) {
			Ext.Msg.alert('Labels - Error', 'No records selected');
			return false;
		}
		if (this.labelsChanged) {
			var labels = this.labels;
			var toAdd = [];
			for (var i = 0, len = labels.length; i < len; i++) {
				toAdd.push(new Ext.menu.CheckItem({ text: labels[i], hideOnClick: false }));
			}
			menu.removeAll();
			menu.add.apply(menu, toAdd);
			this.labelsChanged = false;
		}
	},

	onStoreBeforeLoad: function () {
		this.loaded = false;
	},

	onStoreLoad: function (store) {
		if (this.loaded) {
			return;
		}
		var tagData = store.reader.jsonData.Tags;
		var keyCol = this.keyColumn;
		for (var i = 0, len = store.getCount(); i < len; i++) {
			var record = store.getAt(i);
			var key = record.get(keyCol);
			if (tagData[key]) {
				record.json.tags = tagData[key];
			}
		}
		this.loaded = true;
	},

	tagRenderer: function (value, meta, record) {
		var tags = record.json.tags;
		var starClass = tags && tags.indexOf("*") > -1 ? 'starRed' : 'starGrey';
		return "<span class='" + starClass + "'>&nbsp;</span>" + value;
	},

	onCellClick: function (grid, rowIndex, colIndex, e) {
		var target = e.getTarget();
		var className = target.className;
		if (className.substr(0, 4) !== "star") {
			return;
		}
		var cm = grid.getColumnModel();
		var dataIndex = cm.getDataIndex(colIndex);
		if (dataIndex == this.dataIndex) {
			var store = grid.getStore();
			var record = store.getAt(rowIndex);
			var tags = record.json.tags;
			if (!tags) {
				tags = [];
				record.json.tags = tags;
			}
			var newTags = [].concat(tags);
			if (newTags.indexOf("*") > -1) {
				newTags.remove("*");
			} else {
				newTags.push("*");
			}
			this.updateTags({ grid: grid, record: record, businessObjectId: record.get(this.keyColumn), tags: newTags });
		}
	},

	updateTags: function (o) {
		var store = o.grid.getStore();
		var url = store.url || store.conn.url;
		Ext.Ajax.request({
			url: url,
			params: { action: 'UpdateTags', businessObjectId: o.businessObjectId, tags: o.tags.join(',') },
			callback: function (options, success, response) {
				var successful = false;
				if (success) {
					if (response.responseText) {
						var r = Ext.decode(response.responseText);
						if (r.success) {
							successful = true;
						}
					}
				}
				if (!successful) {
					Ext.Msg.alert('Update tags failed', 'There was an error.');
				} else {
					o.record.json.tags = o.tags;
					store.fireEvent("update", store, o.record, Ext.data.Record.EDIT);
				}
			}
		});
	}
};