Cooler.ConsolidatedClientReport = Ext.extend(Object, {

	onExportButtonClick: function (button) {
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();

		var format = button.tag || 'XLS';
		var url = 'Controllers/ConsolidatedClientReport.ashx?v=' + new Date();
		var params = { action: 'export', format: format, report: 'Consolidated Client Report', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId, days: Number(reportCriteria.RecordDays) };

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

		
		if (!this.mask) {
			var mask = new Ext.LoadMask(DCPLApp.TabPanel.body, { msg: 'Please wait...' });
			this.mask = mask;
		}
		this.mask.show();
		var params = { action: 'list', fromDate: reportCriteria.FromDate, toDate: reportCriteria.ToDate, clientId: reportCriteria.ClientId, countryId: reportCriteria.CountryId, days: Number(reportCriteria.RecordDays) };
		Ext.Ajax.request({
			url: 'Controllers/ConsolidatedClientReport.ashx',
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

			var daysStore = [[7, 'Last 7 Days'], [14, 'Last 14 Days']];
			var daysCombo = DA.combo.create({ fieldLabel: 'Record Days  ', value: 7, hiddenName: 'RecordDays', store: daysStore, width: 130 });
			this.daysCombo = daysCombo;

			var reportFilter = {
				xtype: 'fieldset',
				title: 'Filter',
				bodyStyle: 'padding: 5px;',
				height: 250,
				width: 300,
				items: [
					clientCombo,
					daysCombo,
					submitButton
				]
			};
			var searchFilter = {
				xtype: 'fieldset',
				title: 'Date Range',
				bodyStyle: 'padding: 5px;',
				height: 200,
				width: 300,
				items: [submitButton]
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
							'<table class="report-table">',
								'<tr><td>Report For</td> <td>: {values.Days}</td></tr>',
							'</table>',
							'<br><br><br>',
							'<table class="report-table">',
								'{[this.createHeader(values.HeaderInfo)]}',
								'{[this.installDetail(values.CountryDeviceDetail)]}',
							'</table>',
						'</tpl>',
					'</div>',
					{
						installDetail: function (countryDeviceDetail) {
							var result = '';
							countryDeviceDetail.forEach(function (data) {
								result += '<tr class="data-row">';
								for (var property in data) {
									var record = data[property] == null ? '' : data[property];
									var style = isNaN(record) ? "" : "style = 'text-align: right'";
									result += '<td ' + style + '>' + record + '</td>';
								}
								result += '</tr>';
							});
							return result;
						},
						createHeader: function (headerInfo) {
							var data = Ext.decode(headerInfo);
							var toReturn = '<thead> <tr class="report-table-header-row"><th colspan> Client </th>';
							data.Client.forEach(function (record) {
								toReturn += '<th colspan="' + record.Country.length + '" style="text-align:center">' + record.Client + '</th>'
							});
							toReturn += "</tr></thead><tbody><tr class='report-table-header-row'><th> Project </th>"

							data.Client.forEach(function (record) {

								for (var i = 0, len = record.Country.length; i < len; i++) {
									toReturn += '<th>' + record.Country[i] + '</th>'
								}
							});

							toReturn += "</tr></tbody>"
							return toReturn;
						},
						scope: this
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
				title: 'Consolidated Client Report',
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
Cooler.ConsolidatedClientReport = new Cooler.ConsolidatedClientReport();