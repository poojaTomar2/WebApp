Cooler.TemperatureReport = Ext.extend(Cooler.Form, {

	controller: 'TemperatureReport',

	title: 'Temperature Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'TemperatureReport',
	comboTypes: [
		'Client',
		'Country'
	],
	constructor: function (config) {
		config = config || {};
		config.gridConfig = {
			multiLineToolbar: true,
			//groupField: 'Location',
			custom: {
				loadComboTypes: true
			}
		};
		Cooler.TemperatureReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } }
		});
	},
	comboStores: {
		Client: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup }),
		Country: new Ext.data.JsonStore({ fields: ExtHelper.Record.Lookup })
	},
	hybridConfig: function () {
		return [
			{ type: 'int', dataIndex: 'AssetId' },
			{ header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150 },
			{ header: 'Outlet', type: 'string', dataIndex: 'Name', width: 200 },
			{ header: 'Valid From', dataIndex: 'ValidFrom', width: 130, type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Valid To', dataIndex: 'ValidTo', width: 130, type: 'date', width: 150, renderer: ExtHelper.renderer.DateTime },
			{ header: 'Duration (Min.)', type: 'int', dataIndex: 'Duration', width: 130 },
			{ header: 'Average Temperature', type: 'float', dataIndex: 'AvgTemp', width: 200 },
			{ header: 'Number of Records', type: 'float', dataIndex: 'NumberofRecords', width: 150 },
			{ header: 'Sum of Door Count', type: 'float', dataIndex: 'SumDoorCount', width: 150 },
			{ header: 'Alert Threshold Value High', type: 'int', dataIndex: 'AlertThresholdValueHigh', width: 200 },
			{ header: 'Alert Threshold Value Low', type: 'int', dataIndex: 'AlertThresholdValueLow', width: 200 },
			{ header: 'Alert Age Threshold', type: 'int', dataIndex: 'AlertAgeThreshold', width: 200 }


		];
	},

	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},

	afterShowList: function (config) {
		this.grid.baseParams.StartDate = this.startDateField.getValue();
		this.grid.baseParams.EndDate = this.endDateField.getValue();
	},
	beforeShowList: function (config) {
		var gridConfig = config.gridConfig;
		var tbarItems = [];
		this.assetSerialNumberTextField = new Ext.form.TextField({ width: 100, name: 'AssetSerialNumber' });
		this.numberOfRecordTextField = new Ext.form.TextField({ width: 100, name: 'NumberofRecords' });
		this.durationTextField = new Ext.form.TextField({ width: 100, name: 'Duration' });
		this.doorCountTextField = new Ext.form.TextField({ width: 100, name: 'SumDoorCount' });
		this.businessHourStartTime = new Date().setHours(8, 0, 0, 0);
		this.businessHoursEndTime = new Date().setHours(18, 0, 0, 0);
		this.startDateField = new Ext.ux.form.DateTime({ name: 'startDate', mode: 'local', value: Cooler.DateOptions.AddDays(this.businessHourStartTime, -8), width: 180, dateFormat: DA.Security.info.Tags.DateFormat });
		this.endDateField = new Ext.ux.form.DateTime({ name: 'endDate', value: this.businessHoursEndTime, width: 180, dateFormat: DA.Security.info.Tags.DateFormat });
		tbarItems.push('|');
		tbarItems.push('Valid From');
		tbarItems.push(this.startDateField);
		tbarItems.push('|');
		tbarItems.push('Valid To');
		tbarItems.push(this.endDateField);
		tbarItems.push('|');
		tbarItems.push('Asset Serial');
		tbarItems.push(this.assetSerialNumberTextField);
		tbarItems.push('|');
		tbarItems.push('Number of Records');
		tbarItems.push(this.numberOfRecordTextField);
		tbarItems.push('|');
		tbarItems.push('Duration');
		tbarItems.push(this.durationTextField);
		tbarItems.push('|');
		tbarItems.push('Door Count');
		tbarItems.push(this.doorCountTextField);

		this.searchButton = new Ext.Button({
			text: 'Search', handler: function () {
				this.grid.gridFilter.clearFilters();
				var isGridFilterApply = false;
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

				if (!Ext.isEmpty(this.assetSerialNumberTextField.getValue())) {
					isGridFilterApply = true;
					var assetSerialNumberFilter = this.grid.gridFilter.getFilter('AssetSerialNumber');
					assetSerialNumberFilter.active = true;
					assetSerialNumberFilter.setValue(this.assetSerialNumberTextField.getValue());
				}

				if (!Ext.isEmpty(this.numberOfRecordTextField.getValue())) {
					isGridFilterApply = true;
					var numberOfRecordsFilter = this.grid.gridFilter.getFilter('NumberofRecords');
					numberOfRecordsFilter.active = true;
					numberOfRecordsFilter.setValue(this.numberOfRecordTextField.getValue());
				}


				if (!Ext.isEmpty(this.durationTextField.getValue())) {
					isGridFilterApply = true;
					var durationFilter = this.grid.gridFilter.getFilter('Duration');
					durationFilter.active = true;
					durationFilter.setValue(this.durationTextField.getValue());
				}

				if (!Ext.isEmpty(this.doorCountTextField.getValue())) {
					isGridFilterApply = true;
					var doorCountFilter = this.grid.gridFilter.getFilter('SumDoorCount');
					doorCountFilter.active = true;
					doorCountFilter.setValue(this.doorCountTextField.getValue());
				}

				if (!isGridFilterApply) {
					this.grid.getStore().baseParams.limit = this.grid.getBottomToolbar().pageSize;
					if (!this.startDateField.getValue()) {
						if (this.endDateField.getValue()) {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(this.businessHourStartTime.getValue(), -8));
						}
						else {
							this.startDateField.setValue(Cooler.DateOptions.AddDays(this.businessHourStartTime, -8));
						}
					}
					if (!this.endDateField.getValue()) {
						this.endDateField.setValue(Cooler.DateOptions.AddDays(this.businessHoursEndTime));
					}
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.baseParams.Duration = this.durationTextField.getValue();
					this.grid.baseParams.NumberOfRecord = this.numberOfRecordTextField.getValue();
					this.grid.baseParams.SumOfDoorCount = this.doorCountTextField.getValue();
					this.grid.store.load();
					this.selectedAssetId = 0;
					delete this.grid.getStore().baseParams['limit'];
				}
				else {
					this.grid.baseParams.StartDate = this.startDateField.getValue();
					this.grid.baseParams.EndDate = this.endDateField.getValue();
					this.grid.baseParams.Duration = this.durationTextField.getValue();
					this.grid.baseParams.NumberOfRecord = this.numberOfRecordTextField.getValue();
					this.grid.baseParams.SumOfDoorCount = this.doorCountTextField.getValue();
					if (sDateTime > eDateTime) {
						Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
						return;
					}
				}
			}, scope: this
		});
		this.removeSearchButton = new Ext.Button({
			text: 'Reset Search', handler: function () {
				this.grid.store.load();
				this.grid.gridFilter.clearFilters();
				this.startDateField.setValue(Cooler.DateOptions.AddDays(this.businessHourStartTime, -8));
				this.endDateField.setValue(Cooler.DateOptions.AddDays(this.businessHoursEndTime));
				this.grid.baseParams.StartDate = this.startDateField.getValue();
				this.grid.baseParams.EndDate = this.endDateField.getValue();
				this.assetSerialNumberTextField.reset();
				this.durationTextField.reset();
				this.numberOfRecordTextField.reset();
				this.doorCountTextField.reset();
				this.grid.store.load();
			}, scope: this
		});
		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
	},
	beforeRemoveFilter: function () {
		var resetField = ['startDate', 'endDate', 'AssetSerialNumber', 'NumberofRecords', 'Duration', 'SumDoorCount'], index;
		for (var i = 0, len = resetField.length; i < len; i++) {
			index = this.grid.topToolbar.items.findIndex('name', resetField[i]);
			if (index != -1) {
				if (resetField[i] == 'startDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(this.businessHourStartTime, -8));
				}
				else if (resetField[i] == 'endDate') {
					this.grid.topToolbar.items.get(index).setValue(Cooler.DateOptions.AddDays(this.businessHoursEndTime));
				}
				else {
					this.grid.topToolbar.items.get(index).setValue('');
				}
			}
		}
	},
	stringToDate: function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	}

});
Cooler.TemperatureReport = new Cooler.TemperatureReport({ uniqueId: 'TemperatureReport' });