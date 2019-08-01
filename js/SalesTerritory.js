Cooler.SalesTerritory = new Cooler.Form({

	formTitle: 'Sales Territory: {0}',

	keyColumn: 'SalesTerritoryId',

	controller: 'SalesTerritory',

	captionColumn: 'Name',

	title: 'Sales Territory',
	securityModule: 'Sales Territory',
	hybridConfig: function () {
		return [
			{ dataIndex: 'SalesTerritoryId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'Sales Territory Name', dataIndex: 'Name', type: 'string', width: 180 },
			{ header: 'Sales Territory Code', dataIndex: 'Code', type: 'string', width: 180 },
			{ header: 'Sales Group Name', dataIndex: 'SalesGroup', type: 'string', width: 180 },
			{ header: 'Sales Group Code', dataIndex: 'SalesGroupCode', type: 'string', width: 180 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 180 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Name', name: 'Name', xtype: 'textfield', maxLength: 100, allowBlank: false },
				{ fieldLabel: 'Code', name: 'Code', xtype: 'textfield', maxLength: 100, allowBlank: false },
				DA.combo.create({ fieldLabel: 'Sales Group Name', name: 'SalesGroupId', hiddenName: 'SalesGroupId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'SalesGroup' }, allowBlank: false }),
				DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, allowBlank: false })
			]
		});
		return config;
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