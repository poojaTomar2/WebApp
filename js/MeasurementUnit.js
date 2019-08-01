Cooler.MeasurementUnit = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'MeasurementUnitTypeId',
		listTitle: 'Measurement Unit Types',
		formTitle: 'Measurement Unit Types: {0}',
		captionColumn: 'MeasurementUnit',
		controller: 'MeasurementUnitType',
		securityModule: 'MeasurementUnit',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel()
		}
	});
	Cooler.MeasurementUnit.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.MeasurementUnit, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'MeasurementUnitTypeId', type: 'int' },
		{ name: 'MeasurementUnit', type: 'string' }
	]),
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Measurement Unit', dataIndex: 'MeasurementUnit', width: 200 }
		]);
		return cm;
	},
	createForm: function (config) {
		var items = [
			{ xtype: 'textfield', fieldLabel: 'Measurement Unit', name: 'MeasurementUnit', maxLength: 100, width: 165, allowBlank: false }
		];
		Ext.apply(config, {
			defaults: { width: 150 },
			region: 'north',
			items: items
		});
		return config;
	},
	CreateFormPanel: function (config) {
		var notesObj = new DA.Note();
		var notesGrid = notesObj.createGrid();
		var attachmentObj = new DA.Attachment();
		var attachmentGrid = attachmentObj.createGrid({ title: 'Documents' });

		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			defaults: { layout: 'fit', border: false },
			items: [
				notesGrid,
                attachmentGrid
			]
		});

		Ext.apply(config, {
			region: 'north',
			height: 100
		});
		this.formPanel = new Ext.FormPanel(config);

		this.on('dataLoaded', function (locationForm, data) {

			measurementUnitId = data.data.Id;
			if (measurementUnitId == 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
			}
			notesObj.SetAssociationInfo("MeasurementUnit", measurementUnitId);
			attachmentObj.SetAssociationInfo("MeasurementUnit", measurementUnitId);
			notesGrid.loadFirst();
			attachmentGrid.loadFirst();
		});
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 400,
			items: [this.formPanel, tabPanel]
		});

	}
});

Cooler.MeasurementUnit = new Cooler.MeasurementUnit();