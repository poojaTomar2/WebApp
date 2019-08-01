Cooler.ThirdPartyByAppUID = Ext.extend(Object, {

	onExportButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var periodOneSDateTime = '';
		var periodOneEDateTime = '';
		var periodTwoSDateTime = '';
		var periodTwoEDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.PeriodOneFromDate.length > 0) {
			var periodOneSDateTime = this.stringToDate(reportCriteria.PeriodOneFromDate);
		}
		if (reportCriteria.PeriodOneToDate.length > 0) {
			var periodOneEDateTime = this.stringToDate(reportCriteria.PeriodOneToDate);
		}
		if (reportCriteria.PeriodTwoFromDate.length > 0) {
			var periodTwoSDateTime = this.stringToDate(reportCriteria.PeriodTwoFromDate);
		}
		if (reportCriteria.PeriodTwoToDate.length > 0) {
			var periodTwoEDateTime = this.stringToDate(reportCriteria.PeriodTwoToDate);
		}
		reportCriteria.PeriodOneFromDate = periodOneSDateTime;
		reportCriteria.PeriodOneToDate = periodOneEDateTime;
		reportCriteria.PeriodTwoFromDate = periodTwoSDateTime;
		reportCriteria.PeriodTwoToDate = periodTwoEDateTime;

		if ((periodOneSDateTime <= minDate || periodOneSDateTime >= maxDate) || (periodOneEDateTime <= minDate || periodOneEDateTime >= maxDate) || (periodTwoSDateTime <= minDate || periodTwoSDateTime >= maxDate) || (periodTwoEDateTime <= minDate || periodTwoEDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than "1/1/1753" and greater than "31/12/9999".');
			return;
		}

		if ((periodOneSDateTime != '' && periodOneEDateTime != '') || (periodTwoSDateTime != '' && periodTwoEDateTime != '')) {
			if ((periodOneSDateTime > periodOneEDateTime) || (periodTwoSDateTime > periodTwoEDateTime)) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}

		var format = button.tag || 'XLS';
		var url = 'Controllers/ThirdPartyByAppUID.ashx?v=' + new Date();
		var params = {
			action: 'export',
			format: format,
			report: 'Third Party by Unique AppUID ',
			periodOnefromDate: reportCriteria.PeriodOneFromDate,
			periodOneToDate: reportCriteria.PeriodOneToDate,
			periodTwofromDate: reportCriteria.PeriodTwoFromDate,
			periodTwoToDate: reportCriteria.PeriodTwoToDate,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			applicationTypeId: reportCriteria.ThirdPartyAppId,
			locationTypeId: reportCriteria.locationTypeId,
			detectionFrequencyId: reportCriteria.DetectionFrequencyId,
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
		var periodOneSDateTime = '';
		var periodOneEDateTime = '';
		var periodTwoSDateTime = '';
		var periodTwoEDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.PeriodOneFromDate.length > 0) {
			var periodOneSDateTime = this.stringToDate(reportCriteria.PeriodOneFromDate);
		}
		if (reportCriteria.PeriodOneToDate.length > 0) {
			var periodOneEDateTime = this.stringToDate(reportCriteria.PeriodOneToDate);
		}
		if (reportCriteria.PeriodTwoFromDate.length > 0) {
			var periodTwoSDateTime = this.stringToDate(reportCriteria.PeriodTwoFromDate);
		}
		if (reportCriteria.PeriodTwoToDate.length > 0) {
			var periodTwoEDateTime = this.stringToDate(reportCriteria.PeriodTwoToDate);
		}
		reportCriteria.PeriodOneFromDate = periodOneSDateTime;
		reportCriteria.PeriodOneToDate = periodOneEDateTime;
		reportCriteria.PeriodTwoFromDate = periodTwoSDateTime;
		reportCriteria.PeriodTwoToDate = periodTwoEDateTime;

		if ((periodOneSDateTime <= minDate || periodOneSDateTime >= maxDate) || (periodOneEDateTime <= minDate || periodOneEDateTime >= maxDate) || (periodTwoSDateTime <= minDate || periodTwoSDateTime >= maxDate) || (periodTwoEDateTime <= minDate || periodTwoEDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than "1/1/1753" and greater than "31/12/9999".');
			return;
		}

		if ((periodOneSDateTime != '' && periodOneEDateTime != '') || (periodTwoSDateTime != '' && periodTwoEDateTime != '')) {
			if ((periodOneSDateTime > periodOneEDateTime) || (periodTwoSDateTime > periodTwoEDateTime)) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}
		var periodOnedateDiffInDays = this.datediffindays(periodOneSDateTime, periodOneEDateTime);
		var periodTwodateDiffInDays = this.datediffindays(periodTwoSDateTime, periodTwoEDateTime);
		if (periodOnedateDiffInDays > 31 || periodTwodateDiffInDays > 31)
		{
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
			periodTwofromDate: reportCriteria.PeriodTwoFromDate,
			periodTwoToDate: reportCriteria.PeriodTwoToDate,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			applicationTypeId: reportCriteria.ThirdPartyAppId,
			locationTypeId: reportCriteria.LocationTypeId,
			detectionFrequencyId: reportCriteria.DetectionFrequencyId,
			ThirdPartyPromotionId: reportCriteria.ThirdPartyPromotionId

		};
		//var params = { action: 'list', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId, applicationTypeId: reportCriteria.ThirdPartyAppId };

		if (params.applicationTypeId == "") {
			Ext.Msg.alert('Error', 'Please Select Application');
		}

		Ext.Ajax.request({
			url: 'Controllers/ThirdPartyByAppUID.ashx',
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
			var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
			var clientCombo = DA.combo.create({ fieldLabel: 'Client', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 250, disabled: disableFieldsOnClientId });
			var appNameCombo = DA.combo.create({ fieldLabel: 'Application', itemId: 'appNameCombo', name: 'ThirdPartyAppId', hiddenName: 'ThirdPartyAppId', controller: 'combo', listWidth: 250, baseParams: { comboType: 'ThirdPartyAppName' }, allowBlank: false });
			var promotionNameCombo = DA.combo.create({ fieldLabel: 'Promotion Name', name: 'ThirdPartyPromotionId', hiddenName: 'ThirdPartyPromotionId', controller: 'combo', baseParams: { comboType: 'ThirdPartyPromotionName' }, listWidth: 250, disabled: true });
			this.appNameCombo = appNameCombo;
			this.promotionNameCombo = promotionNameCombo;
			appNameCombo.on('select', function (combo, newValue) {
				this.getPromotionNameValue(newValue);
			}, this);
			var locationTypeCombo = DA.combo.create({ fieldLabel: 'Trade Channel', name: 'LocationTypeId', hiddenName: 'LocationTypeId', controller: 'combo', baseParams: { comboType: 'LocationType' }, listWidth: 220 });
			var countryCombo = DA.combo.create({ fieldLabel: 'Country', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 250 });
			var periodOneStartDate = new Ext.form.DateField({ name: 'PeriodOneFromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var periodOneEndDate = new Ext.form.DateField({ name: 'PeriodOneToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var periodTwoStartDate = new Ext.form.DateField({ name: 'PeriodTwoFromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var periodTwoEndDate = new Ext.form.DateField({ name: 'PeriodTwoToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var exportButton = new Ext.SplitButton({ text: 'Export', menu: { items: [{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }], listeners: { itemclick: this.onExportButtonClick, scope: this } }, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel' });
			var detectionFrequencyStore = [[1, 'Daily'], [2, 'Weekly'], [3, 'Monthly']];
			var detectionFrequencyCombo = DA.combo.create({ fieldLabel: 'Detection Frequency ', value: 1, name: 'DetectionFrequencyId', hiddenName: 'DetectionFrequencyId', store: detectionFrequencyStore, listWidth: 250 });
			this.detectionFrequencyCombo = detectionFrequencyCombo;
			var reportFilter = {
				xtype: 'fieldset',
				title: 'Filter',
				bodyStyle: 'padding: 5px;',
				height: 200,
				width: 330,
				items: [
					appNameCombo,
					promotionNameCombo,					
					clientCombo,
					countryCombo,
					locationTypeCombo,
					detectionFrequencyCombo
				],

			};
			this.clientCombo = clientCombo;
			var periodOne = {
				xtype: 'fieldset',
				title: 'Period One',
				bodyStyle: 'padding: 5px;',
				height: 100,
				width: 300,
				items: [periodOneStartDate, periodOneEndDate]
			};
			var periodTwo = {
				xtype: 'fieldset',
				title: 'Period Two',
				bodyStyle: 'padding: 5px;',
				height: 100,
				width: 300,
				items: [periodTwoStartDate, periodTwoEndDate]
			};
			var searchFilter = {
				xtype: 'fieldset',
				title: 'Date Range',
				bodyStyle: 'padding: 5px;',
				height: 290,
				width: 350,
				items: [periodOne, periodTwo, submitButton]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'west',
				width: 350,
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
								'<tr><td>Period One</td> <td> Report From </td><td>: {[ExtHelper.renderer.DateTime(values.PeriodOneStartDate)]}</td></tr>',
								'<tr><td></td> <td> Report To </td><td>: {[ExtHelper.renderer.DateTime(values.PeriodOneEndDate)]}</td></tr>',
								'<tr><td>Period Two</td> <td> Report From </td><td>: {[ExtHelper.renderer.DateTime(values.PeriodTwoStartDate)]}</td></tr>',
								'<tr><td></td> <td> Report To </td><td>: {[ExtHelper.renderer.DateTime(values.PeriodTwoEndDate)]}</td></tr>',
							'</table>',
							'<br><br><br>',
							'<table class="report-table" style="border:1px solid black">',
								'<tr class="report-table-header-row"> <th>  </th> <th>Period One</th> <th>Period Two</th> </tr>',
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
								if (count == tempCount) {
									tempCount = 0;
									result += '<tr class="data-row" > <td>' + data.Header + '</td>  <td class="report-table-number-field">' + data.PeriodOne + '</td> <td class="report-table-number-field">' + data.PeriodTwo + '</td> </tr>';
								}
								else {
									result += '<tr class="data-row"> <td>' + data.Header + '</td> <td class="report-table-number-field">' + data.PeriodOne + '</td> <td class="report-table-number-field">' + data.PeriodTwo + '</td> </tr>';
									tempCount++;
								}

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
				title: 'Third Party By AppUID',
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
		if (disableFieldsOnClientId) {
			clientCombo.setValue(DA.Security.info.Tags.ClientName);
		}
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
Cooler.ThirdPartyByAppUID = new Cooler.ThirdPartyByAppUID();