Cooler.ImageRecognitionContentStatus = Ext.extend(Cooler.Form, {
	formTitle: 'Image Recognition Content Status: {0}',
	listTitle: 'Image Recognition Content Status',
	keyColumn: 'ImageRecognitionContentStatusId',
	controller: 'ImageRecognitionContentStatus',
	securityModule: 'ImageRecognitionContentStatus',
	hybridConfig: function () {
		return [
			{ dataIndex: 'ImageRecognitionContentStatusId', type: 'int', header: 'id' },
			{ dataIndex: 'ImageRecognitionStatusText', type: 'string', header: 'Status' },
			{ dataIndex: 'DeleteFlag', type: 'bool', header: 'Delete Image?', renderer: ExtHelper.renderer.Boolean, width: 100 },
			{ dataIndex: 'ImageProcessFlag', type: 'bool', header: 'Process Image?', renderer: ExtHelper.renderer.Boolean, width: 100 },
			{ dataIndex: 'IsQualityBased', type: 'bool', header: 'Quality Based?', renderer: ExtHelper.renderer.Boolean, width: 100 }
		];
	},
	createForm: function (config) {
		var deleteFlagCombo = DA.combo.create({ fieldLabel: 'Delete Image?', hiddenName: 'DeleteFlag', store: "yesno", allowBlank: false });
		var imageProcessFlag = DA.combo.create({ fieldLabel: 'Process Image?', hiddenName: 'ImageProcessFlag', store: "yesno", allowBlank: false });
		var isQualityBased = DA.combo.create({ fieldLabel: 'Quality Based?', hiddenName: 'IsQualityBased', store: "yesno", allowBlank: false });
		Ext.apply(config, {
			defaults: { width: 150 },
			items: [
				{ fieldLabel: 'Status', name: 'ImageRecognitionStatusText', xtype: 'textfield', maxLength: 5000, allowBlank: false },
				deleteFlagCombo,
				imageProcessFlag,
				isQualityBased
			]
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 200,
			items: [this.formPanel]
		});
	}
});

Cooler.ImageRecognitionContentStatus = new Cooler.ImageRecognitionContentStatus({ uniqueId: 'ImageRecognitionContentStatus' })