Cooler.Country = new Cooler.Form({

	formTitle: 'Country: {0}',

	keyColumn: 'CountryId',

	controller: 'Country',

	captionColumn: 'Country',

	title: 'Country',
	securityModule: 'Country',
	hybridConfig: function () {
		return [
			{ dataIndex: 'CountryId', type: 'int', header: 'Id', align: 'right' },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Country', name: 'Country', xtype: 'textfield', maxLength: 50, allowBlank: false }
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