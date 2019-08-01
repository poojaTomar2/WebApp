Cooler.InstalledAndNotInstalledReport = Ext.extend(Object, {
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
		var url = 'Controllers/InstalledAndNotInstalledReport.ashx?v=' + new Date();
		var params = { action: 'export', format: format, report: 'Installed And Not Installed Device Report', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId };

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
			url: 'Controllers/InstalledAndNotInstalledReport.ashx',
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
			var startDate = new Ext.form.DateField({ name: 'FromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var endDate = new Ext.form.DateField({ name: 'ToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var exportButton = new Ext.SplitButton({ text: 'Export', menu: { items: [{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }], listeners: { itemclick: this.onExportButtonClick, scope: this } }, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel' });
			if (DA.Security.info.Tags.ClientId == 1) {
				startDate.setValue("01/09/2016");
			}

			var searchFilter = {
				xtype: 'fieldset',
				title: 'Date Range',
				bodyStyle: 'padding: 5px;',
				height: 200,
				width: 300,
				items: [clientCombo, startDate, endDate, submitButton]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'west',
				width: 300,
				height: "100%",
				defaults: { border: false, defaults: { labelWidth: 80 } },
				items: [
					{
						items: [searchFilter]
					}
				]
			});

			var itemTpl = new Ext.XTemplate(
					'<div style = "padding: 15px; overflow: scroll; height: 90%; width: 200%">',
						'<tpl for = ".">',
							'{[this.installDetail(values.CountryDeviceDetail)]}',
						'</tpl>',
					'</div>',
					{
						installDetail: function (countryDeviceDetail) {
							var countryCount = countryDeviceDetail.notInstalledDevice.length;	// Get Number of Countries
							if (countryCount > 0) {
								if (countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped != null) {
									var result = '';
									//================== [START] SHIPPED - NOT INSTALLED REPORT ================

									var manufacturerCount = countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped[0].manufacturerShipped.length;	// Count of Manufacturer
									var clientName = countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped[0].clientName;	// Client Name
									var mergeCellForClientName = manufacturerCount + 1;				  // ColSpan For ROW [Client]
									var mergeCellForNotInstalledHeading = mergeCellForClientName + 1; // ColSpan For ROW [Shipped - Not Installed]
									var report_1_name = 'Shipped - Not Installed';	// Static Header Name
									var totalColumnName = "Total";					// Static Header Name

									result = result + '<table class="report-table" style = "border-bottom: 1px solid black; border-left: 1px solid black; border-top: 1px solid black; width: 50%; float: left; border-collapse: collapse">';
									result += '<tr class="data-row" > <th style = "text-align: center ; background: #fff; color: #000; border: 1px solid black" colspan=1 ; rowspan=3></th>';
									result += '<th style = "text-align: center ; background: #fce4d6; color: #000" colspan=' + mergeCellForNotInstalledHeading + '>' + report_1_name + '</th></tr>';
									result += '<tr class="data-row" > <th style = "text-align: center ; background: #fce4d6; color: #000; border: 1px solid black" colspan=' + mergeCellForClientName + '>' + clientName + '</th>';
									result += '<th style = "text-align: center ; background: #fce4d6; color: #000; border: 1px solid black" colspan=1; rowspan = 2>' + totalColumnName + '</th></tr>';
									result += '<tr class="data-row" >';
									countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped[0].manufacturerShipped.forEach(function (data) {
										result += '<th style = "text-align: center ; background: #fce4d6; color: #000; border: 1px solid black">' + data.deviceManufacturerNameShipped + '</th>';
									});
									result += '<th style = "text-align: center ; background: #fce4d6; color: #000; border: 1px solid black">Total</th>';
									result += '</tr>'

									countryDeviceDetail.notInstalledDevice.forEach(function (data) {
										var countryName = data.countryShipped;
										var deviceCount_grandTotal = data.deviceTotalShipped;
										var manufacturerDetails = data.manufacturerDataShipped[0].manufacturerShipped;
										var manufacturerDetail = data.manufacturerDataShipped[0].manufacturerShipped[0].deviceCountShipped;
										var manufacturerName = data.manufacturerDataShipped[0].manufacturerShipped[0].deviceManufacturerNameShipped;
										//============ Creating Column For Country Name ==========================
										result += '<tr class="data-row" ><td style = "text-align: left ; background: #fff; color: #000; border: 1px solid black">' + countryName + '</td>';

										//============ Creating Column For Device Count And Fill Device Count==========================
										for (var i = 0; i < manufacturerDetails.length; i++) {
											result += '<td style = "text-align: center ; background: #fff; color: #000; border: 1px solid black">' + data.manufacturerDataShipped[0].manufacturerShipped[i].deviceCountShipped + '</td>';
										}
										//============ Creating Column For Total [2 Times for One Clinet, so Loop will Execute 2 Times]=====================
										for (var i = 0; i < 2; i++) {
											result += '<td style = "text-align: center ; background: #fff; color: #000; border: 1px solid black">' + data.manufacturerDataShipped[0].totalShipped + '</td>';
										}
									});
									result += '</tr>'
									result = result + '</table>';
								}
								else {
									var result = '';
								}

								//================== [END] SHIPPED - NOT INSTALLED REPORT ==================
								//==========================================================================

								//================== [START] INSTALLED REPORT ==============================
								if (countryDeviceDetail.installedDevice[0].manufacturerData != null) {
									var manufacturerCount = countryDeviceDetail.installedDevice[0].manufacturerData[0].manufacturer.length;
									var mergeCellForClientName = manufacturerCount + 1;				  // ColSpan For ROW [Client]
									var mergeCellForNotInstalledHeading = mergeCellForClientName + 1; // ColSpan For ROW [Shipped - Not Installed]
									var report_2_name = 'Installed';				// Static Header Name
									var totalColumnName = "Total";					// Static Header Name

									result = result + '<table class="report-table" style = "border: 1px solid black; width: 50%; float: left; border-collapse: collapse">';
									var outletTypeCount = countryDeviceDetail.installedDevice[0].manufacturerData.length;
									var manufecturerCount = countryDeviceDetail.installedDevice[0].manufacturerData[0].manufacturer.length;
									var colSpanForReportNameInstalledDevice = (outletTypeCount * (manufacturerCount + 1)) + 1;
									if (countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped == null) {
										result += '<tr class="data-row" ><th style = "background: white"></th><th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black" colspan=' + colSpanForReportNameInstalledDevice + '>' + report_2_name + '</th></tr>';
									}
									else {
										result += '<tr class="data-row" ><th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black" colspan=' + colSpanForReportNameInstalledDevice + '>' + report_2_name + '</th></tr>';
									}
									result = result + '<tr class="data-row" >';
									for (var i = 0; i < outletTypeCount; i++) {
										var outletType = countryDeviceDetail.installedDevice[0].manufacturerData[i].outletType;
										if (countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped == null && i == 0) {
											result += '<th style = "background: white"></th><th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black" colspan=' + (manufecturerCount + 1) + '>' + outletType + '</th>';
										}
										else {
											result += '<th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black" colspan=' + (manufecturerCount + 1) + '>' + outletType + '</th>';
										}
									}
									result += '<th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black" colspan=1; rowspan = 2>' + totalColumnName + '</th></tr>';
									result += '<tr class="data-row" >';
									var cnt = 0;
									for (var i = 0; i < outletTypeCount; i++) {
										var len = countryDeviceDetail.installedDevice[0].manufacturerData[i].manufacturer.length;
										for (var j = 0; j < len; j++) {
											if (countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped == null && cnt == 0) {
												result += '<th style = "background: white"></th><th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black">' + countryDeviceDetail.installedDevice[0].manufacturerData[i].manufacturer[j].deviceManufacturerName + '</th>';
												cnt++;
											}
											else {
												result += '<th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black">' + countryDeviceDetail.installedDevice[0].manufacturerData[i].manufacturer[j].deviceManufacturerName + '</th>';
											}
										}
										result += '<th style = "text-align: center ; background: #d9e1f2; color: #000; border: 1px solid black">Total</th>';
									}

									//======================== [Start], Loop For Smart Device Count, Total And Grand Total Of INSTALLED Device Report================
									for (var i = 0; i < countryCount; i++) {
										var repeatedNode = countryDeviceDetail.installedDevice[i];
										result += '<tr class="data-row" >';
										var countryNameInstalledDevice = countryDeviceDetail.installedDevice[i].country;
										if (countryDeviceDetail.notInstalledDevice[0].manufacturerDataShipped == null) {
											//============ Creating Column For Country Name ==========================
											result += '<tr class="data-row" ><td style = "text-align: left ; background: #fff; color: #000; border: 1px solid black">' + countryNameInstalledDevice + '</td>';
										}
										for (j = 0; j < outletTypeCount; j++) {
											for (k = 0; k < manufecturerCount; k++) {
												//================ Getting Count Of Smart Devices of Each manufecturer ==============
												result += '<td style = "text-align: center ; background: #fff; color: #000; border: 1px solid black">' + repeatedNode.manufacturerData[j].manufacturer[k].deviceCount + '</td>';
											}
											//================ Getting Total of particular Outlet Type ==============
											result += '<td style = "text-align: center ; background: #fff; color: #000; border: 1px solid black">' + repeatedNode.manufacturerData[j].total + '</td>';
										}
										//================ Getting Grand Total of All Outlet Type ==============
										result += '<td style = "text-align: center ; background: #fff; color: #000; border: 1px solid black">' + repeatedNode.deviceTotal + '</td>';
										result += '</tr>'
									}
									result += '</tr>'
									//======================== [End], Loop For Smart Device Count, Total And Grand Total Of INSTALLED Device Report================
									result = result + '</table>';
								}
								return result;
							}
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
				title: 'Installed And Not Installed Device Report',
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
Cooler.InstalledAndNotInstalledReport = new Cooler.InstalledAndNotInstalledReport();