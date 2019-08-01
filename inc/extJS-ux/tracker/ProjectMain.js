DA.Tracker.ProjectMain = function(config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Project Assignment: {0}',
		listTitle: 'Project Assignment',
		keyColumn: 'CompanyId',
		captionColumn: null,
		disableAdd: true,
		controller: 'Tracker_Project'
	});
	DA.Tracker.ProjectMain.superclass.constructor.call(this, config);
};

Ext.extend(DA.Tracker.ProjectMain, DA.Tracker.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'LookupId', type: 'int' },
		{ name: 'DisplayValue', type: 'string' },
		{ name: 'LookupTypeId', type: 'int' }
	]),

	cm: function() {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Projects', dataIndex: 'DisplayValue', width: 200 }
        ]);

		return cm;
	},

	projectUserGrid: undefined,
	configureListTab: function(config) {
		Ext.apply(this.grid, {
			region: 'center'
		});

		var projectId = 0;

		this.projectUserGrid = DA.Tracker.ProjectUser.createGrid({ plugins: [new Ext.ux.ComboLoader()], title: 'User', allowPaging: true, editable: true });
		Ext.apply(this.projectUserGrid, {
			region: 'south',
			height: 300
		});

		var userGrid = this.projectUserGrid;
		userGrid.getStore().on('add', function(store, records, index) {
			if (projectId == 0 || projectId == undefined) {
				store.removeAll();
				Ext.Msg.alert('Error', 'Select a project to add user');
				return;
			}
			store.suspendEvents();
			var record = store.getAt(index);
			record.set('ProjectId', projectId);
			store.resumeEvents();
		});

		// Disable applicant grid by default
		ExtHelper.DisableGrid(userGrid);
		var childGridStore = userGrid.getStore();
		childGridStore.baseParams.ProjectId = 0;

		// On load of main grid, select first row
		this.grid.getStore().on('load', function(store, records, options) {
			if (records.length == 0) {
				ExtHelper.DisableGrid(userGrid);
			}
			else {
				ExtHelper.EnableGrid(userGrid);
			}
		});

		// On selection of row in the main grid, reload the child grid
		this.grid.on('rowclick', function(grid, rowIndex, e) {
			var record = grid.getStore().getAt(rowIndex);
			if (childGridStore.baseParams.ProjectId != record.get("LookupId")) {
				childGridStore.baseParams.ProjectId = record.get("LookupId");
				ExtHelper.EnableGrid(userGrid);
				userGrid.loadFirst();
				projectId = record.get('LookupId');
			}
		});

		config.layout = 'border';
		config.items.push(this.projectUserGrid);

		return config;
	}
});

DA.Tracker.ProjectMain = new DA.Tracker.ProjectMain();
	
