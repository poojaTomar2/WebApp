Cooler.DataSummaryCl = Ext.extend(Cooler.Form, {
	constructor: function (config) {
		Cooler.DataSummaryCl.superclass.constructor.call(this, config || {});
		Ext.applyIf(this.gridConfig, {
			defaults: {}
		});
		Ext.applyIf(this.gridConfig.defaults, {
			sort: { dir: 'DESC', sort: this.keyColumn }
		});
	},

	title: 'Data Summary',
	controller: 'DataSummary',
	disableAdd: true,

	comboTypes: [
		'Client'
	],

	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	hybridConfig: function () {
		return [
			{ header: 'Date', type: 'date', dataIndex: 'Date', renderer: ExtHelper.renderer.Date },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'AssetId', type: 'int', dataIndex: 'AssetId', hidden: true, sortable: false },
			{ header: 'Asset Technical ID', type: 'int', dataIndex: 'TechnicalIdentificationNumber', sortable: false },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', sortable: false },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', sortable: false, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'Location', sortable: false },
			{ header: 'City', type: 'string', dataIndex: 'LocationCity', sortable: false },
			{ header: 'State', type: 'string', dataIndex: 'State', sortable: false },
			{ header: 'Country', type: 'string', dataIndex: 'Country', sortable: false },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ header: 'Health', type: 'int', dataIndex: 'HealthRecords', width: 50, hidden: true, sortable: false, align: 'right' },
			{ header: 'Environment', type: 'int', dataIndex: 'EnvironmentRecords', width: 50, hidden: true, sortable: false, align: 'right' },
			{ header: 'Door', type: 'int', dataIndex: 'Door', width: 50, sortable: false, align: 'right' },
			{ header: 'Movement', type: 'int', dataIndex: 'Movement', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Hub Movement', type: 'int', dataIndex: 'HubMovement', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'GPS', type: 'int', dataIndex: 'GPS', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Power', type: 'int', dataIndex: 'Power', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Light Intensity 60 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'LightIntesity60Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Light Intensity 70 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'LightIntesity70Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Light Intensity 80 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'LightIntesity80Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Temperature 60 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'Temperature60Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Temperature 70 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'Temperature70Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Temperature 80 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'Temperature80Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Minimum Battery Level', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'MinBatteryLevel', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Temperature 80 %', renderer: ExtHelper.renderer.Float(2), type: 'float', dataIndex: 'Temperature80Per', width: 50, sortable: false, align: 'right', hidden: true },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'Channel', sortable: false },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', sortable: false },
			{ header: 'Sub Trade Channel Name', type: 'string', dataIndex: 'SubTradeChannel', sortable: false },
			{ header: 'Territory', type: 'string', dataIndex: 'SalesTerritory', sortable: false },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganization', sortable: false },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroup', sortable: false },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOffice', sortable: false }
		];
	},

	onColumnFilter: function (menuItem) {
		var mainMenu = menuItem.parentMenu, dataIndex = menuItem.parentMenu.dataIndex, rowIndex = mainMenu.rowIndex, grid = this.grid, tbar = grid.getTopToolbar();
		var field = tbar.items.find(function (x) {
			return x.isFormField && x.getName() === dataIndex;
		});
		if (field) {
			field.setValue('"' + grid.store.getAt(rowIndex).get(dataIndex) + '"');
		}
		this.onSearch();
	},

	onGridCreated: function (grid) {
		grid.baseParams.DateTimeZone = moment().format('Z').toString();

		if (!grid.isChildGrid) {
			grid.baseParams.startDate = Cooler.DateOptions.AddDays(new Cooler.DateOptions.DayStart(), -7);
			grid.baseParams.endDate = new Date().clearTime().add(Date.DAY, 1);
			var menu = new Ext.menu.Menu({
				items: [
					{
						text: 'Filter',
						iconCls: 'filterIcon'
					}
				],
				listeners: {
					itemclick: this.onColumnFilter,
					scope: this
				}
			});
			grid.on('cellclick', function (grid, rowIndex, columnIndex, e) {
				var col = grid.getColumnModel().config[columnIndex];
				if (!col.filterable) {
					return;
				}
				menu.dataIndex = col.dataIndex;
				menu.rowIndex = rowIndex;
				e.stopEvent();
				menu.showAt(e.getXY());
			});
		}

	},

	getFilterFields: function () {
		var fields = [];
		this.grid.getTopToolbar().items.each(function (x) {
			if (x.isFormField) {
				fields.push(x);
			}
		});
		return fields;
	},

	onSearch: function () {

		var filterFields = this.getFilterFields();

		var store = this.grid.getStore();
		for (var i = 0, len = filterFields.length; i < len; i++) {
			var field = filterFields[i];
			var fieldName = field.getName();
			var value = field.getValue();
			store.baseParams[fieldName] = value;
		}

		this.grid.loadFirst();
	},

	onClearSearch: function () {
		var filterFields = this.getFilterFields();

		var store = this.grid.getStore();
		for (var i = 0, len = filterFields.length; i < len; i++) {
			var field = filterFields[i];
			if (field.xtype == "datefield") {
				field.setValue();
			}
			else {
				field.reset();
			}
		}
		this.onSearch();
	},

	ShowList: function (config, extraOptions) {
		config = config || {};
		Cooler.Form.prototype.ShowList.call(this, config, extraOptions);
	},

	beforeShowList: function (module) {

		var gridConfig = module.gridConfig;
		gridConfig.autoFilter = null;
		gridConfig.custom = { loadComboTypes: true };

		var clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });

		gridConfig.custom.tbar = [
			'-',
			'Date Type',
			new Ext.form.ComboBox({
				xtype: 'combo',
				name: 'DateType',
				cls: 'x-form-text',
				inputType: 'search',
				triggerAction: 'all',
				store: [
					['CreatedOn', 'Created On'],
					['EventTime', 'Event Time']
				],
				value: 'EventTime',
				plugins: [
					new Cooler.plugins.Search()
				]
			}),
			'&nbsp;Client',
			clientCombo,
			'&nbsp;Start Date',
			{ xtype: 'datefield', name: 'startDate', value: Cooler.DateOptions.AddDays(new Cooler.DateOptions.DayStart(), -7) },
			'&nbsp;End Date',
			{ xtype: 'datefield', name: 'endDate', value: new Date().clearTime().add(Date.DAY, 1) },
			{ xtype: 'button', text: 'Search', handler: this.onSearch, scope: this },
			{ xtype: 'button', text: 'Clear Search', handler: this.onClearSearch, scope: this }
		];
	},

	createGrid: function (config, copy, copyOptions, overrideConfig) {
		if (config.isChildGrid) {
			overrideConfig = overrideConfig || {};
			Ext.applyIf(overrideConfig, {
				autoFilter: null
			});
		}
		return Cooler.Form.prototype.createGrid.call(this, config, copy, copyOptions, overrideConfig);
	}
});

Cooler.DataSummary = new Cooler.DataSummaryCl({ uniqueId: 'DataSummary' });
Cooler.DataSummaryAsset = new Cooler.DataSummaryCl({ uniqueId: 'DataSummaryAsset' });