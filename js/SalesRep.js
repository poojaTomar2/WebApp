Cooler.SalesRep = new Cooler.Form({
	title: 'Sales Rep',
	keyColumn: 'LocationRepId',
	gridIsLocal: true,
	newListRecordData: { RepId: '', RoleId: '' },
	gridConfig: {
		plugins: [new Ext.grid.CheckColumn()]
	},

	hybridConfig: function () {
		var primaryField = new Ext.grid.CheckColumn({ header: 'Primary Sales Rep?', dataIndex: 'IsPrimary', type: 'bool' });
		var salesRepCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.SalesPerson, listWidth: 220, mode: 'local', allowBlank: false }),
		roleCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.Role, listWidth: 220, mode: 'local' });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'User', dataIndex: 'RepId', type: 'int', renderer: ExtHelper.renderer.Combo(salesRepCombo), editor: salesRepCombo, scope: this },
			{ header: 'Role', dataIndex: 'RoleId', type: 'int', renderer: ExtHelper.renderer.Combo(roleCombo) },
			primaryField
		];
	},

	onCellclick: function (grid, rowIndex, columnIndex) {
		var column = this.cm.config[columnIndex];
		var store = grid.getStore();
		var rec = store.getAt(rowIndex);
		if (column.dataIndex === 'IsPrimary') {
			store.each(function (record) {
				record.set('IsPrimary', false);
			});
			rec.set('IsPrimary', true);
			Cooler.Location.primaryRepId.setValue(rec.get('RepId'));
		}
	},

	loadStore: function (store) {
		var primaryRepId = Cooler.Location.primaryRepId.getValue();
		if (!Ext.isEmpty(primaryRepId)) {
			this.primaryRepId = primaryRepId
			store.each(function (record) {
				if (Number(this.primaryRepId) === record.get('RepId')) {
					record.set('IsPrimary', true);
					return;
				}
			}, this);
		}
	},

	onRemove: function (store, record) {
		if (record.get('IsPrimary')) {
			Cooler.Location.primaryRepId.setValue(0);
		}
	},

	onAfterEdit: function (e) {
		var record = e.record;
		var salesRepStore = Cooler.LocationType.Location.comboStores.SalesPerson;
		var repId = record.get('RepId');
		var customValue = salesRepStore.getById(repId).get('CustomValue');
		record.set('RoleId', customValue);
	},

	setAssociation: function (data) {
		this.newListRecordData = data
	},

	onGridCreated: function (grid) {
		grid.on('afterEdit', this.onAfterEdit, this);
		grid.on("cellclick", this.onCellclick, this); // To handle Check Column
		grid.store.on('load', this.loadStore, this);  // To set the primary Sales
		grid.store.on('remove', this.onRemove, this); // To handle if primary Sales Rep deleted
	}
});