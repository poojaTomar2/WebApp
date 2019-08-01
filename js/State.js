Cooler.State = new Cooler.Form({

	formTitle: 'State: {0}',

	keyColumn: 'StateId',

	captionColumn: 'State',

	controller: 'State',

	title: 'State',
	securityModule: 'State',
	hybridConfig: function () {
		return [
			{ dataIndex: 'StateId', type: 'int', header: 'Id', align: 'right' },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 150 },
			{ header: 'State', dataIndex: 'State', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', hiddenName: 'CountryId', baseParams: { comboType: 'Country' }, width: 200, listWidth: 180, controller: "Combo", allowBlank: false });
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				 countryCombo,
			     { fieldLabel: 'State', name: 'State', xtype: 'textfield', maxLength: 50, allowBlank: false }
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