Cooler.SmartHubFirmwareUpgrade = Ext.extend(Cooler.Form, {
	keyColumn: 'SmartHubFirmwareUpgradeId',
	captionColumn: null,
	title: 'Smart Hub Firmware Upgrade',
	controller: 'SmartHubFirmwareUpgrade',
	securityModule: 'SmartHubFirmwareUpgrade',
	gridConfig: {
		sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
	},
	onGridCreated: function (grid) {
		disableDblClickHandler: true;
	},
	hybridConfig: function () {
		return [
            { dataIndex: 'SmartHubFirmwareUpgradeId', type: 'int' },
            { dataIndex: 'SmartDeviceId', type: 'int' },
			{ dataIndex: 'SerialNumber', type: 'string', header: 'Serial Number' },
			{ dataIndex: 'SmartDeviceType', type: 'string', header: 'Smart Device Type' },
			{ dataIndex: 'SelectedSmartDeviceType', type: 'string', header: 'Selected Smart Device Type'}
		];
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		var deleteButton = new Ext.Button({ text: 'Delete', handler: this.performDelete, scope: this, iconCls: 'delete' });
		tbarItems.push(deleteButton);
		gridConfig.disableDblClickHandler = true;
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	performDelete: function () {
		var selectedRecord = this.grid.getSelectionModel().getSelected();
		var selectedRowData = selectedRecord.data;
		var smartDeviceId = selectedRowData.SmartHubFirmwareUpgradeId;
		this.smartDeviceId = smartDeviceId;

		Ext.Ajax.request({
			url: 'Controllers/SmartHubFirmwareUpgrade.ashx',
			params: { ids: this.smartDeviceId, action: 'delete' },
			success: function (result, request) {
				this.grid.getStore().load();
			},
			failure: function (result, request) {
				alert(JSON.parse(result.responseText));
			},
			scope: this
		});
	},
	createForm: function (config) {
		var smartDeviceStore = DA.combo.create({ controller: 'combo', baseParams: { comboType: 'SmartDevice', SmartDeviceTypeId: 27, SmartdeviceTypeId: 60, limit: 0 } });
		this.smartDeviceStore = smartDeviceStore;
		var smartDeviceText = new Ext.form.TextField({
			fieldLabel: 'Search',
			width: 180,
			xtype: 'textfield',
			emptyText: 'Search ...',
			enableKeyEvents: true
		});
		smartDeviceText.on('keyup', this.onsmartDeviceSearchDataKeyUp, this);
		this.smartDeviceText = smartDeviceText;
		var smartDeviceCombo = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			name: 'SmartDeviceIds',
			fieldLabel: 'Smart Gateway',
			hiddenName: 'SmartDeviceIds',
			displayField: 'DisplayValue',
			store: this.smartDeviceStore.getStore(),
			width: 200,
			height: 82,
			allowBlank: false
		});
		var hiddenSmartDeviceTypeIds = { xtype: 'hidden', name: 'SmartDeviceTypeIds', hiddenName: 'SmartDeviceTypeIds', value: '' }
		smartDeviceCombo.on('change', this.onSmartDeviceComboChange, this);
		this.smartDeviceCombo = smartDeviceCombo;
		this.hiddenSmartDeviceTypeIds = hiddenSmartDeviceTypeIds;
		var col1 = {
			columnWidth: 1,
			defaults: { width: 220, labelWidth: 102 },
			items: [
				smartDeviceText,
				smartDeviceCombo,
				hiddenSmartDeviceTypeIds
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			items: [col1]
		});
		return config;
	},
	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 400,
			height: 200,
			items: [this.formPanel]
		});
		this.on('beforeLoad', this.onBeforeLoad, this);
		this.on('beforeSave', function (smartDeviceForm, params, options) {
			this.loadNew = options.loadNew
			var form = smartDeviceForm.formPanel.getForm();
			var smartdeviceTypeIds = form.findField('SmartDeviceTypeIds');
			smartdeviceTypeIds.setValue(this.hiddenSmartDeviceTypeIds.value);
		});
	},
	onBeforeLoad: function (param) {
		this.smartDeviceStore.getStore().load();
	},
	onSmartDeviceComboChange: function (combo, newValue, oldValue) {
		var newValueArr = newValue.split(',');
		var oldValueArr = oldValue.split(',');
		if ((newValue != "" && oldValue == "") || (newValueArr.length > oldValueArr.length)) {
			for (var i = 0; i < newValueArr.length; i++) {
				for (var j = 0; j < oldValueArr.length; j++) {
					if (newValueArr[i] == oldValueArr[j]) {
						newValueArr.splice(i, 1);
						i = 0;
						j = 0;
					}
				}
			}
			if (newValueArr.length > 0) {
				var newSmartDevice = newValueArr[0];
				this.newSmartDevice = newSmartDevice;
				if (!this.smartDeviceTypeForm) {
					var smartDeviceTypeStore = DA.combo.create({ controller: 'combo', baseParams: { comboType: 'SmartDeviceType', IgnoreGateway: 0, limit: 0 } });
					this.smartDeviceTypeStore = smartDeviceTypeStore;
					var smartDeviceTypeCombo = new Ext.ux.Multiselect({
						valueField: 'LookupId',
						name: 'SmartDeviceTypeIds',
						fieldLabel: 'Smart Device Type',
						hiddenName: 'SmartDeviceTypeIds',
						displayField: 'DisplayValue',
						store: this.smartDeviceTypeStore.getStore(),
						width: 200,
						allowBlank: false
					});
					var hiddenSmartDeviceTypeIds = { xtype: 'hidden', name: 'SmartDeviceTypesIds', value: '' }

					this.smartDeviceTypeCombo = smartDeviceTypeCombo;
					this.hiddenSmartDeviceTypeIds = hiddenSmartDeviceTypeIds;

					var smartDeviceTypeForm = new Ext.FormPanel({
						itemId: 'smartDeviceTypeForm',
						defaults: {
							labelStyle: 'width: 110px; margin-left: 13px;'
						},
						items: [
							this.smartDeviceTypeCombo,
							this.hiddenSmartDeviceTypeIds
						]
					});
					this.smartDeviceTypeForm = smartDeviceTypeForm;
				}

				if (!this.smartDeviceTypeWindow) {
					var window = new Ext.Window({
						width: 350,
						height: 300,
						layout: 'fit',
						padding: 10,
						title: 'Smart Device Type Select',
						resizable: false,
						constrain: true,
						items: this.smartDeviceTypeForm,
						closeAction: 'hide',
						tbar: [
							{
								xtype: 'button',
								text: 'Ok',
								handler: this.onSelectDeviceType,
								//iconCls: 'ok',
								scope: this
							},
							{
								xtype: 'button',
								text: 'Cancel',
								//iconCls: 'cancel',
								handler: function () {
									this.smartDeviceTypeWindow.hide();
								},
								scope: this
							}
						],
						modal: true
					});
					this.smartDeviceTypeWindow = window;
				}
				this.smartDeviceTypeStore.getStore().load();
				this.smartDeviceTypeWindow.show();
			}
		}
	},
	onSelectDeviceType: function () {
		var form = this.smartDeviceTypeForm.getForm();
		this.form = form;
		var formValues = form.getValues();
		var smartDeviceTypeIds = formValues.SmartDeviceTypeIds;
		if (!form.isValid()) {
			Ext.MessageBox.alert('Alert', 'Please select "CoolerIoT Client"');
			return false;
		}
		if (smartDeviceTypeIds != "") {
			this.hiddenSmartDeviceTypeIds.value = "";
			if (this.hiddenSmartDeviceTypeIds.value != "") {
				var smartDeviceTypeObj = Ext.decode(this.hiddenSmartDeviceTypeIds.value);
				var obj = {};
				obj.SmartDeviceId = this.newSmartDevice;
				obj.SmartDeviceTypeIds = smartDeviceTypeIds;
				smartDeviceTypeObj.push(obj);
				this.hiddenSmartDeviceTypeIds.value = Ext.encode(smartDeviceTypeObj);
			}
			else {
				var smartDeviceTypeObj = [];
				var obj = {};
				obj.SmartDeviceId = this.newSmartDevice;
				obj.SmartDeviceTypeIds = smartDeviceTypeIds;
				smartDeviceTypeObj.push(obj);
				this.hiddenSmartDeviceTypeIds.value = Ext.encode(smartDeviceTypeObj);
			}
		}
		this.smartDeviceTypeWindow.hide();
	},
	onsmartDeviceSearchDataKeyUp: function (field) {
		var value = field.getValue();
		store = this.smartDeviceStore.getStore();
		store.filter('DisplayValue', value);
		if (value != undefined && value != '') {
			this.smartDeviceStore.setValue();
		}
		if (value == "") {
			this.smartDeviceStore.getStore().clearFilter();
			this.smartDeviceStore.setValue();
		}
	}
});

Cooler.SmartHubFirmwareUpgrade = new Cooler.SmartHubFirmwareUpgrade({ uniqueId: 'SmartHubFirmwareUpgrade' });