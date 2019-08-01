Cooler.LocationSOVIForm = Ext.extend(Cooler.Form, {

	controller: 'Location',

	keyColumn: 'RowNumber',

	title: 'Outlet SOVI',

	disableAdd: true,

	disableDelete: true,

	//allowExport: false,

	hideExtraColumns: false,
	securityModule: 'SOVIReport',

	hybridConfig: function () {
		return [
			{ dataIndex: 'LocationId', type: 'int' },
			{ dataIndex: 'Name', type: 'string', header: 'Outlet', width: 220 },
			{ dataIndex: 'Client', type: 'string', header: 'CoolerIoT Client', width: 100 },
			{ dataIndex: 'Code', type: 'string', header: 'Outlet Code', width: 90, hyperlinkAsDoubleClick: true },
			{ dataIndex: 'Date', header: 'Date', width: 100, type: 'date', renderer: ExtHelper.renderer.Date, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CurrentClientTime', header: 'Current Location Time', width: 130, type: 'date', renderer: ExtHelper.renderer.DateTime, sortable: false, menuDisabled: true, quickFilter: false },
			//Colas columns
			{ dataIndex: 'ColasPercentage12To9', type: 'string', header: 'Colas % 12 AM - 9 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ColasPercentage9To12', type: 'string', header: 'Colas % 9 AM - 12 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ColasPercentage12To3', type: 'string', header: 'Colas % 12 PM - 3 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ColasPercentage3To6', type: 'string', header: 'Colas % 3 PM To 6 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ColasPercentage6To9', type: 'string', header: 'Colas % 6 PM - 9 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'ColasPercentage9To12MidNight', type: 'string', header: 'Colas % 9 PM To 12 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },

			//Flavours columns
			{ dataIndex: 'FlavoursPercentage12To9', type: 'string', header: 'Flavours % 12 AM - 9 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FlavoursPercentage9To12', type: 'string', header: 'Flavours % 9 AM - 12 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FlavoursPercentage12To3', type: 'string', header: 'Flavours % 12 PM - 3 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FlavoursPercentage3To6', type: 'string', header: 'Flavours % 3 PM To 6 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FlavoursPercentage6To9', type: 'string', header: 'Flavours % 6 PM - 9 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'FlavoursPercentage9To12MidNight', type: 'string', header: 'Flavours % 9 PM To 12 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },

			//Combine columns
			{ dataIndex: 'CombinePercentage12To9', type: 'string', header: 'Colas + Flavours % 12 AM - 9 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CombinePercentage9To12', type: 'string', header: 'Colas + Flavours  % 9 AM - 12 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CombinePercentage12To3', type: 'string', header: 'Colas + Flavours  % 12 PM - 3 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CombinePercentage3To6', type: 'string', header: 'Colas + Flavours  % 3 PM To 6 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CombinePercentage6To9', type: 'string', header: 'Colas + Flavours  % 6 PM - 9 PM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false },
			{ dataIndex: 'CombinePercentage9To12MidNight', type: 'string', header: 'Colas + Flavours  % 9 PM To 12 AM', align: 'right', width: 100, sortable: false, menuDisabled: true, quickFilter: false }

		];
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	beforeShowList: function (config) {
		var tbarItems = [];
		var date = Cooler.DateOptions.AddDays(new Date());
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: date, maxValue: date, format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: date, maxValue: date, format: DA.Security.info.Tags.DateFormat });
		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: this.onSearch, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Clear Search', handler: this.onClear, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.apply(config.gridConfig, {
			groupField: 'Name',
			plugins: [new Ext.grid.GroupSummary(), new Ext.ux.grid.GridSummary()],
			viewConfig: {
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]} )'
			},
			custom :{ tbar: tbarItems }
		});
	},

	onSearch: function () {
		if (!Ext.isEmpty(this.startDateField.getValue())) {

			var sDateTime = this.startDateField.getValue();
			var eDateTime = this.endDateField.getValue();

			if (sDateTime != '' && eDateTime != '') {
				if (sDateTime > eDateTime) {
					Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
					return;
				}
				else {
					if (this.dateDifferanceInDays(sDateTime, eDateTime) > 92) {
						Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
						return;
					}
				}
			}

			var grid = this.grid,
				store = grid.getStore();
			var startDate = this.startDateField.getValue();
			var endDate = this.endDateField.getValue();
			if (Ext.isEmpty(endDate)) {
				endDate = Cooler.DateOptions.AddDays(new Date());
			}
			store.baseParams.limit = this.grid.getBottomToolbar().pageSize;
			store.baseParams.startDate = startDate;
			store.baseParams.endDate = endDate;
			this.grid.loadFirst();
			delete store.baseParams['limit'];
		}
		else {
			Ext.Msg.alert('Alert', 'Start Date Missing');
		}
	},

	onClear: function () {
		var grid = this.grid,
			store = grid.getStore();
		this.startDateField.reset();
		this.endDateField.reset();
		delete store.baseParams.startDate;
		delete store.baseParams.endDate;
		this.grid.loadFirst();
	},

	beforeRemoveFilter: function () {
		this.module.onClear()
	}
});
Cooler.LocationSOVI = new Cooler.LocationSOVIForm({ uniqueId: 'LocationSOVI' });