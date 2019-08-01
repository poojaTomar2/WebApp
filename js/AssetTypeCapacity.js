Cooler.AssetTypeCapacity = new Cooler.Form({
	controller: 'AssetTypeCapacity',

	title: 'Asset Type Capacity',

	captionColumn: 'AssetTypeCapacity',

	securityModule: 'AssetTypeCapacity',

	hybridConfig: [
		{ dataIndex: 'AssetTypeCapacityId', type: 'int' },
		{ header: 'Range', dataIndex: 'Range', type: 'string', width: 150 },
		{ header: 'Average Capacity', dataIndex: 'AverageCapacity', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Min Capacity', dataIndex: 'MinCapacity', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Max Capacity', dataIndex: 'MaxCapacity', type: 'float', align: 'right', renderer: ExtHelper.renderer.Float(2) },
		{ header: 'Door Open Target', dataIndex: 'DoorOpenTarget', type: 'int', align: 'right' },
		{ header: 'Sales Target', dataIndex: 'SalesTarget', type: 'int', align: 'right' },
		{ header: 'Client', type: 'string', dataIndex: 'Client', width: 150 },
		{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
		{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
		{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
		{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
	],

	createForm: function (config) {
		var clientCombo = DA.combo.create({
			fieldLabel: 'CoolerIoT Client', itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 200, allowBlank: false,
			baseParams: { comboType: 'Client' }, listeners: {
				blur: Cooler.changeTimeZone,
				scope: this
			}
		});
		var items = [
			{ fieldLabel: 'Range', name: 'Range', xtype: 'textfield', allowBlank: false },
			{ fieldLabel: 'Average Capacity', name: 'AverageCapacity', xtype: 'numberfield', allowDecimals: true, allowBlank: false },
			{ fieldLabel: 'Min Capacity', name: 'MinCapacity', xtype: 'numberfield', allowDecimals: true, allowBlank: false },
			{ fieldLabel: 'Max Capacity', name: 'MaxCapacity', xtype: 'numberfield', allowDecimals: true, allowBlank: false },
			{ fieldLabel: 'Door Open Target', name: 'DoorOpenTarget', xtype: 'numberfield', allowDecimals: false, allowBlank: false },
			{ fieldLabel: 'Sales Target', name: 'SalesTarget', xtype: 'numberfield', allowDecimals: false, allowBlank: false },
			clientCombo,
		]

		Ext.apply(config, {
			defaults: { width: 200 },
			region: 'north',
			items: items
		});

		return config;
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 350,
			height: 230,
			items: [this.formPanel]
		});

		this.on('dataLoaded', function (assetTypeCapacityForm, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId),
			clientCombo = assetTypeCapacityForm.formPanel.items.get('clientCombo');
			if (clientId != 0) {
				ExtHelper.SetComboValue(clientCombo, clientId);
				clientCombo.setDisabled(true);
			}
			if (this.tagsPanel) {
				this.loadTags(this.tagsPanel, data);
			}
			//this.loadTags(this.tagsPanel, data);
		});
	}
});