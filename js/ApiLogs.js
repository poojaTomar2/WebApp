Cooler.ApiLogs = new Cooler.Form({
	title: 'Api Log',
	controller: 'ApiLogs',
	disableAdd: true,
	allowExport: false,
	securityModule: 'ApiLogs',
	gridConfig: {
		multiLineToolbar: true,
	},
	hybridConfig: function () {
		return [
			this.rowExpander,
			{ dataIndex: 'Id', type: 'string', header: 'Id', hidden: true },
			{ header: 'Time', dataIndex: 'Time', type: 'date', width: 150, sortable: false, renderer: ExtHelper.renderer.DateTime, convert: function (v) { return new Date(v); } },
			//{ header: 'Gateway', dataIndex: 'Gateway', type: 'string', sortable: false, filterable: true },
			//{ header: 'Serial#', dataIndex: 'SerialNumber', type: 'string', width: 50, sortable: false },
			{ header: 'Session', dataIndex: 'Session', type: 'string', width: 260, sortable: false, filterable: true },
			{ header: 'Category', dataIndex: 'Category', type: 'string', width: 550, sortable: false, filterable: true },
			//{ header: 'Asset#', dataIndex: 'AssetSerialNumber', type: 'string', sortable: false },
			//{ header: 'Location#', dataIndex: 'LocationCode', type: 'string', sortable: false },
			//{ header: 'Location', dataIndex: 'LocationName', type: 'string', width: 200, sortable: false },
			//{ header: 'City', dataIndex: 'City', type: 'string', sortable: false },
			//{ header: 'State', dataIndex: 'State', type: 'string', sortable: false },
			//{ header: 'Country', dataIndex: 'Country', type: 'string', sortable: false },
			//{ header: 'Client', dataIndex: 'Client', type: 'string', sortable: false },
			{ header: 'IP', dataIndex: 'IP', type: 'string', filterable: true, sortable: false }
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
			grid.baseParams.startDate = Cooler.DateOptions.DayStart();
			grid.baseParams.endDate = Cooler.DateOptions.DayEnd();
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

	rowExpander: new Ext.grid.RowExpander({
		header: " ",
		listeners: {
			'beforeexpand': function (expander, record, body, rowIndex) {
				if (record.loadedBody) {
					return;
				}
				Ext.Ajax.request({
					url: EH.BuildUrl('ApiLogs'),
					disableCaching: true,
					params: { action: 'Load', Id: record.data.Id },
					success: function (response, options) {
						record.loadedBody = true;
						body.style.overflow = 'auto';
						body.innerHTML = Ext.decode(response.responseText);
					},
					failure: function (error) {
						console.log(error);
					}
				});
			}
		}
	}),

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
		var getDatesObj = $.grep(filterFields, function (e) { return e.getName() == 'startDate' || e.getName() == 'endDate'; });
		if (getDatesObj.length == 2) {
			var sDateTime = getDatesObj[0].getValue();
			var eDateTime = getDatesObj[1].getValue();

			if (sDateTime != '' && eDateTime != '') {
				if (sDateTime > eDateTime) {
					Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
					return;
				}
			}
		}
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
			if (field.xtype == "xdatetime") {
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

		gridConfig.plugins = [this.rowExpander];
		var timeStore = new Ext.data.JsonStore({
			fields: ['Name', 'Value', 'start', 'end'],
			data: [
				{ Name: "Today", Value: "Today", start: 'DayStart', end: 'DayEnd' },
				{ Name: "This Week", Value: "ThisWeek", start: 'WeekStart', end: 'WeekEnd' },
				{ Name: "This Month", Value: "ThisMonth", start: 'MonthStart', end: 'MonthEnd' },
				{ Name: "This Year", Value: "ThisYear", start: 'YearStart', end: 'YearEnd' },
				{ Name: "The Day So Far", Value: "TheDaySoFar", start: 'DayStart', end: 'Now' },
				{ Name: "Week To Date", Value: "WeekTodate", start: 'WeekStart', end: 'DayEnd' },
				{ Name: "Month To Date", Value: "MonthToDate", start: 'MonthStart', end: 'DayEnd' },
				{ Name: "Year To Date", Value: "YearToDate", start: 'YearStart', end: 'DayEnd' },
				{ Name: "Yesterday", Value: "Yesterday", start: 'YesterdayStart', end: 'YesterdayEnd' },
				{ Name: "Day Before Yesterday", Value: "DayBeforeYesterday", start: 'DayBeforeYesterdayStart', end: 'DayBeforeYesterdayEnd' },
				{ Name: "This Day Last Week", Value: "ThisDayLastWeek", start: 'ThisDayLastWeekStart', end: 'ThisDayLastWeekEnd' },
				{ Name: "Previous Week", Value: "PreviousWeek", start: 'PreviousWeekStart', end: 'PreviousWeekEnd' },
				{ Name: "Previous Month", Value: "PreviousMonth", start: 'PreviousMonthStart', end: 'PreviousMonthEnd' },
				{ Name: "Previous Year", Value: "PreviousYear", start: 'PreviousYearStart', end: 'PreviousYearEnd' },
				{ Name: "Last 15 Minutes", Value: "Last15Minutes", start: 'Last15Minutes', end: 'Now' },
				{ Name: "Last 30 Minutes", Value: "Last30Minutes", start: 'Last30Minutes', end: 'Now' },
				{ Name: "Last 1 Hour", Value: "Last1Hour", start: 'Last1Hour', end: 'Now' },
				{ Name: "Last 4 Hours", Value: "Last4Hours", start: 'Last4Hours', end: 'Now' },
				{ Name: "Last 12 Hours", Value: "Last12Hours", start: 'Last12Hours', end: 'Now' },
				{ Name: "Last 24 Hours", Value: "Last24Hours", start: 'Last24Hours', end: 'Now' },
				{ Name: "Last 7 Days", Value: "Last7Days", start: 'Last7Days', end: 'Now' },
				{ Name: "Last 30 Days", Value: "Last30Days", start: 'Last30Days', end: 'Now' },
				{ Name: "Last 60 Days", Value: "Last60Days", start: 'Last60Days', end: 'Now' },
				{ Name: "Last 90 Days", Value: "Last 90 Days", start: 'Last90Days', end: 'Now' },
				{ Name: "Last 6 Months", Value: "Last6Months", start: 'Last6Months', end: 'Now' },
				{ Name: "Last 1 Year", Value: "Last1Year", start: 'Last1Year', end: 'Now' },
				{ Name: "Last 2 Years", Value: "Last2Years", start: 'Last2Years', end: 'Now' },
				{ Name: "Last 5 Years", Value: "Last5Years", start: 'Last5Years', end: 'Now' }
			]
		});

		var timeCombo = DA.combo.create({
			name: 'period', fieldLabel: 'Time', value: 'Today', allowBlank: false, width: 125, header: 'Today', store: timeStore, displayField: 'Name', valueField: 'Value', listWidth: 220, mode: 'local', listeners: {
				select: this.onPeriodChange,
				scope: this
			}
		});

		gridConfig.custom.tbar = [
			'-',
			'Category',
			{
				xtype: 'combo',
				name: 'Category',
				cls: 'x-form-text',
				inputType: 'search',
				triggerAction: 'all',
				store: [
					['', 'All'],
					['iFSAData', 'iFSA API'],
					['ProductionToolDeviceRegistration', 'ProductionToolDeviceRegistration API'],
					['SESImage', 'SES API'],
					['SmartDeviceTransaction', 'SmartDeviceTransaction API'],
					['SyncData', 'SyncData API'],
					['MobileApi', 'Mobile API'],
					['MobileV2', 'MobileV2 API'],
					['Consumer', 'Consumer API'],
					['ConsumerV2', 'ConsumerV2 API'],
					['PushEquipmentData_CCEP', 'Push Equipment Data CCEP API']
				],
				plugins: [
					new Cooler.plugins.Search()
				]
			},
			'&nbsp;Time',
			timeCombo,
			'&nbsp;Start Date',
			{
				xtype: 'xdatetime', text: 'period', name: 'startDate', mode: 'local', valueField: 'period', store: timeStore, value: Cooler.DateOptions.DayStart(), scope: this, format: DA.Security.info.Tags.DateFormat
			},
			'&nbsp;End Date',
			{
				xtype: 'xdatetime', text: 'period', name: 'endDate', mode: 'local', valueField: 'period', store: timeStore, value: Cooler.DateOptions.DayEnd(), scope: this, format: DA.Security.info.Tags.DateFormat
			},
			'&nbsp;Session',
			{ name: 'Session', xtype: 'ux.form.search' },
			'&nbsp;IP',
			{ name: 'IP', xtype: 'ux.form.search', width: 80 },
			'&nbsp;Message',
			{ name: 'Message', xtype: 'ux.form.search' },
			{ xtype: 'button', text: 'Search', handler: this.onSearch, scope: this },
			{ xtype: 'button', text: 'Clear Search', handler: this.onClearSearch, scope: this }
		];
	},
	onPeriodChange: function (field, value) {
		if (!value) {
			return;
		}
		this.grid.getTopToolbar().items.each(function (x) {
			if (x.name == "startDate") {
				x.setValue(Cooler.DateOptions[value.data.start]());
			}
			if (x.name == "endDate") {
				x.setValue(Cooler.DateOptions[value.data.end]());
			}
		});
	},

	createGrid: function (config, copy, copyOptions, overrideConfig) {
		var combo;
		if (config.isChildGrid) {
			overrideConfig = overrideConfig || {};
			Ext.applyIf(overrideConfig, {
				autoFilter: null,
				plugins: [this.rowExpander]
			});
			combo = new Ext.form.ComboBox({
				xtype: 'combo',
				name: 'Category',
				cls: 'x-form-text',
				inputType: 'search',
				triggerAction: 'all',
				store: [
					['-', 'All'],
					['iFSAData', 'iFSA API'],
					['ProductionToolDeviceRegistration', 'ProductionToolDeviceRegistration API'],
					['SESImage', 'SES API'],
					['SmartDeviceTransaction', 'SmartDeviceTransaction API'],
					['SyncData', 'SyncData API'],
					['MobileApi', 'Mobile API'],
					['MobileV2', 'MobileV2 API'],
					['Consumer', 'Consumer API'],
					['ConsumerV2', 'ConsumerV2 API']
				],
				plugins: [
					new Cooler.plugins.Search()
				]
			});
			var tBar = [
				'Category',
				combo
			];
			config.tbar = tBar;
			config.tBar = true;
		}
		var grid = Cooler.Form.prototype.createGrid.call(this, config, copy, copyOptions, overrideConfig);

		if (combo) {
			combo.on({
				'change': grid.loadFirst,
				'select': grid.loadFirst,
				scope: grid
			});
			grid.store.on('beforeload', function (store) {
				var category = combo.getValue();
				if (category === '-') {
					category = '';
				}
				store.baseParams.Category = category;
			});
		}

		return grid;
	}
});