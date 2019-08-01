Cooler.Brand = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'BrandId',
		captionColumn: 'BrandName',
		controller: 'Brand',
		securityModule: 'Brand',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel()
		}
	});
	Cooler.Brand.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Brand, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'BrandId', type: 'int' },
		{ name: 'ManufacturerId', type: 'int' },
		{ name: 'BrandName', type: 'string' },
		{ name: 'IsIncludeInSalesData', type: 'bool' },
		{ name: 'ManufacturerName', type: 'string' },
		{ name: 'ClientId', type: 'int' },
		{ name: 'Client', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' }
	]),
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Brand', dataIndex: 'BrandName', width: 200 },
			{ header: 'Manufacturer', dataIndex: 'ManufacturerName', width: 200 },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 150 },
			{ header: 'Is Included In Sales Data', dataIndex: 'IsIncludeInSalesData', type: 'bool', width: 150, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		return cm;
	},
	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var manufacturerCombo = DA.combo.create({ fieldLabel: 'Manufacturer', hiddenName: 'ManufacturerId', baseParams: { comboType: 'Manufacturer' }, listWidth: 180, controller: "Combo", allowBlank: false, disabled: disableFieldsOnClientId });
		var items = [
			{ xtype: 'textfield', fieldLabel: 'Brand', name: 'BrandName', maxLength: 100, width: 150, allowBlank: false },
			manufacturerCombo,
			DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId }),
			DA.combo.create({ fieldLabel: 'Include In Sales Data?', hiddenName: 'IsIncludeInSalesData', store: "yesno" })
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
			height: 130
		});
		this.formPanel = new Ext.FormPanel(config);

		this.on('dataLoaded', function (locationForm, data) {

			brandId = data.data.Id;
			if (brandId == 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
			}
			notesObj.SetAssociationInfo("Brand", brandId);
			attachmentObj.SetAssociationInfo("Brand", brandId);
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

Cooler.Brand = new Cooler.Brand();