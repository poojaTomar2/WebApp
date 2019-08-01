Cooler.ThirdPartyOutletByHoursReport = Ext.extend(Object, {

	onExportButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var SDateTime = '';
		var EDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.PeriodOneFromDate.length > 0) {
			var SDateTime = this.stringToDate(reportCriteria.PeriodOneFromDate);
		}
		if (reportCriteria.PeriodOneToDate.length > 0) {
			var EDateTime = this.stringToDate(reportCriteria.PeriodOneToDate);
		}
		reportCriteria.PeriodOneFromDate = SDateTime;
		reportCriteria.PeriodOneToDate = EDateTime;

		if ((SDateTime <= minDate || SDateTime >= maxDate) || (EDateTime <= minDate || EDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than "1/1/1753" and greater than "31/12/9999".');
			return;
		}

		if (SDateTime != '' && EDateTime != '') {
			if (SDateTime > EDateTime) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}

		var format = button.tag || 'XLS';
		var url = 'Controllers/ThirdPartyOutletByHoursReport.ashx?v=' + new Date();
		var params = {
			action: 'export',
			format: format,
			report: 'Third Party Outlet By Hours Report ',
			periodOnefromDate: reportCriteria.PeriodOneFromDate,
			periodOneToDate: reportCriteria.PeriodOneToDate,
			applicationTypeId: reportCriteria.ThirdPartyAppId,
			weekDayId: reportCriteria.WeekDayId,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			ThirdPartyPromotionId: reportCriteria.ThirdPartyPromotionId
		};

		ExtHelper.HiddenForm.submit({
			action: url,
			params: params,
			target: "_blank"
		});
	},
	stringToDate: function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	},
	datediffindays: function (reportFromDate, reportToDate) {

		from = new Date(reportFromDate);
		to = new Date(reportToDate);
		return Math.floor((Date.UTC(to.getFullYear(), to.getMonth(), to.getDate()) - Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())) / (1000 * 60 * 60 * 24));
	},

	onShowButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var SDateTime = '';
		var EDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.PeriodOneFromDate.length > 0) {
			var SDateTime = this.stringToDate(reportCriteria.PeriodOneFromDate);
		}
		if (reportCriteria.PeriodOneToDate.length > 0) {
			var EDateTime = this.stringToDate(reportCriteria.PeriodOneToDate);
		}
		reportCriteria.PeriodOneFromDate = SDateTime;
		reportCriteria.PeriodOneToDate = EDateTime;

		if ((SDateTime <= minDate || SDateTime >= maxDate) || (EDateTime <= minDate || EDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than "1/1/1753" and greater than "31/12/9999".');
			return;
		}

		if (SDateTime != '' && EDateTime != '') {
			if (SDateTime > EDateTime) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}
		var periodOnedateDiffInDays = this.datediffindays(SDateTime, EDateTime);
		if (periodOnedateDiffInDays > 31) {
			Ext.Msg.alert('Alert', 'Period is not more than one months');
			return;
		}

		//if (periodTwodateDiffInDays > 31) {
		//	Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
		//	return;
		//}
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var params = {
			action: 'list',
			periodOnefromDate: reportCriteria.PeriodOneFromDate,
			periodOneToDate: reportCriteria.PeriodOneToDate,
			applicationTypeId: reportCriteria.ThirdPartyAppId,
			weekDayId: reportCriteria.WeekDayId,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			ThirdPartyPromotionId: reportCriteria.ThirdPartyPromotionId


		};

		if (params.applicationTypeId == "") {
			Ext.Msg.alert('Error', 'Please Select Application');
		}

		Ext.Ajax.request({
			url: 'Controllers/ThirdPartyOutletByHoursReport.ashx',
			params: params,
			success: this.onThirdPartyByAppUIDSuccess,
			failure: function (response, options) {
				this.mask.hide();
				if (response.status === 401) {
					ExtHelper.Plugins.ExceptionHandler.exceptionHandler('', options, response)
				}
			},
			scope: this
		});
	},
	onThirdPartyByAppUIDSuccess: function (result, request) {
		this.mask.hide();
		var response = Ext.decode(result.responseText);
		if (response.success) {
			response.ThirdPartyByAppUIDDetail = response.ThirdPartyByAppUIDDetail.records;
			this.itemTpl.overwrite(this.resultPanel.body, response);
		}
		else {
			Ext.Msg.alert('Error', response.info);
		}
	},

	createFilterPanel: function () {
		if (!this.panel) {
			var countryCombo = DA.combo.create({ fieldLabel: 'Country ', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 250 });
			this.countryCombo = countryCombo;
			var promotionNameCombo = DA.combo.create({ fieldLabel: 'Promotion Name', name: 'ThirdPartyPromotionId', hiddenName: 'ThirdPartyPromotionId', controller: 'combo', baseParams: { comboType: 'ThirdPartyPromotionName' }, listWidth: 250, disabled: true });
			var clientCombo = DA.combo.create({ fieldLabel: 'Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 250 });
			var appNameCombo = DA.combo.create({ fieldLabel: 'Application', itemId: 'appNameCombo', name: 'ThirdPartyAppId', hiddenName: 'ThirdPartyAppId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'ThirdPartyAppName' }, allowBlank: false });
			this.appNameCombo = appNameCombo;
			this.promotionNameCombo = promotionNameCombo;
			appNameCombo.on('select', function (combo, newValue) {
				this.getPromotionNameValue(newValue);
			}, this);
			var startDate = new Ext.form.DateField({ name: 'PeriodOneFromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var endDate = new Ext.form.DateField({ name: 'PeriodOneToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var exportButton = new Ext.SplitButton({ text: 'Export', menu: { items: [{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }], listeners: { itemclick: this.onExportButtonClick, scope: this } }, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel' });
			var weekdayComboStore = [[1, 'Monday'], [2, 'Tuesday'], [3, 'Wednesday'], [4, 'Thrusday'], [5, 'Friday'], [6, 'Saturday'], [7, 'Sunday']];
			var weekdayCombo = DA.combo.create({ fieldLabel: 'Days ', value: 1, name: 'WeekDayId', hiddenName: 'WeekDayId', store: weekdayComboStore, listWidth: 250 });
			this.weekdayCombo = weekdayCombo;
			var reportFilter = {
				xtype: 'fieldset',
				title: 'Filter',
				bodyStyle: 'padding: 5px;',
				height: 180,
				width: 330,
				items: [
					appNameCombo,
					promotionNameCombo,
					weekdayCombo,
					clientCombo,
					countryCombo
				],

			};
			this.clientCombo = clientCombo;
			var searchFilter = {
				xtype: 'fieldset',
				title: 'Date Range',
				bodyStyle: 'padding: 5px;',
				height: 120,
				width: 330,
				items: [startDate, endDate, submitButton]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'west',
				width: 330,
				height: "100%",
				defaults: { border: false, defaults: { labelWidth: 80 } },
				items: [
					{
						items: [reportFilter, searchFilter]
					}
				]
			});
			var itemTpl = new Ext.XTemplate(
				'<div style = "padding: 15px">',
				'<tpl for = ".">',
				'<table class="report-table">',
				'<tr><td> Report From </td><td>: {[ExtHelper.renderer.DateTime(values.StartDate)]}</td></tr>',
				'<tr><td> Report To </td><td>: {[ExtHelper.renderer.DateTime(values.EndDate)]}</td></tr>',
				'</table>',
				'<br><br><br>',
				'<table class="report-table">',
				'<tr class="report-table-header-row"> <th>Outlet Code</th> <th>Outlet Name</th> <th>12AM</th><th>1AM</th> <th>2AM</th> <th>3AM</th> <th>4AM</th> <th>5AM</th> <th>6AM</th> <th>7AM</th> <th>8AM</th> <th>9AM</th> <th>10AM</th> <th>11AM</th> <th>12PM</th> <th>1PM</th> <th>2PM</th> <th>3PM</th> <th>4PM</th> <th>5PM</th> <th>6PM</th> <th>7PM</th> <th>8PM</th> <th>9PM</th> <th>10PM</th> <th>11PM</th></tr>',
				'{[this.appUIDDetail(values.ThirdPartyByAppUIDDetail)]}',
				'</table>',
				'</tpl>',
				'</div>',
				{
					appUIDDetail: function (ThirdPartyAppDetail) {
						var result = '';
						var count = ThirdPartyAppDetail.length;
						var tempCount = 1;
						ThirdPartyAppDetail.forEach(function (data) {
							result += '<tr class="data-row lastRow" > <td>' + data.OutletCode + '</td>  <td class="report-table-number-field">' + data.OutletName + '</td> <td class="report-table-number-field">' + data.AM12 + '</td> <td class="report-table-number-field">' + data.AM1 + '</td> <td class="report-table-number-field">' + data.AM2 + '</td> <td class="report-table-number-field">' + data.AM3 + '</td> <td class="report-table-number-field">' + data.AM4 + '</td> <td class="report-table-number-field">' + data.AM5 + '</td>  <td class="report-table-number-field">' + data.AM6 + '</td> <td class="report-table-number-field">' + data.AM7 + '</td> <td class="report-table-number-field">' + data.AM8 + '</td> <td class="report-table-number-field">' + data.AM9 + '</td> <td class="report-table-number-field">' + data.AM10 + '</td> <td class="report-table-number-field">' + data.AM11 + '</td> <td class="report-table-number-field">' + data.PM12 + '</td> <td class="report-table-number-field">' + data.PM1 + '</td> <td class="report-table-number-field">' + data.PM2 + '</td> <td class="report-table-number-field">' + data.PM3 + '</td> <td class="report-table-number-field">' + data.PM4 + '</td> <td class="report-table-number-field">' + data.PM5 + '</td> <td class="report-table-number-field">' + data.PM6 + '</td> <td class="report-table-number-field">' + data.PM7 + '</td> <td class="report-table-number-field">' + data.PM8 + '</td> <td class="report-table-number-field">' + data.PM9 + '</td> <td class="report-table-number-field">' + data.PM10 + '</td> <td class="report-table-number-field">' + data.PM11 + '</td> </tr>';
							tempCount++;
						});
						return result;
					},
					scope: this
				}
			);
			this.itemTpl = itemTpl;
			var resultPanel = new Ext.Panel({
				layout: 'fit',
				title: 'Result',
				autoScroll: true,
				region: 'center',
				tbar: [exportButton],
				tpl: itemTpl
			});
			this.resultPanel = resultPanel;

			this.panel = new Ext.form.FormPanel({
				title: 'Third Party Outlet By Hours Report',
				layout: 'border',
				closeAction: 'hide',
				closable: true,
				autoScroll: true,
				defaults: {
					border: false
				},
				items: [filterPanel, resultPanel]
			});
		}
		//if (disableFieldsOnClientId) {
		//	clientCombo.setValue(DA.Security.info.Tags.ClientName);
		//}
		return this.panel;
	},

	show: function () {
		DCPLApp.AddTab(this.createFilterPanel());

	},
	getPromotionNameValue: function (record) {
		this.promotionNameCombo.enable();
		var promotionNameComboStore = this.promotionNameCombo.store;
		if (promotionNameComboStore) {
			promotionNameComboStore.baseParams.thirdPartyAppId = record.get('LookupId');
		}
	}
});
Cooler.ThirdPartyOutletByHoursReport = new Cooler.ThirdPartyOutletByHoursReport();