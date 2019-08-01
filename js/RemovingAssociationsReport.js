Cooler.RemovingAssociationsReport = Ext.extend(Cooler.Form, {
	controller: 'RemovingAssociationsReport',
	keyColumn: 'SmartDeviceId',
	listTitle: 'Remove Association Tool',
	disableAdd: true,
	disableDelete: true,
	allowExport: false,
	securityModule: 'RemovingAssociationsReport',
	constructor: function (config) {
		Cooler.RemovingAssociationsReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'ASC', sort: 'SmartDeviceId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
			{ dataIndex: 'SmartDeviceId', type: 'int' },
			{ header: 'Smart Device Type', dataIndex: 'SmartDeviceType', type: 'string', width: 150 },
            { header: 'Smart Device Serial Number', dataIndex: 'SerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Asset Type', dataIndex: 'AssetType', type: 'string', width: 150 },
            { header: 'Asset Serial', dataIndex: 'AssetSerialNumber', type: 'string', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Equipment Number', dataIndex: 'EquipmentNumber', type: 'string', width: 150 },
			{ header: 'Asset Technical Identification Number', dataIndex: 'TechnicalIdentificationNumber', type: 'string' },
            { header: 'Outlet Code', dataIndex: 'LocationCode', type: 'string', hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', dataIndex: 'LocationName', type: 'string' },
			{ header: 'Country', dataIndex: 'Country', type: 'string' }
		];
	},

	afterShowList: function (config) {
		$("td:contains(Filters...)").each(function (i, element) {
			element.hidden = true;
		});
		$("td:contains(Remove Filter)").each(function (i, element) {
			element.hidden = true;
		});
		$("td:contains(Preferences)").each(function (i, element) {
			element.hidden = true;
		});
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.assetSerialNumberTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerialNumber' });
		this.equipmentNumberTextField = new Ext.form.TextField({ width: 100, name: 'EquipmentNumber' });
		this.technicalIdentificationNumberTextField = new Ext.form.TextField({ width: 100, name: 'TechnicalIdentification' });
		this.smartDeviceSerialTextField = new Ext.form.TextField({ width: 100, name: 'SmartDeviceSerialNumber' });
		var removeAssociationButton = new Ext.Button({ text: 'Remove Association', handler: this.onRemoveAssociationButtonClick, scope: this });
		var filterFields = ['AssetSerialNumber', 'EquipmentNumber', 'TechnicalIdentification', 'SmartDeviceSerial'];
		this.filterFields = filterFields;
		tbarItems.push(removeAssociationButton);

		tbarItems.push(' | Asset Serial#');
		tbarItems.push(this.assetSerialNumberTextField);

		tbarItems.push('Equipment#');
		tbarItems.push(this.equipmentNumberTextField);

		tbarItems.push('Technical Id');
		tbarItems.push(this.technicalIdentificationNumberTextField);

		tbarItems.push('Smart Device Serial#');
		tbarItems.push(this.smartDeviceSerialTextField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.resetGridStore();
				if (!Ext.isEmpty(this.assetSerialNumberTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { AssetSerialNumber: this.assetSerialNumberTextField.getValue() });
				}
				if (!Ext.isEmpty(this.equipmentNumberTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { EquipmentNumber: this.equipmentNumberTextField.getValue() });
				}
				if (!Ext.isEmpty(this.technicalIdentificationNumberTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { TechnicalIdentification: this.technicalIdentificationNumberTextField.getValue() });
				}
				if (!Ext.isEmpty(this.smartDeviceSerialTextField.getValue())) {
					Ext.applyIf(this.grid.getStore().baseParams, { SmartDeviceSerial: this.smartDeviceSerialTextField.getValue() });
				}
				this.grid.loadFirst();
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.resetGridStore();
				this.grid.gridFilter.clearFilters();
				this.assetSerialNumberTextField.reset();
				this.equipmentNumberTextField.reset();
				this.technicalIdentificationNumberTextField.reset();
				this.smartDeviceSerialTextField.reset();
				this.grid.loadFirst();
				this.selectedAssetId = 0;
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	resetGridStore: function () {
		var stroeBaseParams = this.grid.getStore().baseParams, filterFieldsLength = this.filterFields.length, filterField;
		for (var i = 0; i < filterFieldsLength; i++) {
			filterField = this.filterFields[i];
			delete stroeBaseParams[filterField];
		}
	},

	onRemoveAssociationButtonClick: function (sender) {
		var selectedRecord = this.grid.selModel.selections.items;
		if (selectedRecord.length < 1) {
			Ext.Msg.alert('Alert', 'Please select one row.');
			return;
		}
		var smartDeviceId = '';
		var smartDeviceType = '';
		var smartDeviceIds = [];
		var smartDeviceTypeNames = [];
		for (var i = 0; i < this.grid.selModel.selections.items.length; i++) {
			smartDeviceId = selectedRecord[i].data.SmartDeviceId;
			smartDeviceIds.push(smartDeviceId);
			smartDeviceId = smartDeviceIds.join(",");

			smartDeviceType = selectedRecord[i].data.SmartDeviceType;
			smartDeviceTypeNames.push(smartDeviceType);
			smartDeviceType = smartDeviceTypeNames.join(", ");
		}

		Ext.Msg.confirm("Alert", "You want to Remove Device Association of  <b>" + smartDeviceTypeNames + "</b>&nbsp;&nbsp;?", function (btnText) {
			if (btnText === "yes") {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				mask.show();
				Ext.Ajax.request({
					url: EH.BuildUrl('RemovingAssociationsReport'),
					params: {
						action: 'onRemovingAssociationsReport',
						smartDeviceId: smartDeviceId
					},
					success: function (result, request) {
						mask.hide();
						mask.destroy();
						Ext.Msg.alert('Info', result.responseText.replace(/"/g, ''));
						Cooler.RemovingAssociationsReport.grid.getStore().load();
					},
					failure: function (result, request) {
						mask.hide();
						mask.destroy();
						Ext.Msg.alert('Error', result.responseText.replace(/"/g, ''));
					},
					scope: this
				});
			}
		}, this);
	}
});
Cooler.RemovingAssociationsReport = new Cooler.RemovingAssociationsReport({ uniqueId: 'RemovingAssociationsReport' });