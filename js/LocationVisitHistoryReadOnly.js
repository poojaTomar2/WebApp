Cooler.LocationVisitHistoryReadOnly = new Cooler.Form({
	controller: 'VisitHistory',
	keyColumn: 'VisitId',
	listTitle: 'Visit History',
	controller: 'VisitHistory',
	securityModule: 'LocationVisitHistory',
	disableAdd: true,
	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'StopTime' } }
	},

	hybridConfig: function () {
		return [
			{ header: 'Date', dataIndex: 'Date', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Start Visit', dataIndex: 'StartTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Stop Visit', dataIndex: 'StopTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Visit By User', displayIndex: 'VisitBy', dataIndex: 'VisitBy', type: 'string', width: 140 },
			{ header: 'Visit Duration', dataIndex: 'VisitDuration', width: 100, type: 'int' },
			{ header: 'Outlet', displayIndex: 'LocationName', dataIndex: 'LocationName', type: 'string', width: 140 },
			{ header: 'Start Latitude', dataIndex: 'StartLatitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Start Longitude', dataIndex: 'StartLongitude', type: 'float', width: 120, align: 'right', renderer: ExtHelper.renderer.Float(8) },
			{ header: 'Notes', dataIndex: 'Notes', width: 200, editor: new Ext.form.TextField(), renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 80 },
			{ header: 'Distance', type: 'int', dataIndex: 'Distance', align: 'right', width: 80 },
			{ header: 'Source', type: 'string', dataIndex: 'Source', align: 'left', width: 100 }
		];
	}

});