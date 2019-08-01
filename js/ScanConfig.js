Cooler.ScanConfig = new Cooler.Form({
	keyColumn: 'ScanConfigId',
	captionColumn: 'Name',
	controller: 'ScanConfig',
	title: 'Scan Config',
	securityModule: 'ScanConfig',
	hybridConfig: function () {
		return [
			{ dataIndex: 'ScanConfigId', type: 'int' },
			{ header: 'Name', dataIndex: 'Name', type: 'string', width: 150 },
			{ header: 'Manufacturer UUID', dataIndex: 'ManufacturerUUID', type: 'string', width: 250 },
			{ header: 'UUIDs', dataIndex: 'ServiceUUID', type: 'string', width: 250 },
			{ header: 'Mac Prefix', dataIndex: 'MacPrefix', type: 'string', width: 100 },
			{ header: 'Device Type', dataIndex: 'SmartDeviceTypeName', type: 'string', width: 100 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]
	},

	createForm: function (config) {
		var deviceTypeCombo = DA.combo.create({ fieldLabel: 'Device Type', name: 'SmartDeviceTypeId', hiddenName: 'SmartDeviceTypeId', mode: 'local', store: Cooler.comboStores.SmartDeviceType, width: 150, allowBlank: false });
		Ext.apply(config, {
			items: [
				{ fieldLabel: 'Name', name: 'Name', width: 100, maxLength: 500, allowBlank: false, xtype: 'textfield' },
				{ fieldLabel: 'Manufacturer UUID', name: 'ManufacturerUUID', width: 250, maxLength: 1000, allowBlank: false, xtype: 'textarea' },
				{ fieldLabel: 'UUIDs', name: 'ServiceUUID', width: 250, maxLength: 1000, allowBlank: false, xtype: 'textarea' },
				{ fieldLabel: 'Mac Prefix', name: 'MacPrefix', width: 100, maxLength: 50, allowBlank: false, xtype: 'textfield' },
				deviceTypeCombo
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 400,
			height: 270,
			items: [this.formPanel]
		});
	}
});