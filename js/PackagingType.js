Cooler.PackagingType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'PackagingTypeId',
		listTitle: 'Packaging Types',
		captionColumn: 'PackagingTypeName',
		controller: 'PackagingType',
		securityModule: 'PackagingType',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel()
		}
	});
	Cooler.PackagingType.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.PackagingType, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'PackagingTypeId', type: 'int' },
		{ name: 'PackagingTypeName', type: 'string' },
		{ name: 'ConsumptionType', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' }
	]),
	
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Packaging Type', dataIndex: 'PackagingTypeName', width: 200, editor: new Ext.form.TextField({ allowBlank: false }) },
			{ header: 'Consumption Type', dataIndex: 'ConsumptionType' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		return cm;
	},
	createForm: function (config) {
		consumptionType = DA.combo.create({ fieldLabel: 'Consumption Type', name: 'ConsumptionTypeId', hiddenName: 'ConsumptionTypeId', controller: 'combo', baseParams: { comboType: 'ConsumptionType' }, listWidth: 220 });
		var items = [
			{ xtype: 'textfield', fieldLabel: 'Packaging Type', name: 'PackagingTypeName', maxLength: 100, width: 165, allowBlank: false },
			consumptionType
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

			packagingId = data.data.Id;
			if (packagingId == 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
			}
			notesObj.SetAssociationInfo("PackagingType", packagingId);
			attachmentObj.SetAssociationInfo("PackagingType", packagingId);
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

Cooler.PackagingType = new Cooler.PackagingType();