Cooler.HealthDoorVisionSummaryReport = Ext.extend(Cooler.Form, {

	controller: 'HealthDoorVisionSummaryReport',

	keyColumn: 'AssetId',

	title: 'H/D/V Summary (8 am to 8 pm) Report',

	disableAdd: true,

	disableDelete: true,
	securityModule: 'HealthDoorVisionSummaryReport',
	constructor: function (config) {
		Cooler.HealthDoorVisionSummaryReport.superclass.constructor.call(this, config || {});
		Ext.apply(this.gridConfig, {
			multiLineToolbar: true,
			defaults: { sort: { dir: 'ASC', sort: 'AssetId' } },
			custom: {
				loadComboTypes: true
			}
		});
	},
	hybridConfig: function () {
		return [
            { type: 'int', dataIndex: 'AssetId' },
            { header: 'Asset Serial Number', type: 'string', dataIndex: 'AssetSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
            { header: 'Asset Type', type: 'string', dataIndex: 'AssetType', width: 150 },
            { header: 'Outlet Code', type: 'string', dataIndex: 'LocationCode', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Outlet Name', type: 'string', dataIndex: 'LocationName', width: 150 },
			{ header: 'LocationId', type: 'string', dataIndex: 'LocationId', width: 150, hidden: true },
			{ header: 'Temperature At 08', dataIndex: 'TempAtEight', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 09', dataIndex: 'TempAt9', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 10', dataIndex: 'TempAt10', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 11', dataIndex: 'TempAt11', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 12', dataIndex: 'TempAt12', type: 'float', width: 180, align: 'right' },
			{ header: 'Temperature At 13', dataIndex: 'TempAt13', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 14', dataIndex: 'TempAt14', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 15', dataIndex: 'TempAt15', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 16', dataIndex: 'TempAt16', type: 'float', width: 180, align: 'right' },
            { header: 'Temperature At 17', dataIndex: 'TempAt17', type: 'float', width: 180, align: 'right' },
			{ header: 'Temperature At 18', dataIndex: 'TempAt18', type: 'float', width: 180, align: 'right' },
			{ header: 'Temperature At 19', dataIndex: 'TempAt19', type: 'float', width: 180, align: 'right' },
			{ header: 'Temperature At 20', dataIndex: 'TempAt20', type: 'float', width: 180, align: 'right' },
            { header: 'Average of Tweleve Hour Temperature', type: 'float', dataIndex: 'AverageOfTweleveHour', width: 250, align: 'right' },
			{ header: 'Door At 08', dataIndex: 'DoorAt8', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 09', dataIndex: 'DoorAt9', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 10', dataIndex: 'DoorAt10', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 11', dataIndex: 'DoorAt11', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 12', dataIndex: 'DoorAt12', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 13', dataIndex: 'DoorAt13', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 14', dataIndex: 'DoorAt14', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 15', dataIndex: 'DoorAt15', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 16', dataIndex: 'DoorAt16', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 17', dataIndex: 'DoorAt17', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 18', dataIndex: 'DoorAt18', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 19', dataIndex: 'DoorAt19', type: 'int', width: 180, align: 'right' },
			{ header: 'Door At 20', dataIndex: 'DoorAt20', type: 'int', width: 180, align: 'right' },
            { header: 'Average of Tweleve Hour Door', type: 'int', dataIndex: 'AvgOfTweleveHourDoor', width: 250, align: 'right' },
			{ header: 'IsSmartHub?', type: 'string', dataIndex: 'IsSmartHub', type: 'string' },
            { header: 'Cooler Displacement?', type: 'string', dataIndex: 'CoolerDisplacement', width: 150 },
            { header: 'Average Light On (hrs) 8AM-8PM', type: 'string', dataIndex: 'AverageOfDailyLightOnHrs', width: 180, sortable: false },
			{ header: 'Average Light Off (hrs) 8AM-8PM', type: 'string', dataIndex: 'AverageOfDailyLightOffHrs', width: 180, sortable: false },
            { header: 'Street', type: 'string', dataIndex: 'Street1', width: 150 },
            { header: 'City', type: 'string', dataIndex: 'CityName', width: 150 },
			{ header: 'State', type: 'string', dataIndex: 'StateName', width: 150 },
            { header: 'Country', dataIndex: 'CountryName', width: 150, type: 'string' },
			{ header: 'Sales Territory', type: 'string', dataIndex: 'SalesTerritoryName', width: 150 },
			{ header: 'Sales Group', type: 'string', dataIndex: 'SalesGroupName', width: 150 },
			{ header: 'Sales Office', type: 'string', dataIndex: 'SalesOfficeName', width: 150 },
            { header: 'Sales Organization Name', dataIndex: 'SalesOrganizationName', width: 150, type: 'string' },
			{ header: 'IsSmartVision?', type: 'string', dataIndex: 'IsSmartVision', width: 150 },
			{ header: 'Is Latest Location Correct?', type: 'string', dataIndex: 'IsLatestLocationCorrect', width: 150 },
            { header: 'Smart Device SerialNumber', type: 'string', dataIndex: 'SmartDeviceSerialNumber', width: 150, hyperlinkAsDoubleClick: true },
			{ header: 'Smart Device Type', type: 'string', dataIndex: 'SmartDeviceType', width: 150 },
			{ header: 'Last Image Recieved Date', dataIndex: 'LastImageRecievedDate', type: 'date', width: 200, rendererInfo: 'TimeZoneRenderer', renderer: Cooler.renderer.DateTimeWithTimeZone },
			{ header: 'Last Data Download Date', dataIndex: 'LastdataDownloadDate', width: 200, type: 'date', renderer: ExtHelper.renderer.DateTime },
			{ header: 'Days Since Last data download', type: 'string', dataIndex: 'DaysSinceLastdatadownload', width: 180 },
			{ header: 'Average Total facings', type: 'int', dataIndex: 'AverageTotalfacings', width: 180, align: 'right' },
			{ header: 'Average Bottler facings', type: 'int', dataIndex: 'AverageBottlerfacings', width: 150, align: 'right' },
			{ header: 'Average Purity % ', type: 'int', dataIndex: 'AveragePurityPercentage', width: 180, align: 'right' },
			{ header: 'Average Planogram Compliance ', type: 'int', dataIndex: 'AveragePlanogramCompliance', width: 180, align: 'right' },
			{ header: 'Days Without Health Records ', type: 'int', dataIndex: 'DayWithoutHealthRecord', width: 180, align: 'right' },
			{ header: 'CoolerIot Client', type: 'string', dataIndex: 'ClientName', width: 150 }
		];
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
		tbarItems.push('Asset Serial#');
		tbarItems.push(this.assetSerialTextField);

		tbarItems.push('Location Code');
		tbarItems.push(this.locationCodeTextField);

		tbarItems.push('Location Name');
		tbarItems.push(this.locationNameTextField);

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
			}, scope: this
		});

		tbarItems.push(this.searchButton);
		tbarItems.push(this.removeSearchButton);
		Ext.applyIf(gridConfig.custom, { tbar: tbarItems });
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
		//var validationDateCheckBoxIndex = this.grid.topToolbar.items.findIndex('name', 'validation');
		//this.grid.topToolbar.items.get(validationDateCheckBoxIndex).reset();
		delete this.grid.baseParams['validationDate'];
		//sthis.grid.baseParams.validationDate = this.grid.topToolbar.items.get(validationDateCheckBoxIndex).getValue();
	}
});
Cooler.HealthDoorVisionSummaryReport = new Cooler.HealthDoorVisionSummaryReport({ uniqueId: 'HealthDoorVisionSummaryReport' });