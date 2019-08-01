Cooler.LocationVisitHistory = new Cooler.Form({
	keyColumn: 'VisitId',
	captionColumn: null,
	title: 'Visit History',
	controller: 'VisitHistory',
	quickSaveController: 'VisitHistory',
	securityModule: 'LocationVisitHistory',
	newListRecordData: { UserId: '', LocationId: 0 },
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'StopTime' } }
	},
	custom: {
		loadComboTypes: true
	},
	gridPlugins: [new DA.form.plugins.Inline()],
	comboTypes: [
		'User'
	],
	comboStores: {
		User: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	listRecord: Ext.data.Record.create([
		{ name: 'VisitId', type: 'int' },
		{ name: 'LocationId', type: 'int' },
		{ name: 'Date', type: 'date' },
		{ name: 'StartTime', type: 'date' },
		{ name: 'StopTime', type: 'date' },
		{ name: 'Notes', type: 'string' },
		{ name: 'UserId', type: 'int' },
		{ name: 'VisitBy', type: 'string' },
		{ name: 'StartLatitude', type: 'float' },
		{ name: 'StartLongitude', type: 'float' },
		{ name: 'EndLatitude', type: 'float' },
		{ name: 'EndLongitude', type: 'float' },
		{ name: 'Source', type: 'string' }
	]),

	cm: function () {
		var userCombo = DA.combo.create({ store: this.comboStores.User, allowBlank: false });
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Start Visit', dataIndex: 'StartTime', width: 170, editor: new Ext.ux.form.DateTime(), renderer: ExtHelper.renderer.DateTime },
			{ header: 'Stop Visit', dataIndex: 'StopTime', width: 170, editor: new Ext.ux.form.DateTime(), renderer: ExtHelper.renderer.DateTime },
			{ header: 'Visit By User', displayIndex: 'VisitBy', dataIndex: 'UserId', type: 'int', width: 140, renderer: ExtHelper.renderer.Combo(userCombo), editor: userCombo },
			{ header: 'Start Latitude', dataIndex: 'StartLatitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Start Longitude', dataIndex: 'StartLongitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'End Latitude', dataIndex: 'EndLatitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'End Longitude', dataIndex: 'EndLongitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			//{ header: 'Visit By User', dataIndex: 'VisitByUserId', type: 'int', width: 140, editor: new Ext.form.NumberField() },
			{ header: 'Notes', dataIndex: 'Notes', width: 200, editor: new Ext.form.TextField(), renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'Source', type: 'string', dataIndex: 'Source', align: 'left', width: 100 }
		]);
		return cm;
	},
	onGridCreated: function (grid) {
		grid.on('validateedit', this.onValidateEdit, this);
		this.on('afterQuickSave', this.onAfterQuickSave, this);
	},

	onAfterQuickSave: function () {
		this.grid.getStore().load();
	},

	onValidateEdit: function (e) {
		var field = e.field;
		var record = e.record;
		var grid = e.grid;
		var value = e.value;
		var row = e.row;
		var col = e.column;
		if (value) {
			switch (field) {
				case 'StartTime':
					var endTime = record.get('StopTime');
					record.set('Date', e.value);
					if (endTime) {
						if (value > endTime) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
				case 'StopTime':
					var startTime = record.get('StartTime');
					if (startTime) {
						if (value < startTime) {
							e.cancel = true;
							var cell = grid.getView().getCell(row, col);
							ExtHelper.ShowTip({ title: 'Error', text: "End time must be greater than Start time", showBy: cell });
							return false;
						}
					}
					break;
			}
		}
	}
});