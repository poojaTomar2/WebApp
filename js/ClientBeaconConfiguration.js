Cooler.ClientBeaconConfiguration = new Cooler.Form({
	controller: 'ClientBeaconConfiguration',

	keyColumn: 'ClientBeaconConfigId',

	listTitle: 'Client Beacon Configuration',

	securityModule: 'ClientBeaconConfiguration',

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ClientBeaconConfigId' } }
	},

	comboTypes: ['Client'],

	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},

	winConfig: {
		height: 200,
		width: 500
	},

	constructor: function (config) {
		Cooler.ClientBeaconConfiguration.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'DESC', sort: 'ClientBeaconConfigId' } }
		});
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ClientBeaconConfigId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int', width: 150 },
			{ dataIndex: 'ClientName', type: 'string', width: 150, header: 'Client Name' },
			{ header: 'iBeacon Uuid', dataIndex: 'IBeaconUuid', width: 250, type: 'string', },
			{ header: 'Eddystone Namespace', dataIndex: 'EddystoneNamespace', width: 250, type: 'string' },
			{ header: 'iBeacon Major', dataIndex: 'IBeaconMajor', type: 'int', width: 100, align: 'right' }
		];
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		var ClientBeaconConfigDetailGrid = Cooler.ClientBeaconConfigDetail.createGrid({ disabled: true });
		this.ClientBeaconConfigDetailGrid = ClientBeaconConfigDetailGrid;

		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [ClientBeaconConfigDetailGrid],
			height: 450,
			split: true
		});

		Ext.apply(config, {
			layout: 'border',
			defaults: {
				border: false
			},
			items: [this.grid, south]
		});

		return config;
	},

	onGridCreated: function (grid) {
		grid.on("cellclick", this.onGridCellclick, this);
	},

	onGridCellclick: function (grid, rowIndex, e) {
		var row = grid.getStore().getAt(rowIndex);
		var clientBeaconConfigId = row.get('ClientBeaconConfigId');
		grid = this.ClientBeaconConfigDetailGrid;
		if (grid) {
			var store = grid.getStore();
			store.baseParams.ClientBeaconConfigId = clientBeaconConfigId;
			store.load();
			this.ClientBeaconConfigDetailGrid.setDisabled(false);
		}
	},

	onAddclientBeaconConfigDetail: function (deviceCount) {
		var grid = this.grid.getSelectionModel().getSelected().data;
		var clientBeaconConfigId = grid.ClientBeaconConfigId;
		Ext.Ajax.request({
			url: EH.BuildUrl('ClientBeaconConfiguration'),
			params: {
				action: 'onAddClientBeaconConfigDetail',
				clientBeaconConfigId: clientBeaconConfigId,
				deviceCount: deviceCount
			},
			success: function (v, m, r) {
				Cooler.ClientBeaconConfigDetail.deviceCountField.setValue('');
				Cooler.ClientBeaconConfigDetail.mask.hide();
				var data = Ext.decode(v.responseText);
				if (data.success == true) {
					Cooler.ClientBeaconConfigDetail.grid.store.reload();
					Ext.Msg.alert('Success', data.msg);
				} else {
					Ext.Msg.alert('Error', data.msg);
				}
			},
			failure: function () {
				Cooler.ClientBeaconConfigDetail.deviceCountField.setValue('');
				Cooler.ClientBeaconConfigDetail.mask.hide();
				Ext.Msg.alert('Error', 'An error occured while fetching configuration');
			},
			scope: this
		});
	},

	createForm: function (config) {
		var clientIotCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 220, allowBlank: false });
		this.clientIotCombo = clientIotCombo;
		Ext.apply(config, {
			layout: 'form',
			defaults: { layout: 'form', border: false, width: 150, },
			items: [
				clientIotCombo,
				{ fieldLabel: 'iBeaconUuid', name: 'IBeaconUuid', id: 'IBeaconUuid', xtype: 'textfield', width: 250, regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', maxLength: 32, allowBlank: false },
				{ fieldLabel: 'Eddystone Namespace', name: 'EddystoneNamespace', id: 'EddystoneNamespace', width: 250, xtype: 'textfield', regex: new RegExp('^[0-9A-Fa-f]+$'), regexText: 'Only hex values are allowed', maxLength: 20, allowBlank: false },
				{ fieldLabel: 'iBeaconMajor', name: 'IBeaconMajor', id: 'IBeaconMajor', xtype: 'numberfield', maxLength: 20, allowBlank: false, minValue: 1, maxValue: 65535 }
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		this.on('dataLoaded', function (v, data) {
			var record = data.data;
			this.clientIotCombo.setDisabled(parseInt(DA.Security.info.Tags.ClientId) != 0);
			if (data.data.Id > 0) {
				Ext.getCmp('IBeaconUuid').setDisabled(true);
				Ext.getCmp('EddystoneNamespace').setDisabled(true);
				Ext.getCmp('IBeaconMajor').setDisabled(true);
				this.clientIotCombo.setDisabled(true);
			}
			else {
				Ext.getCmp('IBeaconUuid').setDisabled(false);
				Ext.getCmp('EddystoneNamespace').setDisabled(false);
				Ext.getCmp('IBeaconMajor').setDisabled(false);
				this.clientIotCombo.setDisabled(false);
			}
		});
		this.on('beforeSave', this.onBeforeSave, this);
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 500,
			height: 200,
			items: [this.formPanel]
		});
	},
	onBeforeSave: function (ClientConfigurationFrom, params, options) {
		//FOR NEW VALUES SELECTED BY USERS
		var form = ClientConfigurationFrom.formPanel.getForm();
		var iBeaconUuid = form.findField('IBeaconUuid').getValue();
		var iBeaconMajor = form.findField('IBeaconMajor').getValue();
		var eddystoneNamespace = form.findField('EddystoneNamespace').getValue();

		if ((iBeaconUuid == "636f6b65000000000000634063656575" || iBeaconUuid == "68F8C9EFAEF9482D987F3752F1C51DA1") && (iBeaconMajor < 11)) {
			Ext.Msg.alert("Error","Please set ibeacon major greater than 10");
			return false;
		}

	}
});

Cooler.ClientBeaconConfigDetail = new Cooler.Form({
	controller: 'ClientBeaconConfigDetail',

	keyColumn: 'ClientBeaconConfigDetailId',

	listTitle: 'Client Beacon Config Detail',

	disableAdd: true,

	gridConfig: {
		defaults: { sort: { dir: 'DESC', sort: 'ClientBeaconConfigDetailId' } }
	},

	hybridConfig: function () {
		return [
			{ dataIndex: 'ClientBeaconConfigDetailId', type: 'int' },
			{ dataIndex: 'ClientBeaconConfigId', type: 'int' },
			{ header: 'iBeaconUuid', dataIndex: 'IBeaconUuid', type: 'string', width: 250 },
			{ header: 'Eddystone Namespace', dataIndex: 'EddystoneNamespace', type: 'string', width: 250 },
			{ header: 'Eddystone UID', dataIndex: 'EddystoneUid', type: 'string', width: 250 },
			{ header: 'iBeacon Major', dataIndex: 'IBeaconMajor', type: 'int' },
			{ header: 'iBeacon Minor', dataIndex: 'IBeaconMinor', type: 'int' },
			{ header: 'Assigned?', dataIndex: 'Assigned', type: 'bool', renderer: ExtHelper.renderer.Boolean }
		];
	},

	beforeGridCreate: function (config, plugin, overrideConfig) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.deviceCountField = new Ext.form.NumberField({ minValue: 1, maxValue: 65535, width: 100 });
		tbarItems.push('Device Count');
		tbarItems.push(this.deviceCountField);
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.addButton = new Ext.Button({
			text: 'Add', handler: function () {
				var deviceCount = this.deviceCountField.getValue();
				if (deviceCount > 0) {
					this.mask.show();
					Cooler.ClientBeaconConfiguration.onAddclientBeaconConfigDetail(this.deviceCountField.getValue());
				} else {
					Ext.Msg.alert('Warning', 'Please provide device count');
				}
			}, scope: this
		});

		tbarItems.push(this.addButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	}
});