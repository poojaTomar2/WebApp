// Grid Panel apply state fixes for hidden/ grouping
Ext.grid.GridPanel.override({
	applyState: function (state) {
		var cm = this.colModel;
		var cs = state.columns;
		if (cs) {
			cm.suspendEvents();
			for (var i = 0, len = cs.length; i < len; i++) {
				var s = cs[i];
				var c = cm.getColumnById(s.id);
				if (c) {
					c.hidden = s.hidden;
					c.width = s.width;
					var oldIndex = cm.getIndexById(s.id);
					if (oldIndex != i) {
						cm.moveColumn(oldIndex, i);
					}
				}
			}
			cm.resumeEvents();
		}
		if (state.sort) {
			this.store[this.store.remoteSort ? 'setDefaultSort' : 'sort'](state.sort.field, state.sort.direction);
			this.store.setSortState(state.sort);
		}
		if (state.group && this.store.groupBy) {
			this.store.groupBy(state.group);
		}
	},
	getState: function () {
		var o = { columns: [] };
		for (var i = 0, c; c = this.colModel.config[i]; i++) {
			o.columns[i] = {
				id: c.id,
				width: c.width
			};
			if (c.hidden) {
				o.columns[i].hidden = true;
			}
		}
		var ss = this.store.getSortState();
		if (ss) {
			o.sort = ss;
		}
		if (this.store.getGroupState) {
			var gs = this.store.getGroupState();
			if (gs) {
				o.group = gs;
			}
		}
		return o;
	}
});

if (Ext.version < "3") {
	Ext.Component.override({
		saveState: function() {
			if (this.stateful && Ext.state.Manager) {
				var state = this.getState();
				if (this.fireEvent('beforestatesave', this, state) !== false) {
					Ext.state.Manager.set(this.stateId || this.id, state);
					this.fireEvent('statesave', this, state);
				}
			}
		}
	});
}