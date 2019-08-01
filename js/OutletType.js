Cooler.OutletType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		keyColumn: 'LocationTypeId',
		captionColumn: 'Name',
		formTitle: 'Trade Channel : {0}',
		controller: 'LocationType',
		securityModule: 'TradeChannel',
		listTitle: 'Trade Channel',
		logoUrl: './FileServer/Channel/',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel(),
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'LocationTypeId' } }
		},
		winConfig: { width: 600, height: 800 },
		comboTypes: ['Client']
	});
	Cooler.OutletType.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.OutletType, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'LocationTypeId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'Code', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'ClientName', type: 'string' },
		{ name: 'ClientId', type: 'int' }
	]),
	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Id', dataIndex: 'LocationTypeId', width: 50 },
			{ header: 'Trade Channel', dataIndex: 'Name', width: 200 },
			{ header: 'Trade Channel Code', dataIndex: 'Code', width: 150 },
			{ header: 'CoolerIot Client', dataIndex: 'ClientId', displayIndex: 'ClientName', store: this.comboStores.Client, renderer: 'proxy', width: 250 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		cm.defaultSortable = true;
		return cm;
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	createForm: function (config) {
		var logoField = new Ext.ux.Image({ height: 120, src: "" });
		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			name: 'selectFile'
		});
		this.logoField = logoField;
		this.uploadImage = uploadImage;
		var clientCombo = DA.combo.create({ fieldLabel: 'Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'Client' }, allowBlank: false });
		var col1 = {
			columnWidth: .7,
			defaults: {
				width: 250
			},
			items: [
				{ xtype: 'textfield', fieldLabel: 'Trade Channel', name: 'Name', maxLength: 100, allowBlank: false },
				{ xtype: 'textfield', fieldLabel: 'Trade Channel Code', name: 'Code', maxLength: 100, allowBlank: false },
				uploadImage,
				clientCombo
			]
		};
		var col2 = {
			columnWidth: .3,
			items: [
				logoField
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1, col2],
			fileUpload: true
		});
		this.clientCombo = clientCombo;
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
			height: 160
		});
		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', function (locationForm, data) {

			locationTypeId = data.data.Id;
			if (locationTypeId == 0) {
				notesGrid.setDisabled(true);
				attachmentGrid.setDisabled(true);
			}
			else {
				notesGrid.setDisabled(false);
				attachmentGrid.setDisabled(false);
			}
			notesObj.SetAssociationInfo("LocationType", locationTypeId);
			attachmentObj.SetAssociationInfo("LocationType", locationTypeId);
			notesGrid.loadFirst();
			attachmentGrid.loadFirst();
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, this.logoUrl + "/imageNotFound.png");
			}
			this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				ExtHelper.SetComboValue(this.clientCombo, clientId);
				this.clientCombo.setDisabled(true);
			}
		});
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 400,
			items: [this.formPanel, tabPanel]
		});

	}
});

Cooler.OutletType = new Cooler.OutletType();