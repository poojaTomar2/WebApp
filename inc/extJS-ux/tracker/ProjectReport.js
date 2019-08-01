DA.Tracker.ProjectReport = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Projects',
		listTitle: 'Projects',
		keyColumn: 'CompanyId',
		captionColumn: null,
		disableAdd: true,
		controller: 'Tracker_ProjectReport'
	});
	DA.Tracker.ProjectReport.superclass.constructor.call(this, config);
};
var ImageRendererClosed = function(v, m, r) {
		m.css += "closedTicket-icon";
};
var ImageRendererAll = function(v, m, r) {
		m.css += "allTicket-icon";
};

Ext.extend(DA.Tracker.ProjectReport, DA.Tracker.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'ProjectUserId', type: 'int' },
		{ name: 'Project', type: 'string' },
		{ name: 'ProjectId', type: 'int' }
	]),

	cm: function() {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Project', dataIndex: 'Project', width: 200 },
			{ header: 'All', dataIndex: 'All', width: 100, renderer: ImageRendererAll },
			{ header: 'Closed', dataIndex: 'Closed', width: 100, renderer: ImageRendererClosed }
        ]);

		return cm;
	},
	afterShowList: function(config) {
		this.grid.on('cellclick', function (grid, rowIndex, colIndex, e, options) { 
			var record = grid.getStore().getAt(rowIndex);
			var projectId = record.get('ProjectId');
			var cm = grid.getColumnModel();
			var colHeader = cm.getColumnHeader(colIndex);
			var ticketModule = DA.Tracker.ProjectTickets[projectId];
			if (!ticketModule) {
				ticketModule = new DA.Tracker.Ticket({ projectId: projectId, projectName: record.get('Project') });
				ticketModule.init();

				DA.Tracker.ProjectTickets[projectId] = ticketModule;
			}
			ticketModule.ShowList({}, { extraParams: { colHeader: colHeader} });
		});

	}
});

DA.Tracker.ProjectTickets = {};

DA.Tracker.ProjectReport = new DA.Tracker.ProjectReport();
