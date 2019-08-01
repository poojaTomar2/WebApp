Cooler.InstallReportFrigoVsClient = Ext.extend(Object, {
	regionSelected: null,
	solutionSelected: null,
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
		var url = 'Controllers/InstallReportFrigoVsClient.ashx?v=' + new Date();
		var params =
		{
			action: 'export',
			format: format,
			report: 'Install Report Frigo vs Client',
			fromDate: reportCriteria.FromDate,
			toDate: reportCriteria.ToDate,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			days: Number(reportCriteria.RecordDays),
			CCHSolution: Number(reportCriteria.SolutionId),
			Region: Number(reportCriteria.RegionId),
			ReportType: Number(reportCriteria.ReportTypeId),
			CCHSolutionName: this.solutionCombo.lastSelectionText
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

	onShowButtonClick: function (button) {
		regionSelected = this.regionCombo.getRawValue();
		solutionSelected = this.solutionCombo.getRawValue();
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

		if (reportCriteria.SolutionId == '') {
			Ext.Msg.alert('Alert', 'Select Solution.');
			return;
		}

		if (reportCriteria.FromDate == '') {
			Ext.Msg.alert('Alert', 'Start Date Can not be blank.');
			return;
		}

		if (reportCriteria.ToDate == '') {
			Ext.Msg.alert('Alert', 'End Date Can not be blank.');
			return;
		}

		if (reportCriteria.ReportTypeId == '') {
			Ext.Msg.alert('Alert', 'Select Report Type');
			return;
		}

		if (reportCriteria.RegionId == '' && reportCriteria.CountryId == '') {
			Ext.Msg.alert('Alert', 'Select Region OR Country.');
			return;
		}

		if (reportCriteria.RegionId >= 0 && reportCriteria.CountryId >= 0 && reportCriteria.RegionId != '' && reportCriteria.CountryId != '') {
			Ext.Msg.show({
				title: 'Alert',
				msg: 'Select either Region OR Country.',
				buttons: Ext.Msg.OK,
				icon: Ext.Msg.WARNING
			});
			this.regionCombo.clearValue();
			this.countryCombo.clearValue();
			return;
		}

		var params =
		{
			action: 'list',
			fromDate: reportCriteria.FromDate,
			toDate: reportCriteria.ToDate,
			clientId: reportCriteria.ClientId,
			countryId: reportCriteria.CountryId,
			days: Number(reportCriteria.RecordDays),
			CCHSolution: Number(reportCriteria.SolutionId),
			Region: Number(reportCriteria.RegionId),
			ReportType: Number(reportCriteria.ReportTypeId)
		};

		var reportTypeIndex = Number(reportCriteria.ReportTypeId);
		if (this.regionCombo.selectedIndex >= 0) {
			if (!this.mask) {
				var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
				this.mask = mask;
			}
			this.mask.show();
			Ext.Ajax.request({
				url: 'Controllers/InstallReportFrigoVsClient.ashx',
				params: params,
				success: this.onInstalledDeviceSuccess,
				failure: function (response, options) {
					this.mask.hide();
					if (response.status === 401) {
						ExtHelper.Plugins.ExceptionHandler.exceptionHandler('', options, response)
					}
				},
				scope: this,
				timeout: 30000
			});
		}
	},

	onInstalledDeviceSuccess: function (result, request) {
		this.mask.hide();
		var response = Ext.decode(result.responseText);
		var countryArray = [];
		var monthArray = [];
		var deviceCountArray = [];
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
			var submitButton = new Ext.Button({ text: 'Show', handler: this.onShowButtonClick, scope: this });
			var exportButton = new Ext.SplitButton({ text: 'Export', menu: { items: [{ text: 'Excel', iconCls: 'exportExcel', tag: 'XLS' }], listeners: { itemclick: this.onExportButtonClick, scope: this } }, handler: this.onExportButtonClick, scope: this, iconCls: 'exportExcel' });

			var typeOfReport = [[1, 'Frigo Coolers'], [2, 'Client Coolers']];
			var typeOfReportCombo = DA.combo.create({ fieldLabel: 'Type of report ', value: 1, name: 'ReportTypeId', hiddenName: 'ReportTypeId', store: typeOfReport, width: 180 });
			this.typeOfReportCombo = typeOfReportCombo;

			typeOfReportCombo.on('select', function (combo, newValue) {
				this.getTypeComboValue(newValue)
			}, this);

			var startDate = new Ext.form.DateField({ name: 'FromDate', fieldLabel: 'Start Date', width: 180, value: Cooler.DateOptions.AddDays(new Date(), -7), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat, scope: this });
			var endDate = new Ext.form.DateField({ name: 'ToDate', fieldLabel: 'End Date', width: 180, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat, scope: this });

			var solutionStore = [[1, 'All'], [2, 'Always on + camera'], [3, 'Always on'], [4, 'Proximity + camera'], [5, 'Proximity'], [6, 'Beacon'], [7, 'Always On built-in'], [8, 'Proximity built-in']];
			var solutionCombo = DA.combo.create({ fieldLabel: 'Solution ', value: 1, name: 'SolutionId', hiddenName: 'SolutionId', store: solutionStore, width: 180 });
			this.solutionCombo = solutionCombo;

			solutionCombo.on('select', function (combo, newValue) {
				this.getSolutionComboValue(newValue)
			}, this);

			var regionCombo = DA.combo.create({ fieldLabel: 'Region ', name: 'RegionId', hiddenName: 'RegionId', controller: 'combo', width: 180, baseParams: { comboType: 'Region' }, });
			this.regionCombo = regionCombo;

			regionCombo.on('select', function (combo, newValue) {
				this.getregionComboValue(newValue)
			}, this);

			var countryCombo = DA.combo.create({ fieldLabel: 'Country ', name: 'CountryId', hiddenName: 'CountryId', controller: 'combo', width: 180, baseParams: { comboType: 'Country' }, listWidth: 220 });
			this.countryCombo = countryCombo;

			var labelText = new Ext.form.Label({
				text: 'OR', cls: 'form-component', scope: this, style: {
					margin: '150px'
				}
			});
			var reportFilter = {
				xtype: 'fieldset',
				title: 'Filter',
				bodyStyle: 'padding: 5px;',
				height: 250,
				width: 300,
				items: [
					typeOfReportCombo,
					startDate,
					endDate,
					solutionCombo,
					regionCombo,
					labelText,
					countryCombo,
					submitButton
				]
			};

			var filterPanel = new Ext.Panel({
				layout: 'form',
				region: 'west',
				width: 300,
				height: "100%",
				defaults: { border: false, defaults: { labelWidth: 80 } },
				items: [
					{
						items: [reportFilter]
					}
				]
			});

			var itemTpl = new Ext.XTemplate(
				'<div style = "padding: 15px; overflow: scroll; height: 90%">',
				'<tpl for = ".">',
				'{[this.installDetail(values.CountryDeviceDetail)]}',
				'</tpl>',
				'</div>',
				{
					installDetail: function (data) {
						if (data.deviceData.length > 0 && data.grandTotal.length > 0 && data.grandTotal.length != undefined && data.deviceData.length != undefined) {
							var result = '';
							var cnt = 0;
							data.deviceData.forEach(function (countryDevice) {
								var getRegId = countryDevice.region;
								var countryDeviceDetail = countryDevice.deviceData;
								var sumLoopLength = countryDeviceDetail[0].months.length;					// Count of Months
								var sumLoopLen = countryDeviceDetail[0].months[0].outletTypeCount.length;	// Count of Outlet type (Market, Warehouse, Test) in per months
								var totalLoopCount = sumLoopLength * sumLoopLen
								var count = 1;
								var dataRowCount = 1

								result = result + '<br><br><br>';
								result = result + '<table class="report-table">';
								if (solutionSelected != 'All') {
									result = result + '<tr class="report-table-header-row solution"><th style = "text-align: center ; background: #fff"></th><th style = "text-align: center ; background: #ffd677; color: #000" colspan=' + totalLoopCount + '>' + solutionSelected + '</th></tr>'
								}
								result = result + '<tr class="report-table-header-row month row ' + count + '"><th style = "text-align: center ; background: white" rowspan="2"></th>'
								for (var i = 0; i < 1; i++) {
									var colspan = countryDeviceDetail[0].months[0].outletTypeCount.length;
									for (var j = 0; j < countryDeviceDetail[0].months.length; j++) {
										result += '<th style = "text-align: center" colspan="' + colspan + '">' + countryDeviceDetail[0].months[j].month + '</th>';
									}
								}
								count++;
								result = result + '</tr>';
								result = result + '<tr class="report-table-header-row row ' + count + '">';
								for (var i = 0; i < 1; i++) {
									for (var j = 0; j < countryDeviceDetail[0].months.length; j++) {
										for (var k = 0; k < countryDeviceDetail[0].months[0].outletTypeCount.length; k++) {
											result += '<th class = "region-table-data" style = "text-align: center; padding: 0 5px">' + countryDeviceDetail[0].months[0].outletTypeCount[k].outletType + '</th>';
										}
									}
								}
								var hTotal = [];	// Horizontal Total, Array 
								result = result + '<th style = "text-align: center; padding: 0 5px">Total</th></tr>';

								countryDeviceDetail.forEach(function (data) {
									result += '<tr class="data-row row ' + dataRowCount + '">';
									for (var i = 0; i < 1; i++) {
										result += '<td class = "Country" style = "text-align:left; white-space:nowrap; padding: 0 5px; width:30%">' + data.country + '</td>';
									}
									for (var j = 0; j < data.months.length; j++) {
										for (var k = 0; k < data.months[j].outletTypeCount.length; k++) {
											result += '<td class= "sum" style = "text-align:center; white-space:nowrap">' + data.months[j].outletTypeCount[k].deviceCount + '</td>';
											if (isNaN(hTotal[j])) {
												hTotal[j] = 0;
											}
											hTotal[j] += data.months[j].outletTypeCount[k].deviceCount;
										}
									}
									var hSum = hTotal.reduce(add, 0); // sum of the Each Row.
									function add(a, b) {
										return a + b;
									}
									result += '<td class = "Horizontal Total" style = "text-align:center; white-space:nowrap; font-weight:900">' + hSum + '</td>';
									hTotal = [];
									dataRowCount++;
									result += '</tr>';
								});

								var regionCount = 'Region ' + getRegId + ' Total';
								result += '<tr class = "data-row row"><td class = "Region" style = "text-align:left; white-space:nowrap; font-weight:900; padding: 0 5px; width:30%"><b>' + regionCount + '</b></td>';
								data.totalPerOutletType.forEach(function (countryDeviceData) {
									if (getRegId == countryDeviceData.regionId) {

										var count = 0;
										for (var j = 0; j < data.totalPerOutletType[cnt].total.length; j++) {
											result += '<td class = "total" style = "text-align:center; white-space:nowrap; font-weight:900">' + data.totalPerOutletType[cnt].total[j] + '</td>';
										}
										result += '</tr>';
										result = result + '</table>';
									}
									count++;
								});
								cnt++;
							});
							//============ Table for Summary Details =========================
							if (regionSelected == 'All') {
								result = result + '<br><br><br>';
								result = result + '<table class="report-table">';
								result = result + '<tr class="report-table-header-row month row 1"><th style = "text-align: center ; background: white" rowspan="2"></th>'
								for (var i = 0; i < 1; i++) {
									var colspan = data.deviceData[0].deviceData[0].months[0].outletTypeCount.length;
									for (var j = 0; j < data.deviceData[0].deviceData[0].months.length; j++) {
										result += '<th style = "text-align: center" colspan="' + colspan + '">' + data.deviceData[0].deviceData[0].months[j].month + '</th>';
									}
								}
								result = result + '</tr>';
								result = result + '<tr class="report-table-header-row row 1">';
								for (var i = 0; i < 1; i++) {
									for (var j = 0; j < data.deviceData[0].deviceData[0].months.length; j++) {
										for (var k = 0; k < data.deviceData[0].deviceData[0].months[0].outletTypeCount.length; k++) {
											result += '<th class = "summary-data" style = "text-align: center; padding: 0 5px">' + data.deviceData[0].deviceData[0].months[0].outletTypeCount[k].outletType + '</th>';
										}
									}
								}
								result = result + '<th style = "text-align: center; padding: 0 5px">Total</th></tr>';
								result += '<tr class = "data-row row"><td class = "Region" style = "text-align:left; white-space:nowrap; font-weight:900; padding: 0 5px; width: 30%"><b>Total All Regions</b></td>';
								var monthLength = data.deviceData[0].deviceData[0].months.length;
								var outletPerMonth = data.deviceData[0].deviceData[0].months[0].outletTypeCount.length;
								var outletInAllMonths = monthLength * outletPerMonth;
								var hSum = 0;
								for (var i = 0; i < outletInAllMonths; i++) {
									result += '<td class= "sum" style = "text-align:center; white-space:nowrap; font-weight:900">' + data.grandTotal[i] + '</td>';
									hSum += data.grandTotal[i];
								}
								result += '<td class = "Horizontal Total" style = "text-align:center; white-space:nowrap; font-weight:900">' + hSum + '</td>';
								result += '</tr>';
								result = result + '</table>';
								//============ End Table for Summary Details =========================
							}
							return result;
						}
						else {
							Ext.Msg.alert('Alert', 'Record not found in given date range. <b>' + startDate.value + '</b>&nbsp;&nbsp; To&nbsp;&nbsp; <b>' + endDate.value + '</b>');
						}
					},
				}
			);
			this.itemTpl = itemTpl;
			var resultPanel = new Ext.Panel({
				layout: 'fit',
				title: 'Result',
				region: 'center',
				tbar: [exportButton],
				tpl: itemTpl
			});
			this.resultPanel = resultPanel;

			this.panel = new Ext.form.FormPanel({
				title: 'Install Report Frigo vs Client',
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
	getSolutionComboValue: function (solutionId) {
		var ddlSolutionComboId = solutionId.id;
	},

	getTypeComboValue: function (ReportTypeId) {
		var ddlTypeComboId = ReportTypeId.id;
	},

	getregionComboValue: function (RegionId) {
		var ddlRegionComboId = RegionId.id;
	},

	show: function () {
		DCPLApp.AddTab(this.createFilterPanel());
	},

	stringToDate: function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	},
});
Cooler.InstallReportFrigoVsClient = new Cooler.InstallReportFrigoVsClient();