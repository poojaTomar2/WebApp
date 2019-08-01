Cooler.SalesHierarchy = Ext.extend(Cooler.Form, {
	keyColumn: 'SalesHierarchyId',
	captionColumn: 'Name',
	formTitle: 'Sales Hierarchy : {0}',
	controller: 'SalesHierarchy',
	listTitle: 'Sales Hierarchy',
	securityModule: 'SalesHierarchy',
	constructor: function (config) {
		Cooler.SalesHierarchy.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			custom: {
				loadComboTypes: true
			},
			defaults: { sort: { dir: 'DESC', sort: 'SalesHierarchyId' } }
		});
	},
	comboTypes: ['AssetTypeCapacity'],
	comboStores: {
		AssetTypeCapacity: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},
	hybridConfig: function () {
		return [
			{ header: 'Id', dataIndex: 'SalesHierarchyId', type: 'int', width: 100 },
			{ dataIndex: 'ParentSalesHierarchyId', type: 'int' },
			{ dataIndex: 'ClientId', type: 'int' },
			{ dataIndex: 'ChildCount', type: 'int' },
			{ dataIndex: 'CountryId', type: 'int' },
			{ dataIndex: 'SalesHierarchyLevel', type: 'int' },
			{ header: 'Level', dataIndex: 'LevelName', type: 'string', width: 100 },
			{ header: 'Name', dataIndex: 'Name', type: 'string', width: 150 },
			{ header: 'Code', dataIndex: 'Code', type: 'string', width: 150 },
			{ header: 'Parent Name', dataIndex: 'ParentSalesHierarchy', type: 'string', width: 150 },
			{ header: 'Parent Code', dataIndex: 'ParentCode', type: 'string', width: 150 },
			{ header: 'CoolerIoT Client', dataIndex: 'Client', type: 'string', width: 150 },
			{ header: 'Country', dataIndex: 'Country', type: 'string', width: 150 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, convert: Ext.ux.DateLocalizer },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ header: 'Type', dataIndex: 'SalesHierarchyType', type: 'string', width: 150 }
		];
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var parentName = DA.combo.create({
			fieldLabel: 'Parent Name', hiddenName: 'ParentSalesHierarchyId', baseParams: { comboType: 'SalesHierarchy' }, listWidth: 220, controller: "Combo", listeners: {
				blur: this.onBlur,
				scope: this
			}
		});
		this.parentName = parentName;
		this.parentName.on('beforequery', this.onBeforeSalesHierarchyComboLoad, this);
		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' }, disabled: disableFieldsOnClientId, allowBlank: false });
		var countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220, allowBlank: false });
		this.clientCombo = clientCombo;
		this.countryCombo = countryCombo;
		Ext.apply(config, {
			defaults: { width: 200 },
			items: [
				{ fieldLabel: 'Name', name: 'Name', xtype: 'textfield', maxLength: 150, allowBlank: false },
				{ fieldLabel: 'Code', name: 'Code', xtype: 'textfield', maxLength: 150, allowBlank: false },
				parentName,
				clientCombo,
				countryCombo
			]
		});
		return config;
	},

	CreateFormPanel: function (config) {
		var assetTypeCapacityThresholdGrid = Cooler.SalesHierarchyAssetTypeCapacityThreshold.createGrid({ editable: true, root: 'SalesHierarchyAssetTypeCapacityThreshold', allowPaging: false, plugins: [new Ext.ux.ComboLoader()] });
		this.childGrids = [assetTypeCapacityThresholdGrid];
		var tabPanel = new Ext.TabPanel({
			region: 'center',
			activeTab: 0,
			enableTabScroll: true,
			defaults: {
				layout: 'fit',
				border: 'false'
			},
			items: this.childGrids
		});
		Ext.apply(config, {
			region: 'north',
			height: 200
		});

		this.formPanel = new Ext.FormPanel(config);
		this.on('dataLoaded', this.onDataLoaded, this);
		this.on('beforeSave', this.onBeforeSave, this);
		this.on('dataLoaded', function (form, data) {
			var clientId = Number(DA.Security.info.Tags.ClientId);
			if (clientId != 0) {
				var clientCombo = this.clientCombo;
				ExtHelper.SetComboValue(clientCombo, clientId);
				clientCombo.setDisabled(true);
			} else {
				this.clientCombo.setDisabled(data.data.ParentSalesHierarchyId != 0);
			}
			var countryId = Number(DA.Security.info.Tags.CountryId);
			if (form.activeRecordId == 0 && countryId != 0) {
				var countryCombo = this.countryCombo;
				ExtHelper.SetComboValue(countryCombo, countryId);
				//countryCombo.setDisabled(true);
			} else {
				this.countryCombo.setDisabled(data.data.ParentSalesHierarchyId != 0);
			}
		});
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			modal: 'false',
			defaults: {
				border: false,
				bodyStyle: 'padding: 0px'
			},
			height: 500,
			items: [this.formPanel, tabPanel]
		});
	},

	onBeforeSave: function (obj, form, action) {
		this.clientCombo.setDisabled(false);
		this.countryCombo.setDisabled(false);
	},

	onDataLoaded: function (SalesHierarchyForm, data) {
		var record = data.data;
		var id = record.Id;
		if (!Ext.isEmpty(id) && id !== 0) {
			var selectedRecord = this.grid.getSelectionModel().getSelected(),
				childCount = 0,
				parentNameId = 0;
			if (selectedRecord) {
				childCount = selectedRecord.get('ChildCount'),
					parentNameId = selectedRecord.get('ParentSalesHierarchyId');
			}
			this.parentName.setDisabled(parentNameId === 0 && childCount > 0 ? true : false);
			this.childGrids[0].setDisabled(parentNameId !== 0 ? true : false);
		}
		var topToolbarItems = SalesHierarchyForm.formPanel.getTopToolbar().items;
		var deleteButtonIndex = topToolbarItems.findIndex('iconCls', 'delete');
		var deleteButton = topToolbarItems.get(deleteButtonIndex);
		deleteButton.setDisabled(childCount > 0 ? true : false);
		var comboBaseParam = record.SalesHierarchyLevel > 0 ? record.SalesHierarchyLevel - 1 : 0;
		this.comboBaseParam = comboBaseParam;
	},

	onBlur: function (combo) {
		this.clientCombo.setDisabled(false);
		this.countryCombo.setDisabled(false);
		var store = combo.getStore();
		var index = store.findExact('LookupId', combo.getValue()), data;
		if (index != -1) {
			data = store.getAt(index);
			ExtHelper.SetComboValue(this.clientCombo, Number(data.get('CustomStringValue')));
			ExtHelper.SetComboValue(this.countryCombo, Number(data.get('CustomValue')));
			this.clientCombo.setDisabled(true);
			this.countryCombo.setDisabled(true);
		}
	},

	onBeforeSalesHierarchyComboLoad: function (queryEvent) {
		var combo = queryEvent.combo;
		combo.baseParams.SalesHierarchyId = this.formPanel.form.baseParams.id;
		combo.baseParams.SalesHierarchyLevel = this.comboBaseParam;
	},

});
Cooler.SalesHierarchy = new Cooler.SalesHierarchy({ uniqueId: 'SalesHierarchy' });

Cooler.SalesHierarchyAssetTypeCapacityThreshold = new Cooler.Form({
	listTitle: 'Sales Hierarchy Asset Type Capacity Threshold',
	gridIsLocal: true,
	hybridConfig: function () {
		var assetTypeCapacityCombo = DA.combo.create({ hiddenName: 'AssetTypeCapacityId', store: Cooler.SalesHierarchy.comboStores.AssetTypeCapacity });
		this.assetTypeCapacityCombo = assetTypeCapacityCombo;
		var last30DayDoorThreshold = new Ext.form.TextField({ allowDecimals: true, allowBlank: false });
		var last30DayActiveDoorThreshold = new Ext.form.TextField({ allowDecimals: true, allowBlank: false });
		var last30DayTempThreshold = new Ext.form.TextField({ allowDecimals: true, allowBlank: false });
		var proximityPowerTempThreshold = new Ext.form.TextField({ maxValue: 10, allowDecimals: false, minValue: 1 });
		var lastDownloadThreshold = new Ext.form.TextField({
			xtype: 'numberfield',
			allowDecimals: false,
		});
		return [
			{ dataIndex: 'Id', type: 'int' },
			{ dataIndex: 'SalesHierarchyId', type: 'int' },
			//{dataIndex : 'AssetTypeCapacityId', type: 'int'},
			{ header: 'Asset Type Capacity', dataIndex: 'AssetTypeCapacityId', type: 'int', width: 120, renderer: ExtHelper.renderer.Combo(this.assetTypeCapacityCombo), editor: this.assetTypeCapacityCombo },
			{ header: 'Last 30 Day Door Threshold', dataIndex: 'Last30DayDoorThreshold', width: 125, renderer: ExtHelper.renderer.Float(2), type: 'float', editor: last30DayDoorThreshold },
			{ header: 'Last 30 Day Active Door Threshold', dataIndex: 'Last30DayActiveDoorThreshold', width: 125, renderer: ExtHelper.renderer.Float(2), type: 'float', editor: last30DayActiveDoorThreshold },
			{ header: 'Temperature Threshold', dataIndex: 'Last30DayTempAvgThreshold', width: 125, renderer: ExtHelper.renderer.Float(2), type: 'float', editor: last30DayTempThreshold },
			{ header: 'Last Download Threshold', dataIndex: 'LastDownloadThreshold', width: 125, type: 'int', editor: lastDownloadThreshold },
			{ header: 'Proximity Power Temperature Diff Threshold', dataIndex: 'ProximityPowerTempThreshold', width: 150, type: 'int', editor: proximityPowerTempThreshold }

		];
	}
});