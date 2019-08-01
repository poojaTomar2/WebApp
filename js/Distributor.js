Cooler.Distributor = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'DistributorId',
		captionColumn: null,
		controller: 'Distributor',
		quickSaveController: 'Distributor',
		gridPlugins: [new DA.form.plugins.Inline({
			comboFields: [],
			modifiedRowOptions: { fields: 'modified' },
			comboNameFieldSuffix: ''
		})],
		gridConfig: {
			listeners: {
				'cellclick': this.onListGridCellClick,
				scope: this
			}
		}
	});
	Cooler.Distributor.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Distributor, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'DistributorId', type: 'int' },
		{ name: 'DistributorName', type: 'string' }
	]),
	onListGridCellClick: function (grid, rowIndex) {
		var r = grid.getStore().getAt(rowIndex);
		var distributorId = r.get('DistributorId');
		this.notesGrid.setDisabled(distributorId === 0);
		this.attachmentGrid.setDisabled(distributorId === 0);
		this.notesObj.SetAssociationInfo("Distributor", distributorId);
		this.attachmentObj.SetAssociationInfo("Distributor", distributorId);

		if (distributorId != 0) {
			this.notesGrid.loadFirst();
			this.attachmentGrid.loadFirst();
		}
	},
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Distributor', dataIndex: 'DistributorName', width: 200, editor: new Ext.form.TextField({ allowBlank: false }) }
		]);
		return cm;
	},
	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});

		this.notesObj = new DA.Note();
		this.notesGrid = this.notesObj.createGrid();
		this.attachmentObj = new DA.Attachment();
		this.attachmentGrid = this.attachmentObj.createGrid({ title: 'Document' });

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [
				this.notesGrid,
				this.attachmentGrid
			],
			height: 200,
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
	}
});

Cooler.Distributor = new Cooler.Distributor();