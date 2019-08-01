Cooler.LocationClassification = new Cooler.Form({

	formTitle: 'Customer Tier: {0}',

	keyColumn: 'LocationClassificationId',

	controller: 'LocationClassification',

	captionColumn: 'ClassificationName',

	securityModule: 'CustomerTier',

	title: 'Customer Tier',
	comboTypes: [
		'Client'
	],
	gridConfig: {
		custom: {
			loadComboTypes: true
		},
		defaults: { sort: { dir: 'DESC', sort: 'LocationClassificationId' } }
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'LocationClassificationId', type: 'int', width: 50 },
			{ header: 'Customer Tier Name', dataIndex: 'ClassificationName', type: 'string', width: 150 },
			{ header: 'Code', dataIndex: 'Code', type: 'string', width: 150 },
			{ header: 'CoolerIot Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var clientCombo = DA.combo.create({ fieldLabel: 'Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'Client' }, allowBlank: false });
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Customer Tier Name', name: 'ClassificationName', xtype: 'textfield', maxLength: 200, allowBlank: false },
				{ fieldLabel: 'Customer Tier Code', name: 'Code', xtype: 'textfield' },
				clientCombo

			]
		});
		this.clientCombo = clientCombo;
		return config;
	},

	CreateFormPanel: function (config) {

		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', function (assetForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId),
				clientCombo = assetForm.formPanel.items.get('clientCombo');
			if (clientId != 0) {
				ExtHelper.SetComboValue(clientCombo, clientId);
				clientCombo.setDisabled(true);
			}
		});
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 150,
			items: [this.formPanel]
		});

	}
});