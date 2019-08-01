Cooler.Client = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'CoolerIoT Client: {0}',
		listTitle: 'CoolerIoT Client',
		keyColumn: 'ClientId',
		captionColumn: 'ClientName',
		controller: 'Client',
		securityModule: 'ClientSetup',
		logoUrl: './FileServer/Client/',
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel(),
			custom: {
				loadComboTypes: true
			}
		},
		winConfig: { width: 500, height: 300 },
		comboTypes: ['DistanceUnit', 'TimeZone', 'DashBoardPage', 'DashBoardChart']
	});
	Cooler.Client.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Client, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'ClientId', type: 'int' },
		{ name: 'RevenueCurrencyId', type: 'int' },
		{ name: 'RevenueCurrency', type: 'string' },
		{ name: 'Category', type: 'string' },
		{ name: 'CategoryId', type: 'int' },
		{ name: 'LocationCount', type: 'int' },
		{ name: 'ClientName', type: 'string' },
		{ name: 'Revenue', type: 'string' },
		{ name: 'IsKeyAccount', type: 'bool' },
		{ name: 'LocationId', type: 'int' },
		{ name: 'ClientCode', type: 'string' },
		{ name: 'Contact', type: 'string' },
		{ name: 'Subdomain', type: 'string' },
		{ name: 'TimeZoneId', type: 'int' },
		{ name: 'TimeZone', type: 'string' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' },
		{ name: 'FeedbackEnabled', type: 'bool' },
		{ name: 'VisionImageIntervalHours', type: 'float' },
		{ name: 'VisionImageIntervalDoorOpen', type: 'int' },
		{ name: 'OutOfStockSKU', type: 'int' },
		{ name: 'PowerOffDuration', type: 'int' },
		{ name: 'TemperatureMin', type: 'int' },
		{ name: 'TemperatureMax', type: 'int' },
		{ name: 'LightMin', type: 'int' },
		{ name: 'LightMax', type: 'int' },
		{ name: 'DoorCount', type: 'int' },
		{ name: 'HealthIntervals', type: 'int' },
		{ name: 'CoolerTrackingThreshold', type: 'int' },
		{ name: 'CoolerTrackingDisplacementThreshold', type: 'int' },
		{ name: 'ProximityPowerTempThreshold', type: 'float' },
		{ name: 'FallenMagnetThreshold', type: 'int' },
		{ name: 'VHenabled', type: 'bool' },
		{ name: 'CountryIds', type: 'string' },
		{ name: 'CountryName', type: 'string' },
		{ name: 'ShippedCountryIds', type: 'string' },
		{ name: 'ShippedCountryName', type: 'string' }

	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Client Code', dataIndex: 'ClientCode' },
			{ header: 'Client Name', dataIndex: 'ClientName' },
			{ header: 'Contact', dataIndex: 'Contact' },
			{ header: 'Subdomain', dataIndex: 'Subdomain' },
			{ header: 'Is Feedback Enabled?', dataIndex: 'FeedbackEnabled', renderer: ExtHelper.renderer.Boolean },
			{ header: 'Time Zone', dataIndex: 'TimeZoneId', displayIndex: 'TimeZone', store: this.comboStores.TimeZone, renderer: 'proxy', width: 250 },
			{ header: 'Vision Image Interval (Hours)', dataIndex: 'VisionImageIntervalHours', width: 180, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Vision Image Interval (Door Open)', dataIndex: 'VisionImageIntervalDoorOpen', width: 180, align: 'right' },
			{ header: 'Out Of Stock SKU', dataIndex: 'OutOfStockSKU', width: 180, align: 'right' },
			{ header: 'Power Off Duration', dataIndex: 'PowerOffDuration', width: 180, align: 'right' },
			{ header: 'Temperature Min', dataIndex: 'TemperatureMin', width: 180, align: 'right' },
			{ header: 'Temperature Max', dataIndex: 'TemperatureMax', width: 180, align: 'right' },
			{ header: 'Light Min', dataIndex: 'LightMin', width: 180, align: 'right' },
			{ header: 'Light Max', dataIndex: 'LightMax', width: 180, align: 'right' },
			{ header: 'Door Count', dataIndex: 'DoorCount', width: 180, align: 'right' },
			{ header: 'Health Intervals  (Hours)', dataIndex: 'HealthIntervals', width: 180 },
			{ header: 'Cooler Tracking Threshold (Days)', dataIndex: 'CoolerTrackingThreshold', width: 180 },
			{ header: 'Cooler Tracking Displacement Threshold (Mtr)', dataIndex: 'CoolerTrackingDisplacementThreshold', width: 180 },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 },
			{ header: 'Fallen Magnet Threshold', dataIndex: 'FallenMagnetThreshold', width: 150, align: 'right' },
			{ header: 'VHenabled', dataIndex: 'VHenabled', type: 'bool', width: 90, renderer: ExtHelper.renderer.Boolean },
			{ header: 'Country', dataIndex: 'CountryName', type: 'string', width: 200 },
			{ header: 'Shipped Country', dataIndex: 'ShippedCountryName', type: 'string', width: 200 }
		]);
		cm.defaultSortable = true;
		return cm;
	},

	comboStores: {
		DistanceUnit: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		DateFormat: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		DashBoardPage: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		DashBoardChart: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	createForm: function (config) {
		var smartDeviceTypeColumnMultiSelectStore = DA.combo.create({ baseParams: { comboType: 'SmartDeviceType', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.smartDeviceTypeColumnMultiSelectStore = smartDeviceTypeColumnMultiSelectStore;
		var countryColumnMultiSelectStore = DA.combo.create({ baseParams: { comboType: 'Country', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.countryColumnMultiSelectStore = countryColumnMultiSelectStore;
		var shippedCountryColumnMultiSelectStore = DA.combo.create({ baseParams: { comboType: 'Country', limit: 0 }, listWidth: 180, controller: "Combo" });
		this.shippedCountryColumnMultiSelectStore = shippedCountryColumnMultiSelectStore;
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var searchUnitCombo = DA.combo.create({ fieldLabel: 'Search Unit', hiddenName: 'SearchUnitId', store: this.comboStores.DistanceUnit, mode: 'local' });
		var dateFormatCombo = DA.combo.create({ fieldLabel: 'Date Format', hiddenName: 'DateFormatId', store: this.comboStores.DateFormat, mode: 'local', value: Cooler.Enums.DateFormat.DMY });
		var feedbackCombo = DA.combo.create({ fieldLabel: 'Is Feedback Enabled?', hiddenName: 'FeedbackEnabled', store: "yesno" });
		var outletColumnstore = new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, root: "data" });
		this.outletColumnstore = outletColumnstore;
		var smartDeviceTypeColumnMultiSelect = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Smart Device Type',
			hiddenName: 'SmartDeviceTypeIds',
			name: 'SmartDeviceTypeIds',
			displayField: 'DisplayValue',
			store: smartDeviceTypeColumnMultiSelectStore.getStore(),
			width: 180
		});

		var countryColumnMultiSelect = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Country',
			hiddenName: 'CountryIds',
			name: 'CountryIds',
			displayField: 'DisplayValue',
			store: countryColumnMultiSelectStore.getStore(),
			width: 180
		});

		var shippedCountryColumnMultiSelect = new Ext.ux.Multiselect({
			valueField: 'LookupId',
			fieldLabel: 'Shipped Country',
			hiddenName: 'ShippedCountryIds',
			name: 'ShippedCountryIds',
			displayField: 'DisplayValue',
			store: shippedCountryColumnMultiSelectStore.getStore(),
			width: 180
		});

		var uploadImage = new Ext.form.FileUploadField({
			fieldLabel: 'Image Upload',
			width: 250,
			name: 'selectFile',
			vtype: 'fileUpload'
		});
		var logoField = new Ext.ux.Image({ height: 120, src: "", style: 'margin-bottom:0.5em' });
		var outletColumnMultiSelect = new Ext.ux.Multiselect({
			fieldLabel: 'Location',
			name: 'OutletColumns',
			valueField: 'DisplayValue',
			displayField: 'DisplayValue',
			store: outletColumnstore,
			maxLength: 10
		});
		this.outletColumnMultiSelect = outletColumnMultiSelect;
		var ClientCode = new Ext.form.TextField({ fieldLabel: 'Client Code', name: 'ClientCode', xtype: 'textfield', maxLength: 10, allowBlank: false, disabled: disableFieldsOnClientId });
		this.ClientCode = ClientCode;
		var vhEnabledCheckbox = new Ext.form.Checkbox({ fieldLabel: 'VH Enabled', name: 'VHEnabled', dataIndex: 'VHEnabled', type: 'bool', hiddenName: 'VHEnabled' });
		this.vhEnabledCheckbox = vhEnabledCheckbox;

		var treeLoader = new Ext.tree.TreeLoader({
			dataUrl: String.format('{0}?action={1}', EH.BuildUrl('SalesHierarchyTreeView'), 'getSalesHierarchy'),
			baseAttrs: { checked: false }

		});
		this.treeLoader = treeLoader;
		treeLoader.on('load', this.onTreeLoad, this);
		var tree = new Ext.tree.ColumnTree({
			width: 285,
			height: 280,
			region: 'center',
			rootVisible: true,
			autoScroll: true,
			title: 'DashBoard Page / Chart',
			lines: true,
			columns: [
				{
					header: 'Grouping by DashBoard Page / Chart',
					width: 280,
					dataIndex: 'text'
				}
			],
			loader: treeLoader,
			root: new Ext.tree.AsyncTreeNode({
				text: 'DashBoard Page / Chart'
			})
		});
		this.tree = tree;
		tree.on('checkchange', this.onCheckChange, this);

		var col1 = {
			columnWidth: .5,
			labelWidth: 100,
			defaults: {
				width: 250
			}, items: [
				smartDeviceTypeColumnMultiSelect,
				ClientCode,
				{ fieldLabel: 'Client Name', name: 'ClientName', xtype: 'textfield', maxLength: 50, allowBlank: false, disabled: disableFieldsOnClientId },
				{ fieldLabel: 'Contact', name: 'Contact', xtype: 'textfield', maxLength: 50, disabled: disableFieldsOnClientId },
				uploadImage,
				{ fieldLabel: 'Subdomain', name: 'Subdomain', xtype: 'textfield', maxLength: 50 },
				DA.combo.create({ fieldLabel: 'Time Zone', hiddenName: 'TimeZoneId', allowBlank: false, baseParams: { comboType: 'TimeZone' }, disabled: disableFieldsOnClientId }),
				{ fieldLabel: 'No. of Record Load', name: 'RecordCount', xtype: 'numberfield', allowBlank: false, maxValue: 100, allowDecimals: false, maxLength: 2 },
				{ fieldLabel: 'Feedback Question Point', name: 'FeedbackQuestionPoint', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, maxLength: 3 },
				{ fieldLabel: 'Prospect Question Point', name: 'ProspectQuestionPoint', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, maxLength: 3 },
				searchUnitCombo,
				feedbackCombo,
				outletColumnMultiSelect,
				dateFormatCombo,
				{ fieldLabel: 'Proximity Power Temperature Diff Threshold', name: 'ProximityPowerTempThreshold', xtype: 'numberfield', maxValue: 10, allowDecimals: false, minValue: 1 },
				countryColumnMultiSelect

			]
		};

		var col2 = {
			columnWidth: .5,
			defaults: {
				width: 250
			},
			items: [
				logoField,
				{ fieldLabel: 'Search Distance', name: 'SearchDistance', allowBlank: false, xtype: 'numberfield', maxLength: 4, allowDecimals: false },
				{ fieldLabel: 'Vision Image Interval (Hours)', name: 'VisionImageIntervalHours', xtype: 'numberfield', allowBlank: false, maxValue: 720 },
				{ fieldLabel: 'Vision Image Interval (Door Opens)', name: 'VisionImageIntervalDoorOpen', xtype: 'numberfield', allowBlank: false, maxValue: 10000, allowDecimals: false },
				{ fieldLabel: 'Out Of Stock SKU (Product Unit)', name: 'OutOfStockSKU', xtype: 'numberfield', allowBlank: false, allowDecimals: false, minValue: 0, maxValue: 20 },
				{ fieldLabel: 'Power Off Duration (Mins)', name: 'PowerOffDuration', xtype: 'numberfield', allowBlank: false, allowDecimals: false, minValue: 0 },
				{ fieldLabel: 'Temperature Min', name: 'TemperatureMin', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, minValue: -100 },
				{ fieldLabel: 'Temperature Max', name: 'TemperatureMax', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, minValue: 0 },
				{ fieldLabel: 'Light Min', name: 'LightMin', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, minValue: 0 },
				{ fieldLabel: 'Light Max', name: 'LightMax', xtype: 'numberfield', allowBlank: false, maxValue: 150, allowDecimals: false, minValue: 0 },
				{ fieldLabel: 'Door Count', name: 'DoorCount', xtype: 'numberfield', allowBlank: false, allowDecimals: false, minValue: 0 },
				{ fieldLabel: 'Health Intervals  (Hours)', name: 'HealthIntervals', xtype: 'numberfield', allowBlank: false, allowDecimals: false, minValue: 0, maxValue: 24 },
				{ fieldLabel: 'Cooler Tracking Threshold (Days)', name: 'CoolerTrackingThreshold', xtype: 'numberfield', minValue: 1, maxValue: 365, allowBlank: false, allowDecimals: false },
				{ fieldLabel: 'Cooler Tracking Displacement Threshold (Mtr)', name: 'CoolerTrackingDisplacementThreshold', xtype: 'numberfield', minValue: 10, maxValue: 5000, allowBlank: false, allowDecimals: false },
				{ fieldLabel: 'Fallen Magnet Threshold ', name: 'FallenMagnetThreshold', xtype: 'numberfield', minValue: 1, maxValue: 365, allowBlank: false, allowDecimals: false },
				vhEnabledCheckbox,
				shippedCountryColumnMultiSelect,
				tree
			]
		};
		Ext.apply(config, {
			layout: 'column',
			defaults: { layout: 'form', border: false },
			labelWidth: 150,
			items: [col1, col2],
			fileUpload: true,
			autoScroll: true
		});

		this.logoField = logoField;
		this.uploadImage = uploadImage;

		this.on('dataLoaded', function (consumerForm, data) {
			var record = data.data;
			if (record) {
				Cooler.loadThumbnail(this, record, this.logoUrl + "/imageNotFound.png");
			}
			this.uploadImage.on('fileselected', Cooler.onFileSelected, this);
		});
		return config;
	},

	CreateFormPanel: function (config) {
		this.formPanel = new Ext.FormPanel(config);
		this.winConfig = Ext.apply(this.winConfig, {
			width: 850,
			height: 550,
			items: [this.formPanel]
		});
		this.on('beforeLoad', function (param) {
			this.smartDeviceTypeColumnMultiSelectStore.getStore().load();
			this.countryColumnMultiSelectStore.getStore().load();
			this.shippedCountryColumnMultiSelectStore.getStore().load();
		});
		this.on('dataLoaded', this.onDataLoad, this);
		this.tree.getRootNode().reload();
		//this.ClientCode.disabled = true;
	},
	onDataLoad: function (form, data) {
		if (data.data.Id != 0) {
			this.ClientCode.setDisabled(true);
		}
		else {
			this.ClientCode.setDisabled(false);
		}
		var storeItems = [];
		outletColumnsData = data.moreInfo.records;
		for (var j = 0; len = outletColumnsData.length, j < len; j++) {
			var dataObj = {};
			var comboRecord = outletColumnsData[j];
			dataObj.LookupId = comboRecord[0];
			dataObj.DisplayValue = comboRecord[0];
			storeItems.push(dataObj);
		}
		var jsonData = {};
		jsonData.data = storeItems;
		this.outletColumnstore.loadData(jsonData);
		this.outletColumnMultiSelect.setValue(data.data.OutletColumns);
	},
	onCheckChange: function (node, checked) {
		this.childNodeCount += node.childNodes.length;
		node.eachChild(function (child) {
			child.ui.toggleCheck(checked);
		}, this);
		this.processNode++;
		var ids = '';
		this.tree.getChecked().forEach(function (node) {
			ids += ids.length == 0 ? node.id : ',' + node.id;
		});
		this.salesHierarchyIds.setValue(ids);
		if (this.processNode == this.childNodeCount) {
			this.childNodeCount = 0;
			this.processNode = -1;
			this.loadTerritoryGrid(ids, true);
		}
	},
	onTreeLoad: function () {
		this.tree.expandAll();
		if (this.salesHierarchyArray && this.salesHierarchyArray.length > 0 && this.salesHierarchyArray[0] != 0) {
			//this.tree.suspendEvents();
			this.setTreeValue.defer(3200, this, [this.tree.getRootNode()]);
		}
	},
});

Cooler.Client = new Cooler.Client();
