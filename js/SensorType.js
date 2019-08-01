Cooler.SensorType = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Sensor: {0}',
		listTitle: 'Sensor Type',
		keyColumn: 'SensorTypeId',
		captionColumn: 'Name',
		controller: 'SensorType',
		securityModule: 'SensorType',
		gridConfig: {
			custom: { loadComboTypes: true }
		},
		winConfig: {
			height: 180,
			width: 425
		}
	});
	Cooler.SensorType.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.SensorType, Cooler.Form, {

	listRecord: Ext.data.Record.create([
		{ name: 'SensorTypeId', type: 'int' },
		{ name: 'Name', type: 'string' },
		{ name: 'Manufacturer', type: 'string' },
		{ name: 'ManufacturerId', type: 'int' },
		{ name: 'CreatedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'CreatedByUser', type: 'string' },
		{ name: 'ModifiedOn', type: 'date', convert: Ext.ux.DateLocalizer },
		{ name: 'ModifiedByUser', type: 'string' }
		
	]),

	cm: function () {
		var cm = new Ext.ux.grid.ColumnModel([
			{ header: 'Sensor Name', dataIndex: 'Name' },
			{ header: 'Manufacturer', dataIndex: 'Manufacturer' },
			{ header: 'Created On', dataIndex: 'CreatedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Created By', dataIndex: 'CreatedByUser', type: 'string', width: 150 },
			{ header: 'Modified On', dataIndex: 'ModifiedOn', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Modified By', dataIndex: 'ModifiedByUser', type: 'string', width: 150 }
		]);
		cm.defaultSortable = true;
		return cm;
	},

	createForm: function (config) {
		var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
		var manufacturerCombo = DA.combo.create({ fieldLabel: 'Manufacturer', hiddenName: 'ManufacturerId', baseParams: { comboType: 'Manufacturer' }, width: 200, listWidth: 180, controller: "Combo", allowBlank: false, disabled: disableFieldsOnClientId });
		var tagsPanel = Cooler.Tag();
		this.tagsPanel = tagsPanel;
		var items = [
			{ fieldLabel: 'Sensor Name', name: 'Name', xtype: 'textfield', maxLength: 50, allowBlank: false },
			manufacturerCombo,
			tagsPanel
		];
		Ext.apply(config, {
			defaults: { width: 150 },
			region: 'center',
			items: items
		});
		return config;
	},
	CreateFormPanel: function (config) {

		var grids = [];

		this.childGrids = grids;

		Ext.apply(config, {
			region: 'center',
			height: 100
		});

		this.formPanel = new Ext.FormPanel(config);

		this.on('beforeSave', function (rmsForm, params, options) {
			this.saveTags(this.tagsPanel, params);
		});
		this.on('dataLoaded', function (locationForm, data) {
			this.loadTags(this.tagsPanel, data);
		});
		this.on('beforeLoad', function (param) {
			this.tagsPanel.removeAllItems();
		});
		this.winConfig = Ext.apply(this.winConfig, {
			layout: 'border',
			defaults: { border: false },
			height: 200,
			items: [this.formPanel]
		});
	}
});

Cooler.SensorType = new Cooler.SensorType();