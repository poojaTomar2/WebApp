Cooler.Route = new Cooler.Form({
	title: 'Sales Rep Route',
	keyColumn: 'RouteId',
	gridIsLocal: true,
	newListRecordData: { UserId: '', Day: '' },

	hybridConfig: function () {
		var salesRepCombo = DA.combo.create({ store: Cooler.LocationType.Location.comboStores.SalesPerson, listWidth: 220, mode: 'local' }),
			weekDayCombo = DA.combo.create({ store: 'weekday', mode: 'local', allowBlank: false });
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ header: 'Sales Rep', dataIndex: 'UserId', type: 'int', renderer: ExtHelper.renderer.Combo(salesRepCombo), editor: salesRepCombo, scope: this },
			{ header: 'Day', dataIndex: 'Day', type: 'int', editor: weekDayCombo }
		];
	},
	setAssociation: function (data) {
		this.newListRecordData = data;
	}
});