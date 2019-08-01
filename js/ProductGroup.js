Cooler.ProductGroup = new Cooler.Form({

	formTitle: 'Product Group: {0}',

	keyColumn: 'ProductGroupId',

	controller: 'ProductGroup',

	captionColumn: 'GroupName',

	title: 'Product Group',
	securityModule: 'ProductGroup',
	hybridConfig: function () {
		return [
			{ dataIndex: 'ProductGroupId', type: 'int' },
			{ header: 'Group Name', dataIndex: 'GroupName', type: 'string', width: 150 },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', hiddenName: 'ClientId', baseParams: { comboType: 'Client' }, listWidth: 230, controller: "Combo", disabled: DA.Security.info.Tags.ClientId != 0 });
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Group Name', name: 'GroupName', xtype: 'textfield', allowBlank: false, maxLength: 150 },
				clientCombo
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 120,
			items: [this.formPanel]
		});
	}
});