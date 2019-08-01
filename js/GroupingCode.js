Cooler.GroupingCode = Ext.extend(Cooler.Form, {
	keyColumn: 'GroupingCodeId',
	captionColumn: 'GroupingCodeTypeDescription',
	formTitle: 'Grouping Code : {0}',
	controller: 'GroupingCode',
	listTitle: 'Grouping Code',
	securityModule: 'GroupingCode',
	hybridConfig: function () {
		return [
			{ dataIndex: 'GroupingCodeId', type: 'int' },
			{ header: 'Grouping Type', dataIndex: 'GroupingType', type: 'string' },
			{ header: 'Grouping Code Type', dataIndex: 'GroupingCodeTypeDescription', type: 'string', width: 150 },
			{ header: 'Group Code Value', dataIndex: 'GroupingCodeValue', type: 'int', align: 'right' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		];
	},
	createForm: function (config) {
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Grouping Code Type', name: 'GroupingCodeTypeDescription', xtype: 'textfield', maxLength: 1000, allowBlank: false },
				DA.combo.create({ fieldLabel: 'Grouping Type', itemId: 'groupingTypeCombo', name: 'GroupingTypeId', hiddenName: 'GroupingTypeId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'GroupingType' } }),
				{ fieldLabel: 'Grouping Code Value', name: 'GroupingCodeValue', xtype: 'numberfield', minValue: 1, maxvalue: 10, allowBlank: false }

			]
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 250,
			items: [this.formPanel]
		});
	}
});
Cooler.GroupingCode = new Cooler.GroupingCode({ uniqueId: 'GroupingCode' });