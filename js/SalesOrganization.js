Cooler.SalesOrganization = new Cooler.Form({

	formTitle: 'Sales Organization: {0}',

	keyColumn: 'SalesOrganizationId',

	controller: 'SalesOrganization',

	captionColumn: 'Name',

	title: 'Sales Organization',
	securityModule: 'Sales',
	hybridConfig: function () {
		return [
			{ dataIndex: 'SalesOrganizationId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ header: 'Sales Organization Name', dataIndex: 'Name', type: 'string', width: 180 },
			{ header: 'Sales Organization Code', dataIndex: 'Code', type: 'string', width: 180 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 180 },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 180 },
			{ dataIndex: 'SalesOfficeCount', type: 'int' },
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
				DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, allowBlank: false }),
				DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220 })
			]
		});
		return config;
	},

	onDataLoaded: function (form, data) {
		if (data.data.Id != 0 && this.grid.getSelectionModel() && this.grid.getSelectionModel().selections && this.grid.getSelectionModel().selections.getCount() != 0) {
			var selectedRecord = this.grid.getSelectionModel().selections.get(0);
			form.formButtons.del.setDisabled(selectedRecord.get('SalesOfficeCount') > 0);
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