Cooler.BatteryLevelReportByCountry = Ext.extend(Object, {

	onExportButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var sDateTime = '';
		var eDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.FromDate.length > 0) {
			var sDateTime = this.stringToDate(reportCriteria.FromDate);
		}
		if (reportCriteria.ToDate.length > 0) {
			var eDateTime = this.stringToDate(reportCriteria.ToDate);
		}

		reportCriteria.FromDate = sDateTime;
		reportCriteria.ToDate = eDateTime;

		if ((sDateTime <= minDate || sDateTime >= maxDate) || (eDateTime <= minDate || eDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than 1/1/1753 and greater than 31/12/9999.');
			return;
		}
		if (sDateTime != '' && eDateTime != '') {
			if (sDateTime > eDateTime) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}

		var format = button.tag || 'XLS';
		var url = 'Controllers/BatteryLevelReportByCountry.ashx?v=' + new Date();
		var params = { action: 'export', format: format, report: 'Battery Level Report By Country Report', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId };

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

	onShowButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var sDateTime = '';
		var eDateTime = '';
		var minDate = new Date(1753, 1, 1);
		var maxDate = new Date(9999, 12, 31);
		if (reportCriteria.FromDate.length > 0) {
			var sDateTime = this.stringToDate(reportCriteria.FromDate);
		}
		if (reportCriteria.ToDate.length > 0) {
			var eDateTime = this.stringToDate(reportCriteria.ToDate);
		}
		reportCriteria.FromDate = sDateTime;
		reportCriteria.ToDate = eDateTime;

		if ((sDateTime <= minDate || sDateTime >= maxDate) || (eDateTime <= minDate || eDateTime >= maxDate)) {
			Ext.Msg.alert('Alert', 'Start Date  or End Date cannot be less than "1/1/1753" and greater than "31/12/9999".');
			return;
		}

		if (sDateTime != '' && eDateTime != '') {
			if (sDateTime > eDateTime) {
				Ext.Msg.alert('Alert', 'Start Date cannot be greater than End Date.');
				return;
			}
		}
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var params = { action: 'list', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId };
		Ext.Ajax.request({
			url: 'Controllers/BatteryLevelReportByCountry.ashx',
			params: params,
			success: this.onInstalledDeviceSuccess,
			failure: function (response, options) {
				this.mask.hide();
				if (response.status === 401) {
					ExtHelper.Plugins.ExceptionHandler.exceptionHandler('', options, response)
				}
			},
			scope: this
		});
	},
	onInstalledDeviceSuccess: function (result, request) {
		this.mask.hide();
		var response = Ext.decode(result.responseText);
		if (response.success) {
			response.CountryDeviceDetail = response.CountryDeviceDetail.records;
			this.itemTpl.overwrite(this.resultPanel.body, response);
		}
		else {
			Ext.Msg.alert('Error', response.info);
		}
	},
	createFilterPanel: function () {
		if (!this.panel) {
			var disableFieldsOnClientId = DA.Security.info.Tags.ClientId != 0;
			var clientCombo = DA.combo.create({ fieldLabel: 'Client', width: 180, name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', baseParams: { comboType: 'Client' }, listWidth: 220, disabled: disableFieldsOnClientId });
			var countryCombo = DA.combo.create({ fieldLabel: 'Country', width: 180, name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', baseParams: { comboType: 'Country' }, listWidth: 220 });
			var startDate = new Ext.form.DateField({ name: 'FromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var endDate = new Ext.form.DateField({ name: 'ToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var exportButton = new Ext.SplitButton({ text: 'Export', menu: { items: [{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }], listeners: { itemclick: this.onExportButtonClick, scope: this } }, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel' });
			var reportFilter = {
				xtype: 'fieldset',
				title: 'Filter',
				bodyStyle: 'padding: 5px;',
				height: 250,
				width: 300,
				items: [
					clientCombo,
					countryCombo
				]
			};
			var searchFilter = {
				xtype: 'fieldset',
				title: 'Date Range',
				bodyStyle: 'padding: 5px;',
				height: 200,
				width: 300,
				items: [startDate, endDate, submitButton]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'west',
				width: 300,
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
								'<tr><td>Report From</td> <td>: {[ExtHelper.renderer.DateTime(values.StartDate)]}</td></tr>',
								'<tr><td>Report To</td> <td>: {[ExtHelper.renderer.DateTime(values.EndDate)]}</td></tr>',
							'</table>',
							'<br><br><br>',
							'<table class="report-table">',
								'<tr class="report-table-header-row"> <th>Battery Level</th> <th>0-25</th> <th>25-50</th> <th>50-75</th> <th>75-100</th> </tr>',
								'{[this.installDetail(values.CountryDeviceDetail)]}',
							'</table>',
						'</tpl>',
					'</div>',
					{
						installDetail: function (countryDeviceDetail) {
							var result = '';
							var count = countryDeviceDetail.length;
							var tempCount = 1;

							countryDeviceDetail.forEach(function (data) {
								if (count == tempCount) {
									tempCount = 0;
									result += '<tr class="data-row lastRow" > <td>' + data.BatteryLevel + '</td>  <td class="report-table-number-field">' + data.Smart0to25 + '</td> <td class="report-table-number-field">' + data.Smart25to50 + '</td> <td class="report-table-number-field">' + data.Smart50to75 + '</td> <td class="report-table-number-field">' + data.Smart75to100 + '</td></tr>';
								}
								else {
									result += '<tr class="data-row"> <td>' + data.BatteryLevel + '</td> <td class="report-table-number-field">' + data.Smart0to25 + '</td> <td class="report-table-number-field">' + data.Smart25to50 + '</td> <td class="report-table-number-field">' + data.Smart50to75 + '</td> <td class="report-table-number-field">' + data.Smart75to100 + '</td> </tr>';
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
				title: 'Battery Level Report By Country',
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
		return this.panel;
	},

	show: function () {
		DCPLApp.AddTab(this.createFilterPanel());
	}
});
Cooler.BatteryLevelReportByCountry = new Cooler.BatteryLevelReportByCountry();