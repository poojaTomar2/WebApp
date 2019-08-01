Cooler.Manufacturer = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'ManufacturerId',
		captionColumn: 'ManufacturerName',
		formTitle: 'Manufacturer: {0}',
		controller: 'Manufacturer',
		securityModule: 'Manufacturer',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel()
		},
		winConfig: { width: 600, height: 800 }
	});
	Cooler.Manufacturer.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Manufacturer, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'ManufacturerId', type: 'int' },
		{ name: 'ManufacturerName', type: 'string' },
		{ name: 'IsForeign', type: 'bool' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'ClientId', type: 'int' },
		{ name: 'Client', type: 'string' },
		{ name: 'WebAddress', type: 'string' }
	]),
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Manufacturer', dataIndex: 'ManufacturerName', width: 150 },
			{ header: 'Is Foreign ?', dataIndex: 'IsForeign', width: 80, renderer: ExtHelper.renderer.Boolean },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ header: 'Website Address', dataIndex: 'WebAddress', type: 'string', width: 150, hyperlinkAsDoubleClick: true }
		]);
		cm.defaultSortable = true;
		return cm;
	},
	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var items = [
			{ xtype: 'textfield', fieldLabel: 'Manufacturer', name: 'ManufacturerName', maxLength: 100, width: 165, allowBlank: false },
			{ xtype: 'checkbox', fieldLabel: 'Is Foreign ?', name: 'IsForeign' },
			DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId }),
			{ xtype: 'textfield', fieldLabel: 'Website Address', name: 'WebAddress', maxLength: 100, width: 165, vtype: 'url' }
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
			height: 150
		});
		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', function (locationForm, data) {

			manufacturerId = data.data.Id;
			if (manufacturerId == 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
			}
			notesObj.SetAssociationInfo("Manufacturer", manufacturerId);
			attachmentObj.SetAssociationInfo("Manufacturer", manufacturerId);
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

Cooler.Manufacturer = new Cooler.Manufacturer();