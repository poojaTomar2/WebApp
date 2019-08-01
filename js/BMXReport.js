Cooler.BMXReport = Ext.extend(Object, {

	dateDifferanceInDays: function daydiff(first, second) {
		return Math.round(((second - first) / (1000 * 60 * 60 * 24)) + 1);
	},
	stringToDate : function (dateStr) {
		dateStr = dateStr.toString(); //force conversion
		var parts = dateStr.split("-");
		parts = dateStr.split("/");
		return new Date(parts[2], parts[1] - 1, parts[0]);
	},
	
	onApplyButtonClick: function (button) {

		
		var form = this.panel.getForm();
		var reportCriteria = form.getValues();
		var sDateTime = '';
		var eDateTime = '';
		if (reportCriteria.FromDate.length > 0) {
			var sDateTime = this.stringToDate(reportCriteria.FromDate);
			var eDateTime = this.stringToDate(reportCriteria.ToDate);
			reportCriteria.FromDate = sDateTime;
			reportCriteria.ToDate = eDateTime;
		}
	
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

		var url = 'Controllers/BMXReport.ashx?v=' + new Date();
		var params = { format: 'XLS', report: 'BMXReport', reportCriteria: Ext.encode(reportCriteria) };

		ExtHelper.HiddenForm.submit({
			action: url,
			params: params,
			target: "_blank"
		})
	},

	createDashboard: function () {
		var clientCombo = DA.combo.create({ fieldLabel: 'Client', width: 220, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
		var locationCombo = DA.combo.create({ fieldLabel: 'Location', width: 220, itemId: 'locationCombo', name: 'LocationId', hiddenName: 'LocationId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Location' } });
		var assetCombo = DA.combo.create({ fieldLabel: 'Asset', width: 220, itemId: 'assetCombo', name: 'AssetId', hiddenName: 'AssetId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Asset' } });
		ExtHelper.SetCascadingCombo(clientCombo, locationCombo);
		ExtHelper.SetCascadingCombo(locationCombo, assetCombo);
		var startDate = new Ext.form.DateField({ name: 'FromDate', fieldLabel: 'Start Date', width: 200, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		var endDate = new Ext.form.DateField({ name: 'ToDate', fieldLabel: 'End Date', width: 200, value: Cooler.DateOptions.AddDays(new Date()), maxValue: Cooler.DateOptions.AddDays(new Date()), format: DA.Security.info.Tags.DateFormat });
		var submitButton = new Ext.Button({ text: 'Show', handler: this.onApplyButtonClick, scope: this });
		var reportTypePanel = {
			xtype: 'fieldset',
			title: 'Filter',
			bodyStyle: 'padding: 5px;',
			height: 250,
			width: 350,
			items: [
				clientCombo,
				locationCombo,
				assetCombo
			]
		};
		var searchPanel = {
			xtype: 'fieldset',
			title: 'Date Range',
			bodyStyle: 'padding: 5px;',
			height: 200,
			width: 350,
			items: [startDate, endDate, submitButton]
		};

		if (!this.panel) {
			this.panel = new Ext.form.FormPanel({
				layout: 'form',
				title: 'BMX Report',
				closeAction: 'hide',
				closable: true,
				autoScroll: true,
				bodyStyle: 'padding: 5px;',
				defaults: { border: false, defaults: { width: 270, labelWidth: 80 } },
				items: [
				{
					items:
					  [reportTypePanel, searchPanel]
				}
				]
			});
		}

		return this.panel;
	},
	show: function () {
		DCPLApp.AddTab(this.createDashboard());
	}
});
Cooler.BMXReport = new Cooler.BMXReport();