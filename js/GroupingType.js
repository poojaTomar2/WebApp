Cooler.GroupingType = Ext.extend(Cooler.Form, {
	keyColumn: 'GroupingTypeId',
	captionColumn: 'GroupingTypeDescription',
	formTitle: 'Grouping Type : {0}',
	controller: 'GroupingType',
	listTitle: 'Grouping Type',
	securityModule: 'GroupingType',
	hybridConfig: function () {
		return [
			{ dataIndex: 'GroupingTypeId', type: 'int' },
			{ header: 'Grouping Type', dataIndex: 'GroupingTypeDescription', type: 'string', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	createForm: function (config) {
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Grouping Type', name: 'GroupingTypeDescription', xtype: 'textfield', maxLength: 100, allowBlank: false }
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
Cooler.GroupingType = new Cooler.GroupingType({ uniqueId: 'GroupingType' });