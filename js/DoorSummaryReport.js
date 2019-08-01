Cooler.DoorSummaryReportForm = Ext.extend(Cooler.Form, {

	controller: 'DoorSummaryReport',

	keyColumn: 'SmartDeviceDoorStatusId',

	title: 'Door Summary',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'DoorSummaryReport',
	constructor: function (config) {
		Cooler.DoorSummaryReportForm.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'DESC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			},
			listeners: {
				'cellclick': this.onListGridCellClick,
				scope: this
			}
		});
	},
	comboTypes: [
           'TimeZone'
	],
	comboStores: {
		TimeZone: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [

			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'int', dataIndex: 'TimeZoneId' },
			{ type: 'int', dataIndex: 'AssetId' },
			{ type: 'string', dataIndex: 'AssetMoved' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Asset Technical ID', type: 'string', dataIndex: 'TechnicalIdentificationNumber', width: 150 },
			{ header: 'Asset Equipment Number', type: 'string', dataIndex: 'EquipmentNumber', width: 150 },
			{ header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 110, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 170 },
            { header: 'Smart Device Serial Number', type: 'string', dataIndex: 'SmartDevice', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Installation Date/Time', type: 'date', dataIndex: 'AssetAssociatedOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Data Last Uploaded', type: 'date', dataIndex: 'CreatedOn', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Data Last Recorded', type: 'date', dataIndex: 'EventTime', width: 150, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Last Upload - Last Record (in days hrs > 24)', type: 'int', dataIndex: 'LastUpload', width: 150, align: 'right' },
			{ header: 'Installation Date/Time - Last Record (days hrs > 24)', type: 'int', dataIndex: 'LastRecordFromInstallation', width: 150, align: 'right' },
			{ header: 'Total Door For Selected Period', type: 'int', dataIndex: 'DoorCount', width: 100, align: 'right', hyperlinkAsDoubleClick: true },
			{ header: '(P) Total Door For Selected Period', type: 'int', dataIndex: 'CompareDoorCount', width: 100, align: 'right', hyperlinkAsDoubleClick: true },
			{ header: 'Door (Last 7 days)', type: 'int', dataIndex: 'DoorLast7', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: '(P) Door (Last 7 days)', type: 'int', dataIndex: 'CompareDoorLast7', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: 'Door (Last 14 days)', type: 'int', dataIndex: 'DoorLast14', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: '(P) Door (Last 14 days)', type: 'int', dataIndex: 'CompareDoorLast14', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: 'Door (Last 30 days)', type: 'int', dataIndex: 'DoorLast30', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: '(P) Door (Last 30 days)', type: 'int', dataIndex: 'CompareDoorLast30', width: 100, align: 'right', hyperlinkAsDoubleClick: true, hidden: true },
			{ header: 'Average Door', type: 'float', dataIndex: 'AvgDoorCount', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: '(P) Average Door', type: 'float', dataIndex: 'CompareAvgDoorCount', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Average Door (Last 7 days)', type: 'float', dataIndex: 'Avg7Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: '(P) Average Door (Last 7 days)', type: 'float', dataIndex: 'CompareAvg7Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Average Door (Last 14 days)', type: 'float', dataIndex: 'Avg14Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: '(P) Average Door (Last 14 days)', type: 'float', dataIndex: 'CompareAvg14Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: 'Average Door (Last 30 days)', type: 'float', dataIndex: 'Avg30Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: '(P) Average Door (Last 30 days)', type: 'float', dataIndex: 'CompareAvg30Days', width: 100, align: 'right', renderer: ExtHelper.renderer.Float(2) },
			{ header: '# of days with records(for period)', type: 'int', dataIndex: 'DayCount', width: 100, align: 'right' },
			{ header: '(P) # of days with records(for period)', type: 'int', dataIndex: 'CompareDayCount', width: 100, align: 'right' },
			{ header: '# of days with records(Last 7 days)', type: 'int', dataIndex: 'DayCount7', width: 100, align: 'right', hidden: true },
			{ header: '(P) # of days with records(Last 7 days)', type: 'int', dataIndex: 'CompareDayCount7', width: 100, align: 'right', hidden: true },
			{ header: '# of days with records(Last 14 days)', type: 'int', dataIndex: 'DayCount14', width: 100, align: 'right', hidden: true },
			{ header: '(P) # of days with records(Last 14 days)', type: 'int', dataIndex: 'CompareDayCount14', width: 100, align: 'right', hidden: true },
			{ header: '# of days with records(Last 30 days)', type: 'int', dataIndex: 'DayCount30', width: 100, align: 'right', hidden: true },
			{ header: '(P) # of days with records(Last 30 days)', type: 'int', dataIndex: 'CompareDayCount30', width: 100, align: 'right', hidden: true },
			{ header: '# of days without record', type: 'int', dataIndex: 'DayWithoutRecord', width: 100, align: 'right' },
			{ header: '(P) # of days without record', type: 'int', dataIndex: 'CompareDayWithoutRecord', width: 100, align: 'right' },
			{ header: 'Below Threshold', type: 'string', dataIndex: 'BelowThreshold', width: 100, align: 'right' },
			{ header: '(P) Below Threshold', type: 'string', dataIndex: 'CompareBelowThreshold', width: 100, align: 'right' },
			{ header: 'Records Daily Average', type: 'float', dataIndex: 'RecordDailyAverage', width: 100, align: 'right' },
			{ header: 'Past Records Daily Average', type: 'float', dataIndex: 'CompareRecordDailyAverage', width: 100, align: 'right' },
			{ header: 'City', type: 'string', dataIndex: 'City', width: 110, quickFilter: false },
			{ header: 'State', type: 'string', dataIndex: 'State', width: 110, hidden: true },
			{ header: 'Country', type: 'string', dataIndex: 'Country', width: 110 },
			{ header: 'Trade Channel', type: 'string', dataIndex: 'Channel', width: 110 },
			{ header: 'Trade Channel Code', hidden: true, type: 'string', dataIndex: 'ChannelCode', width: 100, hidden: true },
			{ header: 'Customer Tier', type: 'string', dataIndex: 'CustomerTier', width: 110 },
			{ header: 'Customer Tier Code', hidden: true, type: 'string', dataIndex: 'CustomerTierCode', width: 100, hidden: true },
			{ header: 'Sub Trade Channel', type: 'string', dataIndex: 'SubTradeChannel', width: 150 },
			{ header: 'Sub Trade Channel Code', hidden: true, type: 'string', dataIndex: 'SubTradeChannelCode', width: 150, hidden: true },
			{ header: 'Sales Organization', type: 'string', dataIndex: 'SalesOrganizationName', width: 150 },
			{ header: 'Sales Organization Code', hidden: true, type: 'string', dataIndex: 'SalesOrganizationCode', width: 150, hidden: true },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
			{ header: 'Sales Office Code', hidden: true, type: 'string', dataIndex: 'SalesOfficeCode', width: 150, hidden: true },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Group Code', hidden: true, type: 'string', dataIndex: 'SalesGroupCode', width: 150, hidden: true },
            { header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Territory Code', hidden: true, type: 'string', dataIndex: 'SalesTerritoryCode' },
		    { header: 'Time Zone', dataIndex: 'TimeZoneId', width: 250, type: 'int', store: this.comboStores.TimeZone, renderer: ExtHelper.renderer.Lookup({ store: this.comboStores.TimeZone }), displayIndex: 'TimeZone' },
			{ header: 'Client', type: 'string', dataIndex: 'ClientName', width: 110 }
		];
	},

	dateTimeWithLocalTimeZone: function (v, m, r, a, b, grid) {
		var endDate = grid.baseParams.EndDate;
		var compareEndDate = new Date(endDate).add(Date.DAY, 1);
		if (endDate) {
			if (v > compareEndDate) {
				v = endDate;
			}
		}
		if (!Ext.isDate(v)) {
			return v;
		} else {
			var timeZone = ' ' + v.getTimezone();
			return v.format(ExtHelper.DateTimeFormat) + timeZone;
		}
	},

	onListGridCellClick: function (grid, rowIndex, e) {
		var cm = grid.getColumnModel();
		var column = this.cm.config[e];
		var row = grid.getStore().getAt(rowIndex);
		var assetId = row.get('AssetId');
		if (!assetId || (this.selectedAssetId && this.selectedAssetId === assetId && this.selectedDataIndex === column.dataIndex)) {
			return false;
		}
		var isValidColumn = false;
		var startDate, endDate;
		switch (column.dataIndex) {
			case 'DoorLast7':
				isValidColumn = true;
				startDate = Cooler.DateOptions.AddDays(this.endDateField.getValue(), -6);
				endDate = this.endDateField.getValue();
				break;
			case 'DoorLast14':
				isValidColumn = true;
				startDate = Cooler.DateOptions.AddDays(this.endDateField.getValue(), -13);
				endDate = this.endDateField.getValue();
				break;
			case 'DoorLast30':
				isValidColumn = true;
				startDate = Cooler.DateOptions.AddDays(this.endDateField.getValue(), -29);
				endDate = this.endDateField.getValue();
				break;
			case 'DoorCount':
				isValidColumn = true;
				startDate = this.startDateField.getValue();
				endDate = this.endDateField.getValue();
				break;
			case 'CompareDoorLast7':
				if (this.validationCheckbox.checked) {
					isValidColumn = true;
					startDate = Cooler.DateOptions.AddDays(this.compareEndDateField.getValue(), -6);
					endDate = this.compareEndDateField.getValue();
				}
				break;
			case 'CompareDoorLast14':
				if (this.validationCheckbox.checked) {
					isValidColumn = true;
					startDate = Cooler.DateOptions.AddDays(this.compareEndDateField.getValue(), -13);
					endDate = this.compareEndDateField.getValue();
				}
				break;
			case 'CompareDoorLast30':
				if (this.validationCheckbox.checked) {
					isValidColumn = true;
					startDate = Cooler.DateOptions.AddDays(this.compareEndDateField.getValue(), -29);
					endDate = this.compareEndDateField.getValue();
				}
				break;
			case 'CompareDoorCount':
				if (this.validationCheckbox.checked) {
					isValidColumn = true;
					startDate = this.compareStartDateField.getValue();
					endDate = this.compareEndDateField.getValue();
				}
				break;


		}
		if (!isValidColumn) {
			this.doorSummaryReportDetailGrid.setDisabled(true);
			this.doorSummaryReportDetailGrid.store.removeAll();
			return false;
		}

		this.selectedAssetId = assetId;
		this.selectedDataIndex = column.dataIndex;
		var grid = this.doorSummaryReportDetailGrid;
		var store = grid.getStore();
		grid.setDisabled(false);
		store.baseParams.AssetId = assetId;
		store.baseParams.StartDate = startDate;
		store.baseParams.EndDate = endDate;
		store.load();
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
		this.grid.baseParams.CompareStartDate = this.compareStartDateField.getValue();
		this.grid.baseParams.CompareEndDate = this.compareEndDateField.getValue();
		this.grid.baseParams.ShowInstalled = this.showInstalledCheckbox.getValue();
		this.grid.baseParams.validationDate = this.validationCheckbox.getValue();
	},
	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.clientCombo = DA.combo.create({ fieldLabel: 'CoolerIoT Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		this.locationCodeTextField = new Ext.form.TextField({ width: 100, name: 'LocationCode' });
		this.locationNameTextField = new Ext.form.TextField({ width: 100, name: 'LocationName' });
		this.assetSerialTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerial' });
		this.startDateField = new Ext.form.DateField({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date(), -6), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.form.DateField({ name: 'endDate', mode: 'local', value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		this.compareStartDateField = new Ext.form.DateField({ name: 'compareStartDate', mode: 'local', maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat }); //value: Cooler.DateOptions.AddDays(new Date(), -13),
		this.compareEndDateField = new Ext.form.DateField({ name: 'compareEndDate', mode: 'local', maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat }); //  value: Cooler.DateOptions.AddDays(new Date(), -7),
		this.showInstalledCheckbox = new Ext.form.Checkbox({ name: 'showInstalled', checked: true });
		this.validationCheckbox = new Ext.form.Checkbox({ name: 'validation', checked: false });  // listeners: { change: this.validationChange, scope: this }

		tbarItems.push('Start Date');
		tbarItems.push(this.startDateField);
		tbarItems.push('End Date');
		tbarItems.push(this.endDateField);
		tbarItems.push(' |');
		tbarItems.push('Validate with Past Date ');
		tbarItems.push(this.validationCheckbox);
		tbarItems.push(' |');
		tbarItems.push('Past Start Date');
		tbarItems.push(this.compareStartDateField);
		tbarItems.push('Past End Date');
		tbarItems.push(this.compareEndDateField);
		tbarItems.push(' |');
		tbarItems.push('Include Installed In Period');
		tbarItems.push(this.showInstalledCheckbox);
		tbarItems.push(' |');
		if (DA.Security.info.Tags.ClientId == 0) {
			tbarItems.push('Client');
			tbarItems.push(this.clientCombo);
		}
		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);

		//this.compareStartDateField.setDisabled(true);
		//this.compareEndDateField.setDisabled(true);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;

				var sDateTime = this.startDateField.getValue();
				var eDateTime = this.endDateField.getValue();
				var cStartDateTime = this.compareStartDateField.getValue();
				var cEndDateTime = this.compareEndDateField.getValue();
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
				if (!Ext.isEmpty(this.clientCombo.getValue())) {
					isGridFilterApply = true;
					var clientNameFilter = this.grid.gridFilter.getFilter('ClientName');
					clientNameFilter.active = true;
					clientNameFilter.setValue(this.clientCombo.getRawValue());
				}

				if (!Ext.isEmpty(this.locationCodeTextField.getValue())) {
					isGridFilterApply = true;
					var locationCodeFilter = this.grid.gridFilter.getFilter('LocationCode');
					locationCodeFilter.active = true;
					locationCodeFilter.setValue(this.locationCodeTextField.getValue());
				}

				if (!Ext.isEmpty(this.locationNameTextField.getValue())) {
					isGridFilterApply = true;
					var locationNameFilter = this.grid.gridFilter.getFilter('LocationName');
					locationNameFilter.active = true;
					locationNameFilter.setValue(this.locationNameTextField.getValue());
				}
				if (!Ext.isEmpty(this.assetSerialTextField.getValue())) {
					isGridFilterApply = true;
					var assetSerialFilter = this.grid.gridFilter.getFilter('AssetSerialNumber');
					assetSerialFilter.active = true;
					assetSerialFilter.setValue(this.assetSerialTextField.getValue());
				}
				if (!isGridFilterApply) {
					//this.grid.baseParams.limit = this.grid.pageSize;
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;

					//var sDateTime = this.startDateField.getValue();
					//var eDateTime = this.endDateField.getValue();
					//var cStartDateTime = this.compareStartDateField.getValue();
					//var cEndDateTime = this.compareEndDateField.getValue();
					var isValidationDate = this.validationCheckbox.getValue();
					if (sDateTime == '' || eDateTime == '') {
						Ext.Msg.alert('Required', 'Please Select Start Date and End Date.');
						return;
					}


					if (isValidationDate == true) {
						if (cStartDateTime == "" || cEndDateTime == "") {
							Ext.Msg.alert('Required', 'Please Select Compare Start Date and Compare End Date.');
							return;
						}
						else {
							if (this.dateDifferanceInDays(cStartDateTime, cEndDateTime) > 92) {
								Ext.Msg.alert('Alert', 'You can\'t select more than three months duration.');
								return;
							}
						}

						if ((sDateTime < eDateTime) && (cStartDateTime < cEndDateTime)) {

							if (!this.startDateField.getValue()) {
								if (this.endDateField.getValue()) {
									this.startDateField.setValue(Cooler.DateOptions.AddDays(this.endDateField.getValue(), -6));
								}
								else {
									this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
								}
							}
							if (!this.compareStartDateField.getValue()) {
								if (this.compareEndDateField.getValue()) {
									this.compareStartDateField.setValue(Cooler.DateOptions.AddDays(this.CompareEndDateField.getValue(), -13));
								}
								else {
									this.compareStartDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -13));
								}
							}
							if (!this.endDateField.getValue()) {
								this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
							}
							if (!this.compareEndDateField.getValue()) {
								this.compareEndDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
							}
						}
						else {
							Ext.Msg.alert('Alert', 'Start Date or Compare Start Date cannot be greater than End Date or Compare End Date.');
							return;
						}
					}
					else {


						if (!this.startDateField.getValue()) {
							if (this.endDateField.getValue()) {
								this.startDateField.setValue(Cooler.DateOptions.AddDays(this.endDateField.getValue(), -6));
							}
							else {
								this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
							}
						}
						else if (this.startDateField.getValue() > this.endDateField.getValue()) {
							Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
							return;
						}
						if (!this.endDateField.getValue()) {
							this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
						}
					}
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.baseParams.CompareStartDate = this.compareStartDateField.getValue();
					this.grid.baseParams.CompareEndDate = this.compareEndDateField.getValue();
					this.grid.baseParams.ShowInstalled = this.showInstalledCheckbox.getValue();
					this.grid.baseParams.validationDate = this.validationCheckbox.getValue();
					this.grid.store.load();
					this.selectedAssetId = 0;
					this.doorSummaryReportDetailGrid.setDisabled(true);
					this.doorSummaryReportDetailGrid.store.removeAll()
					delete this.grid.getStore().baseParams['limit'];
				}
				else {

					var isValidationDate = this.validationCheckbox.getValue();
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
					if (isValidationDate == true) {
						this.grid.baseParams.CompareStartDate = this.compareStartDateField.getValue();
						this.grid.baseParams.CompareEndDate = this.compareEndDateField.getValue();
					}

					this.grid.baseParams.ShowInstalled = this.showInstalledCheckbox.getValue();
					this.grid.baseParams.validationDate = this.validationCheckbox.getValue();
					this.grid.store.load();
					this.selectedAssetId = 0;
					this.doorSummaryReportDetailGrid.setDisabled(true);
					this.doorSummaryReportDetailGrid.store.removeAll()
					delete this.grid.getStore().baseParams['limit'];
				}
			}, scope: this
		});

		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(new Date()));
				this.showInstalledCheckbox.reset();
				this.validationCheckbox.reset();
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.compareStartDateField.setValue('');
				this.compareEndDateField.setValue('');
				this.grid.baseParams.CompareStartDate = this.compareStartDateField.getValue();
				this.grid.baseParams.CompareEndDate = this.compareEndDateField.getValue();
				this.grid.baseParams.ShowInstalled = this.showInstalledCheckbox.getValue();
				this.grid.baseParams.validationDate = this.validationCheckbox.getValue();
				this.clientCombo.reset();
				this.locationCodeTextField.reset();
				this.locationNameTextField.reset();
				this.assetSerialTextField.reset();
				this.grid.loadFirst();
				this.selectedAssetId = 0;
				this.doorSummaryReportDetailGrid.setDisabled(true);
				this.doorSummaryReportDetailGrid.store.removeAll()
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},

	configureListTab: function (config) {
		var grid = this.grid;
		Ext.apply(this.grid, {
			region: 'center'
		});
		this.doorSummaryReportDetailGrid = Cooler.DoorSummaryReportDetail.createGrid({ title: 'Door Summary Detail', allowPaging: true, editable: false, tbar: [], showDefaultButtons: true, disabled: true });
		var south = new Ext.TabPanel({
			region: 'south',
			activeTab: 0,
			items: [
				this.doorSummaryReportDetailGrid
			],
			height: 200,
			split: true,
			enableTabScroll: true
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

	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate', 'ClientId', 'LocationCode', 'LocationName', 'AssetSerial', 'compareStartDate', 'compareEndDate'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date(), -6));
				}
				else if (resetField[i] == 'endDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(new Date()));
				}
				else {
					this.grid.topToolbar.items.get(index).setValue('');
				}
			}
		}
		var validationDateCheckBoxIndex = this.grid.topToolbar.items.findIndex('name', 'validation');
		this.grid.topToolbar.items.get(validationDateCheckBoxIndex).reset();
		delete this.grid.baseParams['validationDate'];
		this.grid.baseParams.validationDate = this.grid.topToolbar.items.get(validationDateCheckBoxIndex).getValue();
	}
});
Cooler.DoorSummaryReport = new Cooler.DoorSummaryReportForm({ uniqueId: 'DoorSummaryReport' });