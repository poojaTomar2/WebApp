Cooler.SurveyTag = new Cooler.Form({

	formTitle: 'Survey Tag: {0}',

	keyColumn: 'SurveyTagId',

	controller: 'SurveyTag',

	captionColumn: 'Tag',

	title: 'Survey Tag',
	SecurityModule: 'SurveyTag',
	comboStores: {
		SurveyTagType: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'SurveyTagId', type: 'int' },
			{ dataIndex: 'TagTypeId', type: 'int' },
			{ header: 'Tag', dataIndex: 'Tag', type: 'string', width: 150 },
			{ header: 'Tag Type', dataIndex: 'TagType', type: 'string', width: 150 },
			{ dataIndex: 'ClientId', type: 'int' },
			{ header: 'CoolerIoT Client', dataIndex: 'ClientName', type: 'string', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var tagTypeCombo = DA.combo.create({ fieldLabel: 'Tag Type', name: 'TagTypeId', hiddenName: 'TagTypeId', mode: 'local', store: this.comboStores.SurveyTagType, allowBlank: false });
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Tag', name: 'Tag', xtype: 'textfield', maxLength: 200, allowBlank: false, vtype: 'englishCharacters' },
				tagTypeCombo,
				DA.combo.create({ fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId })
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