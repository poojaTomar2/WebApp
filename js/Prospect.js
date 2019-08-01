Cooler.Prospect = new Cooler.Form({
	controller: 'Prospect',

	keyColumn: 'ProspectId',

	listTitle: 'Prospect',

	disableAdd: true,

	securityModule: 'Prospect',

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ProspectId' } }
	},

	hybridConfig: function () {
		return [
			{ header: 'Prospect Id', dataIndex: 'ProspectId', type: 'int' },
			{ dataIndex: 'ImageCount', type: 'int' },
			{ header: 'Prospect Date', dataIndex: 'ProspectDateTime', type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Reported By', dataIndex: 'Consumer', type: 'string', width: 80 },
			{ header: 'Contact Name', dataIndex: 'ContactName', type: 'string', width: 150 },
			{ header: 'Contact Number', dataIndex: 'ContactNumber', type: 'int', width: 150 },
			{ header: 'Status', dataIndex: 'Status', type: 'string', width: 120 },
			{ header: 'Outlet Name', dataIndex: 'OutletName', type: 'string', width: 120 },
			{ header: 'Contact Address', dataIndex: 'ContactAddress', type: 'string', width: 200 },
			{ header: 'Note', dataIndex: 'Note', type: 'string', width: 180 },
			{ header: 'Prospect Image', dataIndex: 'ProspectId', renderer: this.prospectImageRenderer, sortable: false },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 80 }
			

		];
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});

		var prospectDetailGrid = Cooler.ProspectDetail.createGrid({ disabled: true });
		this.prospectDetailGrid = prospectDetailGrid;

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: prospectDetailGrid,
			height: 450,
			split: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
		grid.on("rowdblclick", this.onProspectClick, this);
	},

	onGridCellclick: function (grid, rowIndex, e) {
		var row = grid.getStore().getAt(rowIndex);
		var prospectId = row.get('ProspectId');
		if (this.prospectId && this.prospectId === prospectId) {
			return false;
		}
		this.prospectDetailGrid.getStore().baseParams.ProspectId = prospectId;
		this.prospectDetailGrid.getStore().load();
		this.prospectDetailGrid.setDisabled(false);
	},

	prospectImageRenderer: function (value, model, record) {
		var data = record.data;
		var returnHtml = '';
		if (data.ImageCount > 0) {
			returnHtml += '<div class="alertIssues-div-container">';
			returnHtml += '<img src="./FileServer/Prospect/' + record.get('ProspectId') + '.png" onerror="this.style.display=\'none\';" class="alertIssues-image"/>';
			returnHtml + '</div>';
		}
		return returnHtml;
	},

	onProspectClick: function (grid, rowIndex, e, options) {
		var store = grid.getStore(),
		 record = store.getAt(rowIndex);
		var prospectId = record.get('ProspectId');
		var imagePath = './FileServer/Prospect/';
		if (record.data.ImageCount != 0) {
			Cooler.ShowMultiImageWindow(record.data.ImageCount, record, imagePath, prospectId);
		}
	}
});