Cooler.AdminLog = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'AdminLogId',
		listTitle: 'Admin Logs',
		captionColumn: null,
		controller: 'AdminLog',
		securityModule: 'AdminLogs',
		gridConfig: {
			defaults: { sort: { dir: 'DESC', sort: 'AdminLogId' } },
			autoRefreshInterval: 5 * 1000 //5 seconds
		},
		disableAdd: true
	});
	Cooler.AdminLog.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.AdminLog, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'AdminLogId', type: 'int' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'Data', type: 'string' },
		{ name: 'EventTypeId', type: 'int' },
		{ name: 'EventType', type: 'string' },
		{ name: 'IPAddress', type: 'string' }
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Event Type', dataIndex: 'EventType', width: 120 },
			{ header: 'Data', dataIndex: 'Data', width: 250, renderer: ExtHelper.renderer.ToolTip() },
			{ header: 'IP Address', dataIndex: 'IPAddress', width: 120, renderer: ExtHelper.renderer.ToolTip() }
		]);
		return cm;
	}
});

Cooler.AdminLog = new Cooler.AdminLog();