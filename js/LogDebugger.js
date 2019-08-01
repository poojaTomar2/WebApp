Cooler.LogDebugger = new Cooler.Form({
	title: 'Debug Log',
	controller: 'LogDebugger',
	securityModule: 'DebugLogs',
	disableAdd: true,
	allowExport: false,

	comboTypes: [
		'Client',
		'Country'
	],

	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup, id: 'LookupId' })
	},

	hybridConfig: function () {
		return [
			{ header: 'Type', type: 'string', dataIndex: '_type', filterable: true },
			{ header: 'Id', type: 'string', dataIndex: 'Id', hidden: true },
			{ header: 'Event Type', type: 'int', dataIndex: 'EventTypeId', renderer: this.renderers.eventType },
			{ header: 'SmartDeviceId', type: 'int', dataIndex: 'SmartDeviceId', hidden: true },
			{ header: 'GatewayId', type: 'int', dataIndex: 'GatewayId', hidden: true },
			{ header: 'Device#', type: 'int', dataIndex: 'DeviceSerial', width: 60, filterable: true },
			{ header: 'Gateway Mac', type: 'string', dataIndex: 'GatewayMac', filterable: true },
			{ header: 'Gateway#', type: 'string', dataIndex: 'GatewaySerialNumber', width: 60, filterable: true },
			{ header: 'EventId', type: 'int', dataIndex: 'EventId', width: 50 },
			{ header: 'Event Time', type: 'date', dataIndex: 'EventTime', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
			{ header: 'Created On', type: 'date', dataIndex: 'CreatedOn', renderer: Cooler.renderer.DateTimeWithLocalTimeZone, width: 180, convert: Ext.ux.DateLocalizer },
			{ header: 'AssetId', type: 'int', dataIndex: 'AssetId', hidden: true },
			{ header: 'Client', type: 'int', dataIndex: 'ClientId', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Client }) },
			{ header: 'Country', type: 'int', dataIndex: 'CountryId', renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.Country }) },
			{ header: 'StateId', type: 'int', dataIndex: 'StateId', width: 50 },
			{ header: 'LocationId', type: 'int', dataIndex: 'LocationId', width: 50 },
			{ header: 'City', type: 'string', dataIndex: 'City' },
			{ header: 'TimeZoneId', type: 'int', dataIndex: 'TimeZoneId', hidden: true },
			{ header: 'Light', type: 'int', dataIndex: 'LightIntensity', width: 50 },
			{ header: 'Temp.', type: 'float', dataIndex: 'Temperature', renderer: ExtHelper.renderer.Float(2), width: 50 },
			{ header: 'Humidity', type: 'int', dataIndex: 'Humidity', width: 50 },
			{ header: 'Sound', type: 'int', dataIndex: 'SoundLevel', width: 50, hidden: true },
			{ header: 'Open', type: 'int', dataIndex: 'IsDoorOpen', renderer: ExtHelper.renderer.Boolean, width: 50 },
			{ header: 'Open Time', type: 'date', dataIndex: 'DoorOpen', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
			{ header: 'Open Dur.', type: 'int', dataIndex: 'DoorOpenDuration', width: 50 },
			{ header: 'Event Type Id', type: 'int', dataIndex: 'EventTypeId' },
			{ header: 'Event Type', type: 'string', dataIndex: 'EventType' },
			{ header: 'Power Status Id', type: 'int', dataIndex: 'PowerStatusId' },
			{ header: 'Battery', type: 'int', dataIndex: 'BatteryLevel', width: 50 },
			{ header: 'Start', type: 'date', dataIndex: 'StartTime', rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone, width: 180 },
			{ header: 'Movement Type Id', type: 'int', dataIndex: 'MovementTypeId', hidden: true },
			{ header: 'Movement Type', type: 'string', dataIndex: 'MovmeentType' },
			{ header: 'Movement Dur', type: 'int', dataIndex: 'MovementDuration' },
			{ header: 'Latitude', type: 'float', dataIndex: 'Latitude', renderer: ExtHelper.renderer.Float(8), width: 80 },
			{ header: 'Longitude', type: 'float', dataIndex: 'Longitude', renderer: ExtHelper.renderer.Float(8), width: 80 },
			{ header: 'Power Status', type: 'bool', dataIndex: 'PowerStatus', renderer: this.renderers.powerStatus, width: 50 },
			{ header: 'Prev. Power', type: 'bool', dataIndex: 'PreviousPowerStatus', renderer: this.renderers.powerStatus, width: 50 },
			{ header: 'Sequence', type: 'int', dataIndex: 'Sequence', width: 50 },
			{ header: 'Angle', type: 'int', dataIndex: 'Angle', width: 50 },
			{ header: 'Address', type: 'int', dataIndex: 'Address', width: 50 },
			{ header: 'Rssi', type: 'int', dataIndex: 'Rssi', width: 50 },
			{ header: 'Command#', type: 'int', dataIndex: 'SmartDeviceTypeCommandId', width: 50 },
			{ header: 'Cell Loc Id', type: 'int', dataIndex: 'CellLocationId' },
			{ header: 'Cell Type', type: 'int', dataIndex: 'CellType', width: 50 },
			{ header: 'Receive Q.', type: 'int', dataIndex: 'ReceiveQuality', width: 50 },
			{ header: 'Receive L.', type: 'int', dataIndex: 'ReceiveLevel', width: 50 },
			{ header: 'Info', type: 'string', dataIndex: 'Info', width: 50 },
			{ header: 'MCC', type: 'int', dataIndex: 'MCC', width: 50 },
			{ header: 'MNC', type: 'int', dataIndex: 'MNC', width: 50 },
			{ header: 'CellId', type: 'int', dataIndex: 'CellId', width: 50 },
			{ header: 'Lac', type: 'int', dataIndex: 'Lac', width: 50 }
		];
	},

	renderers: {
		powerStatus: function (value) {
			if (typeof value === 'boolean') {
				return value ? 'On' : 'Off';
			}
			return value;
		},
		eventType: function (value, meta, record) {

			var data = record.data;
			var type = data._type;
			var store;
			if (type === "SmartDeviceMovement") {
				store = Cooler.comboStores.MovementType;
				value = data.MovementTypeId;
			} else {
				store = Cooler.comboStores.EventType;
			}
			var rec = store.getById(value);
			if (rec) {
				return rec.get("DisplayValue");
			} else {
				return value;
			}
		}
	},

	onColumnFilter: function (menuItem) {

		var mainMenu = menuItem.parentMenu, dataIndex = menuItem.parentMenu.dataIndex, rowIndex = mainMenu.rowIndex, grid = this.grid, tbar = grid.getTopToolbar();
		var field = tbar.items.find(function (x) {
			return x.isFormField && x.getName() === dataIndex;
		});
		if (field) {
			field.setValue(grid.store.getAt(rowIndex).get(dataIndex));
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
			field.reset();
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
			'Type',
			{ name: '_type', xtype: 'ux.form.search', maxLength: 25 },
			'Device#',
			{
				name: 'DeviceSerial',
				xtype: 'ux.form.search',
				maxLength: 20,
				maskRe: /[0-9]/,
				width: 100
			},
			'Gateway MAC',
			{
				name: 'GatewayMac',
				xtype: 'ux.form.search',
				maxLength: 17,
				maskRe: /[0-9a-f\:]/,
				width: 110,
				listeners: {
					change: this.onGatewayChange,
					scope: this
				}
			},
			'&nbsp;Gateway#',
			{
				name: 'GatewaySerialNumber',
				xtype: 'ux.form.search',
				maxLength: 20,
				maskRe: /[0-9]/,
				width: 110,
				listeners: {
					change: this.onGatewayChange,
					scope: this
				}
			},
			/*'&nbsp;Time',
			timeCombo,
			'&nbsp;StartDate',
			{
				xtype: 'xdatetime', text: 'period', name: 'startDate', mode: 'local', valueField: 'period', store: timeStore, value: Cooler.DateOptions.DayStart(), scope: this
			},
			'&nbsp;EndDate',
			{
				xtype: 'xdatetime', text: 'period', name: 'endDate', mode: 'local', valueField: 'period', store: timeStore, value: Cooler.DateOptions.Now(), scope: this
			},*/
			{ xtype: 'button', text: 'Search', handler: this.onSearch, scope: this },
			{ xtype: 'button', text: 'Clear Search', handler: this.onClearSearch, scope: this }
		];
	},

	onGatewayChange: function (field, value) {
		value = field.getValue();
		if (!value) {
			return;
		}
		var fields = this.getFilterFields();
		var fieldToSet = "GatewayMac", valueToSet;
		if (field.name === "GatewaySerialNumber") {
			var macAddressId = Number(value) + Cooler.BaseSerialNumber;
			valueToSet = macAddressId.toString(16);
		} else {
			var macAddress = value.replace(/:/g, "");
			fieldToSet = "GatewaySerialNumber";
			if (macAddress.length === 12) {
				valueToSet = parseInt(macAddress, 16) - Cooler.BaseSerialNumber;
			} else {
				valueToSet = "";
			}
		}
		var fields = this.getFilterFields();
		for (var i = 0, len = fields.length; i < len; i++) {
			var field = fields[i];
			if (field.name === fieldToSet) {
				field.setValue(valueToSet);
				break;
			}
		}
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
		if (config.isChildGrid) {
			overrideConfig = overrideConfig || {};
			Ext.applyIf(overrideConfig, {
				autoFilter: null
			});
		}
		return Cooler.Form.prototype.createGrid.call(this, config, copy, copyOptions, overrideConfig);
	}
});