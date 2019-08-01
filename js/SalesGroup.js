Cooler.SalesGroup = new Cooler.Form({

	formTitle: 'Sales Group: {0}',

	keyColumn: 'SalesGroupId',

	controller: 'SalesGroup',

	captionColumn: 'Name',

	title: 'Sales Group',
	securityModule: 'Sales Group',
	hybridConfig: function () {
		return [
			{ dataIndex: 'SalesGroupId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Sales Group Name', dataIndex: 'Name', type: 'string', width: 180 },
			{ header: 'Sales Group Code', dataIndex: 'Code', type: 'string', width: 180 },
			{ header: 'Sales Office Name', dataIndex: 'SalesOffice', type: 'string', width: 180 },
			{ header: 'Sales Office Code', dataIndex: 'SalesOfficeCode', type: 'string', width: 180 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 180 },
			{ dataIndex: 'SalesTerritoryCount', type: 'int' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		this.on('dataLoaded', this.onDataLoaded, this);
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Name', name: 'Name', xtype: 'textfield', maxLength: 100, allowBlank: false },
				{ fieldLabel: 'Code', name: 'Code', xtype: 'textfield', maxLength: 100, allowBlank: false },
				DA.combo.create({ fieldLabel: 'Sales Office Name', name: 'SalesOfficeId', hiddenName: 'SalesOfficeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'SalesOffice' }, allowBlank: false }),
				DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, allowBlank: false })
			]
		});
		return config;
	},

	onDataLoaded: function (form, data) {
		if (data.data.Id != 0 && this.grid.getSelectionModel() && this.grid.getSelectionModel().selections && this.grid.getSelectionModel().selections.getCount() != 0) {
			var selectedRecord = this.grid.getSelectionModel().selections.get(0);
			form.formButtons.del.setDisabled(selectedRecord.get('SalesTerritoryCount') > 0);
		}
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 150,
			items: [this.formPanel]
		});
	}
});