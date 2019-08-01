Cooler.ThirdPartyApp = new Cooler.Form({
	formTitle: 'ThirdPartyApp: {0}',
	keyColumn: 'ThirdPartyAppId',
	controller: 'ThirdPartyApp',
	captionColumn: 'ThirdPartyApp',
	title: 'Third Party App',
	securityModule: 'ThirdPartyApp',
	gridConfig: {
		defaults: { sort: { dir: 'ASC', sort: 'ThirdPartyAppId' } },
		custom: {
			loadComboTypes: true
		}
	},
	comboTypes: [
		'Client',
		'Country'
	],
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function (config) {
		return [
			{ dataIndex: 'ClientId', type: 'int' },
            { header: 'Application Id', type: 'int', dataIndex: 'ThirdPartyAppId' },
			{ header: 'Application Name', dataIndex: 'ApplicationName', type: 'string', width: 150 },
			{ header: 'Client ', dataIndex: 'ClientId', displayIndex: 'ClientName', type: 'int', store: this.comboStores.Client, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Countries ', dataIndex: 'CountryName', type: 'string' },
			{ header: 'Is Active', dataIndex: 'IsActive', renderer: ExtHelper.renderer.Boolean, width: 120, type: 'bool' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },

		];
	},
	createForm: function (config) {
		var responsibleforCountryIdForStore = DA.combo.create({ baseParams: { comboType: 'Country', limit: 0 }, listWidth: 250, controller: "Combo" });
		this.responsibleforCountryIdForStore = responsibleforCountryIdForStore;
		var responsibleforCountryIdCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Country',
			hiddenName: 'ResponsibleCountryIds',
			name: 'ResponsibleCountryIds',
			displayField: 'DisplayValue',
			store: responsibleforCountryIdForStore.getStore(),
			width: 180
		});
		this.responsibleforCountryIdCombo = responsibleforCountryIdCombo;

		var clientCombo = DA.combo.create({ fieldLabel: 'Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', allowBlank: false, listWidth: 250, baseParams: { comboType: 'Client' } });
		var isActive = DA.combo.create({ fieldLabel: 'Is Active', hiddenName: 'IsActive', store: "yesno" });
		var col1 = {
			columnWidth: 1,
			defaults: { width: 220, labelWidth: 102 },
			items: [
				{ fieldLabel: 'Application Name', name: 'ApplicationName', xtype: 'textfield', maxLength: 50, allowBlank: false },
				{ fieldLabel: 'App API Key', name: 'AppAPIKey', xtype: 'textfield', allowBlank: false },
				clientCombo,
				isActive,
				{ fieldLabel: 'Notes', name: 'Notes', xtype: 'textfield', allowBlank: false },
				this.responsibleforCountryIdCombo,
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1]
		});

		this.clientCombo = clientCombo;
		this.on('dataLoaded', function (consumerForm, data) {
			var record = data.data;
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.on('beforeSave', this.onBeforeSave, this);
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 400,
			height: 400,
			items: [this.formPanel]

		});
		this.on('beforeLoad', function (param) {
			this.responsibleforCountryIdForStore.getStore().load();
		});
	},
	onBeforeSave: function (ThirdPartyAppFrom, params, options) {
		var form = ThirdPartyAppFrom.formPanel.getForm();
	}
});