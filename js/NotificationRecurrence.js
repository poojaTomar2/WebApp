Cooler.NotificationRecurrence = function (config) {
	config = Ext.applyIf(config ? config : {}, {
		formTitle: 'Notification Subscription Event: {0}',
		listTitle: 'Views Notification',
		keyColumn: 'NotificationRecurrenceId',
		captionColumn: null,
		allowExport: false,
		controller: 'NotificationRecurrence',
		winConfig: { resizable: false, width: 610, height: 500, layout: 'fit' },
		gridConfig: {
			sm: new Ext.grid.RowSelectionModel({ singleSelect: true })
		}
	});
	Cooler.NotificationRecurrence.superclass.constructor.call(this, config);
};


Ext.extend(Cooler.NotificationRecurrence, Cooler.Form, {
	listRecord: Ext.data.Record.create([
		{ name: 'NotificationRecurrenceId', type: 'int' },
		{ name: 'NotificationTypeId', type: 'int' },
		{ name: 'AlertTypeId', type: 'int' },
		{ name: 'GridId', type: 'string' },
		{ name: 'GridPreferenceId', type: 'int' },
		{ name: 'FormatId', type: 'int' },
		{ name: 'Format', type: 'string' },
		{ name: 'Notification', type: 'string' },
		{ name: 'FormatId', type: 'string' },
		{ name: 'NotificationTo', type: 'string' },
		{ name: 'IsActive', type: 'bool' },
		{ name: 'NotificationToId', type: 'int' }

	]),
	cm: function () {
		var cm = new Ext.grid.ColumnModel([
			{ header: 'Notification', dataIndex: 'GridId', width: 120 },
			{ header: 'Notification To', dataIndex: 'NotificationTo' },
			{ header: 'Is Active?', dataIndex: 'IsActive', renderer: ExtHelper.renderer.Boolean }
		])

		return cm;
	},
	createForm: function (config) {
		var notificationRecurrenceId;
		var fnRecurrence = function () {
			if (notificationRecurrenceId && notificationRecurrenceId > 0) {
				Cooler.NotificationRecurrence.ShowForm(notificationRecurrenceId, { extraParams: { parentId: notificationRecurrenceId } });
			} else {
				//First Save it
			}
		}

		var recurrencePreference = {
			Scheduled: 1,
			Immediately: 2,
			OnEvent: 3
		}

		var format = {
			CSV: 1,
			PDF: 2
		}

		var formatStore = [];
		formatStore.push([format.CSV, "CSV"]);
		formatStore.push([format.PDF, "PDF"]);
		var recurrencePreferenceStore = [];
		recurrencePreferenceStore.push([recurrencePreference.Scheduled, "Scheduled"]);
		recurrencePreferenceStore.push([recurrencePreference.Immediately, "Immediately"]);
		//recurrencePreferenceStore.push([recurrencePreference.OnEvent, "On Event"]);

		var notificationTypeCombo = DA.combo.create({ fieldLabel: 'Notification', hiddenName: 'NotificationAndReportTypeId', baseParams: { comboType: 'NotificationAndReportType' }, listWidth: 350 });
		var activeCheckbox = new Ext.form.Checkbox({ fieldLabel: 'Is Active?', name: 'IsActive' });

		//var notificationCombo = DA.combo.create({ fieldLabel: 'Notification Type', hiddenName: 'NotificationTypeId', baseParams: { comboType: 'NotificationMethod' } });
		var gridpreferenceCombo = DA.combo.create({ fieldLabel: 'View', hiddenName: 'GridPreferenceId', baseParams: { comboType: 'PreferenceName', GridId: "" }, controller: "Combo", listWidth: 250 });

		//var notificationCombo = DA.combo.create({ fieldLabel: 'Notification Layout', hiddenName: 'GridPreferenceId', baseParams: { comboType: 'NotificationMethod', GridId: "" }, controller: "Combo" });
		var formatCombo = DA.combo.create({ fieldLabel: 'Format', hiddenName: 'FormatId', store: formatStore, });
		var notificationToCombo = DA.combo.create({ fieldLabel: 'Notification Method', hiddenName: 'NotificationToId', baseParams: { comboType: 'NotificationType' } });
		var recurrencePreferenceCombo = DA.combo.create({
			fieldLabel: 'When', hiddenName: 'ScheduledRecurrenceId', store: recurrencePreferenceStore,
			helpText: 'There are following conditions in Notification Subscription <br> 1) If we select a Notification "Alert" then it will be send when related Alert Type event happen. <br> 2)If we select a Notification "Report" and When as "Immediately" then related Report will be send in few minutes <br> 3) If we select a Notification "Report" and When as "Scheduled" then related Report will be send according to its Schedule ',
			plugins: new Ext.ux.plugins.HelpIcon(), width: 165
		});

		this.recurrencePreferenceCombo = recurrencePreferenceCombo;
		this.notificationTypeCombo = notificationTypeCombo;
		this.formatCombo = formatCombo;


		// Norification Recurrence fields
		var startTimeField = new Ext.form.TimeField({ fieldLabel: 'Start Time', hiddenName: 'StartTime', width: 110 });
		var endTimeField = new Ext.form.TimeField({ fieldLabel: 'End Time', hiddenName: 'EndTime', width: 110 });

		var reccurencePatternCombo = ExtHelper.CreateCombo({ fieldLabel: 'Recurrence Pattern', hiddenName: 'ReccurencePatternId', baseParams: { comboType: 'ReccurencePattern' }, width: 100 });
		var reccuenceTypeYearly = ExtHelper.CreateCombo({ fieldLabel: 'Type', hiddenName: 'ReccurenceTypeYearlyId', baseParams: { comboType: 'ReccurenceTypeYearly' } });
		var warningDays = new Ext.form.NumberField({ fieldLabel: 'Warning Days', name: 'WarningDays', allowDecimals: false, width: 80 });
		var warningTime = new Ext.form.NumberField({ fieldLabel: 'Warning Time', name: 'WarningTime', allowDecimals: false, width: 80 });
		var reccurencePeriodFieldD = new ExtHelper.CreateCombo({ fieldLabel: 'Frequency', hiddenName: 'ReccurencePeriod', store: 'minutesDuration', storeMinValue: 30, storeMaxValue: 240, storeIncrement: 30, width: 120 });
		var reccurencePeriodFieldW = new Ext.form.NumberField({ fieldLabel: 'Every', name: 'ReccurencePeriodForWeekly', allowDecimals: false, width: 40 });
		var reccurencePeriodFieldM1 = new Ext.form.NumberField({ fieldLabel: 'of every', name: 'ReccurencePeriodForMonthly1', allowDecimals: false, width: 40 });
		var reccurencePeriodFieldY = new Ext.form.NumberField({ fieldLabel: 'Every', name: 'ReccurencePeriodForYearly', allowDecimals: false, width: 40 });

		var sunday = new Ext.form.Checkbox({ name: 'Sunday', fieldLabel: 'Sunday', width: 80 });
		var monday = new Ext.form.Checkbox({ name: 'Monday', fieldLabel: 'Monday', width: 80 });
		var tuesday = new Ext.form.Checkbox({ name: 'Tuesday', fieldLabel: 'Tuesday', width: 80 });
		var wednesday = new Ext.form.Checkbox({ name: 'Wednesday', fieldLabel: 'Wednesday', width: 80 });
		var thursday = new Ext.form.Checkbox({ name: 'Thursday', fieldLabel: 'Thursday', width: 80 });
		var friday = new Ext.form.Checkbox({ name: 'Friday', fieldLabel: 'Friday', width: 80 });
		var saturday = new Ext.form.Checkbox({ name: 'Saturday', fieldLabel: 'Saturday', width: 80 });

		var weekOfTheMonthComboY = ExtHelper.CreateCombo({ fieldLabel: 'The', hiddenName: 'YearlyWeekOfMonthId', baseParams: { comboType: 'WeekOfMonth' }, width: 80 });
		var monthOfTheYearComboY1 = ExtHelper.CreateCombo({ fieldLabel: 'The', hiddenName: 'MonthOfTheYearId1', baseParams: { comboType: 'MonthOfTheYear' }, width: 80 });
		var monthOfTheYearComboY2 = ExtHelper.CreateCombo({ fieldLabel: 'The', hiddenName: 'MonthOfTheYearId2', baseParams: { comboType: 'MonthOfTheYear' }, width: 80 });
		var dayOfTheweekComboY = ExtHelper.CreateCombo({ fieldLabel: 'The', hiddenName: 'YearlyDayOfWeek', baseParams: { comboType: 'DayOfTheweek' }, width: 80 });

		var dayOfTheMonthFieldM = new Ext.form.NumberField({ fieldLabel: 'Day', name: 'MonthDayOfMonth', allowDecimals: false, width: 40 });
		var dayOfTheMonthFieldY = new Ext.form.NumberField({ fieldLabel: 'Day Of Month', name: 'YearDayOfMonth', allowDecimals: false, width: 40 });

		var startDateField = new Ext.form.DateField({ fieldLabel: 'Start Date', name: 'StartDate', width: 110, dateValidation: true });
		var endDateField = new Ext.form.DateField({ fieldLabel: 'End Date', name: 'EndDate', width: 110, dateValidation: true });
		var rangeType = ExtHelper.CreateCombo({ fieldLabel: 'Range Type', hiddenName: 'RangeTypeId', baseParams: { comboType: 'RangeType' } });
		var noOfOccurrencesField = new Ext.form.NumberField({ fieldLabel: 'End After', name: 'NoOfOccurrences', allowDecimals: false });
		var nextOccuranceHiddenFiels = new Ext.form.Hidden({ name: 'NextOccurance' });
		var contactIdHiddenField = new Ext.form.Hidden({ name: 'ContactId' });
		var gridIdHiddenField = new Ext.form.Hidden({ name: 'GridId' });
		var alertTypeIdHiddenField = new Ext.form.Hidden({ name: 'AlertTypeId' });
		this.reccurencePeriodFieldD = reccurencePeriodFieldD;
		this.reccurencePatternCombo = reccurencePatternCombo;

		var notificationTimePanel = new Ext.Panel({
			region: 'center',
			layout: 'table',
			layoutConfig: { columns: 2 },
			border: false,
			region: 'center',
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 90, valign: 'top' },
			items: [{ items: [startTimeField] }, { items: [endTimeField] }]
		});
		notificationTime = function (config) {
			var config = new Ext.form.FieldSet({
				collapsible: false,
				defaults: { border: false },
				title: 'Between timings',
				items: notificationTimePanel,
				autoHeight: true
			});
			return config;
		};
		var recurrencePatternPanelForDaily = new Ext.Panel({
			autoScroll: true,
			layout: 'table',
			border: false,
			region: 'center',
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', labelWidth: 60 },
			items: [
			 { items: [reccurencePeriodFieldD] }]
		});

		var recurrencePatternPanelForWeekly = new Ext.Panel({
			autoScroll: true,
			layout: 'table',
			layoutConfig: { columns: 4 },
			region: 'center',
			border: false,
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', labelWidth: 60, valign: 'top' },
			items: [{ items: [sunday] }, { items: [monday] }, { items: [tuesday] }, { items: [wednesday] }, { items: [thursday] }, { items: [friday] }, { items: [saturday] }]
		});

		var recurrencePatternPanelForMonthly = new Ext.Panel({
			autoScroll: true,
			layout: 'table',
			layoutConfig: { columns: 4 },
			border: false,
			region: 'center',
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', labelWidth: 55 },
			items: [
			{ items: [dayOfTheMonthFieldM] }, { items: [reccurencePeriodFieldM1] }, { items: [{ html: '<font class="x-form-item-label">month', border: false }] }
			]
		});

		var recurrencePatternPanelForYearly = new Ext.Panel({
			autoScroll: true,
			layout: 'table',
			layoutConfig: { columns: 3 },
			border: false,
			region: 'center',
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 40 },
			items: [{ colspan: 3, items: [reccuenceTypeYearly] }, { colspan: 3, items: [reccurencePeriodFieldY] }, { items: [monthOfTheYearComboY1] }, { colspan: 2, items: [dayOfTheMonthFieldY] }, { items: [weekOfTheMonthComboY] }, { items: [dayOfTheweekComboY] }, { items: [monthOfTheYearComboY2] }]
		});
		var recurrencePatternPanelSub = new Ext.Panel({
			autoScroll: true,
			layout: 'table',
			layoutConfig: { columns: 2 },
			border: false,
			region: 'center',
			defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 100 },
			items: [{ items: [reccurencePatternCombo] }]
		});


		recurrencePattern = function (config) {
			var recurrencePatternPanel = new Ext.Panel({
				autoScroll: true,
				layout: 'table',
				layoutConfig: { columns: 2 },
				border: false,
				region: 'center',
				defaults: { bodyStyle: 'padding:0px 10px 5px 0px', border: false, layout: 'form', valign: 'top' },
				items: [
				{ items: [recurrencePatternPanelSub] },
				{ items: [recurrencePatternPanelForDaily] },
				{ colspan: 2, items: [recurrencePatternPanelForWeekly] }
				]
			});

			var config = new Ext.form.FieldSet({
				collapsible: false,
				defaults: { border: false },
				title: 'Recurrence Pattern',
				items: recurrencePatternPanel,
				autoHeight: true
			});
			return config;
		};
		notificationRange = function (config) {

			var rangePanel = new Ext.Panel({
				autoScroll: true,
				layout: 'table',
				layoutConfig: { columns: 2 },
				border: false,
				region: 'center',
				defaults: { bodyStyle: 'padding:0px 20px 1px 0px', border: false, layout: 'form', defaultType: 'textfield', labelWidth: 90, valign: 'top' },
				items: [
					{ items: [startDateField] },
					{ items: [endDateField] }
				]
			});
			var config = new Ext.form.FieldSet({
				collapsible: false,
				defaults: { border: false },
				title: 'Range of recurrence',
				items: rangePanel,
				autoHeight: true
			});
			return config;
		};

		notificationToCombo.on('change', function (combo, record, index) {
			var validationMessage = '';
			var record = Cooler.ContactReport.activeContactRecord;
			var contactDetail = '';
			var needToValidate = false;
			switch (combo.getValue()) {
				case 1:
					contactDetail = record.get('PersonalEmailAddress');
					validationMessage = 'Personal Email Address';
					needToValidate = true;
					break;
				case 2:
					contactDetail = record.get('CorporateEmailAddress');
					validationMessage = 'Corporate Email Address';
					needToValidate = true;
					break;
				case 3:
					contactDetail = record.get('CellPhone');
					validationMessage = 'Cell Phone Number';
					needToValidate = true;
					break;
			}
			if (needToValidate && (contactDetail = '' || contactDetail == null || contactDetail == 0)) {
				validationMessage = 'There is no ' + validationMessage + ' in selected Contact';
				Ext.Msg.alert('Error', validationMessage);
				ExtHelper.SelectComboValue(combo, '');
			}
		});
		rangeType.on('select', function (combo, record, index) {
			switch (combo.getValue()) {
				case Cooler.LookupType.RangeType.EndByDate:
					noOfOccurrencesField.setFieldVisible(false);
					break;
				case Cooler.LookupType.RangeType.EndByRecurrence:
					noOfOccurrencesField.setFieldVisible(true);
					break;
				default:
					noOfOccurrencesField.setFieldVisible(false);
					break;

			}
		});
		updateLayout = function (value, hideFormatField){
			switch (value) {
				case recurrencePreference.Immediately:
					scheduledPanel.hide();
					notificationRangePanel.hide();
					Cooler.NotificationRecurrence.win.setHeight(240 - hideFormatField);
					break;
				case recurrencePreference.Scheduled:
					scheduledPanel.show();
					notificationRangePanel.show();
					Cooler.NotificationRecurrence.win.setHeight(500 - hideFormatField);
					break;
				case recurrencePreference.OnEvent:
					scheduledPanel.hide();
					notificationRangePanel.show();
					Cooler.NotificationRecurrence.win.setHeight(310 - hideFormatField);
					break;
			}
		}
		recurrencePreferenceCombo.on('change', function (combo, record, index) {
			updateLayout(combo.getValue(), 0);
		});


		reccuenceTypeYearly.on('select', function (combo, record, index) {
			switch (combo.getValue()) {
				case Cooler.LookupType.ReccurenceTypeYearly.Weekday:
					reccurencePeriodFieldY.setFieldVisible(false);
					monthOfTheYearComboY1.setFieldVisible(false);
					dayOfTheMonthFieldY.setFieldVisible(false);
					weekOfTheMonthComboY.setFieldVisible(true);
					dayOfTheweekComboY.setFieldVisible(true);
					monthOfTheYearComboY2.setFieldVisible(true);
					break;
				case Cooler.LookupType.ReccurenceTypeYearly.NDay:
					reccurencePeriodFieldY.setFieldVisible(false);
					monthOfTheYearComboY1.setFieldVisible(true);
					dayOfTheMonthFieldY.setFieldVisible(true);
					weekOfTheMonthComboY.setFieldVisible(false);
					dayOfTheweekComboY.setFieldVisible(false);
					monthOfTheYearComboY2.setFieldVisible(false);
					break;
				case Cooler.LookupType.ReccurenceTypeYearly.Every:
					reccurencePeriodFieldY.setFieldVisible(true);
					monthOfTheYearComboY1.setFieldVisible(false);
					dayOfTheMonthFieldY.setFieldVisible(false);
					weekOfTheMonthComboY.setFieldVisible(false);
					dayOfTheweekComboY.setFieldVisible(false);
					monthOfTheYearComboY2.setFieldVisible(false);
					break;
				default:
					reccurencePeriodFieldY.setFieldVisible(false);
					monthOfTheYearComboY1.setFieldVisible(false);
					dayOfTheMonthFieldY.setFieldVisible(false);
					weekOfTheMonthComboY.setFieldVisible(false);
					dayOfTheweekComboY.setFieldVisible(false);
					monthOfTheYearComboY2.setFieldVisible(false);
					break;
			}
		});

		reccurencePatternCombo.on('select', function (combo, record, index) {
			var recurrencePatternPanelItem = [];
			recurrencePatternPanelForWeekly.show();
			Cooler.NotificationRecurrence.win.setHeight(500);
			switch (combo.getValue()) {
				case Cooler.Enums.ReccurencePattern.Daily:
					recurrencePatternPanelForDaily.show();
					recurrencePatternPanelForMonthly.hide();
					recurrencePatternPanelForYearly.hide();
					recurrencePatternPanelForWeekly.hide();
					Cooler.NotificationRecurrence.win.setHeight(450);
					break;
				case Cooler.Enums.ReccurencePattern.Weekly:
					recurrencePatternPanelForDaily.hide();
					recurrencePatternPanelForMonthly.hide();
					recurrencePatternPanelForYearly.hide();
					break;
				case Cooler.Enums.ReccurencePattern.Monthly:
					recurrencePatternPanelForDaily.hide();
					recurrencePatternPanelForMonthly.show();
					recurrencePatternPanelForYearly.hide();
					break;
				case Cooler.Enums.ReccurencePattern.Yearly:
					recurrencePatternPanelForDaily.hide();
					recurrencePatternPanelForMonthly.hide();
					recurrencePatternPanelForYearly.show();
					break;
			}
		});
		reccurencePeriodFieldD.on('select', function (combo) {
			if (combo.getValue() != 1440) {
				startTimeField.setRawValue("12:00 AM");
				endTimeField.setRawValue("11:45 PM");
				startTimeField.setDisabled(true);
				endTimeField.setDisabled(true);
			} else {
				startTimeField.setDisabled(false);
				endTimeField.setDisabled(false);
			}
		});
		ExtHelper.SetCascadingCombo(notificationTypeCombo, gridpreferenceCombo);
		this.on('beforeSave', function (Coolerform, params, options) {
			var errorMessage;
			var errorField;
			recurrencePreferenceCombo.setDisabled(false);
			reccurencePeriodFieldD.setDisabled(false);
			//notificationCombo.setDisabled(false);
			gridIdHiddenField.setValue(notificationTypeCombo.getRawValue());

			alertTypeIdHiddenField.setValue(0); // clear first

			var record = notificationTypeCombo.findRecord(notificationTypeCombo.valueField, notificationTypeCombo.getValue());
			if (record) {
				alertTypeIdHiddenField.setValue(record.get('LookupId'));
			}

			if (alertTypeIdHiddenField.value == 0) {
				errorMessage = "Please select one notification.";
				errorField = this.notificationTypeCombo;
			}
			if (errorMessage == null && this.recurrencePreferenceCombo.getValue() == 0) {
				errorMessage = "Please select when notification comes.";
				errorField = this.recurrencePreferenceCombo;
			}
			if (errorMessage == null && this.recurrencePreferenceCombo.getValue() == recurrencePreference.Scheduled) {
				if (this.reccurencePeriodFieldD.getRawValue() == '') {
					errorMessage = "Please fillout frequency detail.";
					errorField = this.reccurencePeriodFieldD;
				}
			}
			if (errorMessage) {
				var focusField;
				if (errorField) {
					focusField = function () {
						errorField.focus();
					};
				}
				DA.Util.ShowError('Validation error', errorMessage, focusField);
			}

			return errorMessage == undefined;
		});
		this.on('dataLoaded', function (CoolerForm, data) {
			gridpreferenceCombo.baseParams.GridId = data.data.GridId;
			gridpreferenceCombo.store.reload();
			contactIdHiddenField.setValue(Cooler.ContactReport.activeContactId);
			var activeContactRecord;
			if (Cooler.ActiveRecordForNotification) {
				activeContactRecord = Cooler.ActiveRecordForNotification;
				Cooler.ActiveRecordForNotification = null;
			} else {
				Cooler.ContactReport.activeContactRecord;
			}
			var comboNotifytype = notificationTypeCombo.getValue();
			notificationTypeCombo.getStore().baseParams.businessObjectTypeId = Cooler.ContactReport.businessObjectTypeId;
			Cooler.NotificationRecurrence.win = this.win;
			notificationRecurrenceId = data.data.Id;
			var notificationAndReportType = alertTypeIdHiddenField.getValue();
			formatCombo.setFieldVisible(false);
			var notificationType = -502; //TODO: Report type 
			//notificationCombo.setDisabled(true);

			if (notificationRecurrenceId == 0) {
				formatCombo.setFieldVisible(true);
				recurrencePreferenceCombo.setDisabled(true);
				warningDays.setFieldVisible(true);
				warningTime.setFieldVisible(true);
				recurrencePreferenceCombo.setDisabled(false);
				sunday.setValue(true);
				monday.setValue(true);
				tuesday.setValue(true);
				wednesday.setValue(true);
				thursday.setValue(true);
				friday.setValue(true);
				saturday.setValue(true);
				notificationTimePanel.show();
				scheduledPanel.show();
				notificationRangePanel.show();

			}
			ExtHelper.SelectComboValue(notificationTypeCombo, notificationAndReportType);

			var recurrencePreferenceValue = recurrencePreferenceCombo.getValue();
			updateLayout(recurrencePreferenceValue, 20);
			

		});
		notificationTypeCombo.on('change', function (combo, newValue, oldValue) {
			var comboRecord = combo.findRecordByValue(combo.value), displayValue;
			if (comboRecord) {
				displayValue = comboRecord.get('DisplayValue');
			}
			gridpreferenceCombo.baseParams.GridId = displayValue;
			//notificationCombo.store.reload();
			//notificationCombo.setDisabled(false);
		});

		var scheduledPanel = new Ext.Panel({
			border: false,
			items: [
			recurrencePattern(),
			notificationTime()
			]
		});

		var notificationRangePanel = new Ext.Panel({
			border: false,
			items: [
			notificationRange()
			]
		});
		var items = [
			notificationTypeCombo,
			//notificationCombo,
			gridpreferenceCombo,
			formatCombo,
			notificationToCombo,
			activeCheckbox,
			warningDays,
			warningTime,
			recurrencePreferenceCombo,
			notificationRangePanel,
			scheduledPanel,
			contactIdHiddenField,
			gridIdHiddenField,
			alertTypeIdHiddenField
		];

		Ext.apply(config, {
			autoScroll: true,
			items: items
		});
		return config;
	}
});

Cooler.NotificationRecurrence = new Cooler.NotificationRecurrence()