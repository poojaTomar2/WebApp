Cooler.Chart = Ext.extend(Object, {
	updateChartPanel: function () {
		var chartTypeId = this.chartTypeCombo.getValue(), clientId = this.clientCombo.getValue(), controllerName = 'Controllers/',
		startDate = this.startDateField.getValue(),
		endDate = this.endDateField.getValue(),
		hourly = this.hourlyField.getValue();
		if (Ext.isEmpty(chartTypeId) || Ext.isEmpty(startDate) || Ext.isEmpty(endDate)) {
			Ext.Msg.alert('Alert', 'Please correct data errors before continuing');
			return;
		}
		if (startDate > endDate) {
			Ext.Msg.alert('Alert', 'Start Date can\'t be greater then End Date');
			return;
		}
		if (clientId == '') {
			clientId = 0;
		}

		var params = { };
		this.chartTypeId = Number(chartTypeId);
		switch (this.chartTypeId) {
			case Cooler.Enums.ChartType.All:
				controllerName = controllerName.concat('DashBoardAPI.ashx');
				params.chartParam = Ext.encode({
					"clientId": clientId,
					"startDate": startDate,
					"endDate": endDate,
					dateInterval: hourly ? 'Hour' : 'Day',
					metrics: [
						{ entity: 'SmartDeviceDoorStatus', maximumDocumentCount: 20, name: 'doorOpenLessThan20', metricType: 'Count' },
						{ entity: 'AssetPurity', name: 'purityIssues', metricType: 'Count', filter: { "field": "PurityPercentage", "operator": "LessThan", "value": 100 } },
						{ entity: 'AssetPurity', name: 'shelfVoid', metricType: 'Count', filter: { "field": "StockPercentage", "operator": "LessThan", "value": 60 } },
						{ entity: 'AssetPurity', name: 'planogramNonCompliance', metricType: 'Count', filter: { "field": "PlanogramCompliance", "operator": "LessThan", "value": 100 } }
					]
				});
				break;
			case Cooler.Enums.ChartType.Health:
				controllerName = controllerName.concat('DashBoardAPI.ashx');
				params.chartParam = Ext.encode({
					"clientId": clientId,
					"startDate": startDate,
					"endDate": endDate,
					dateInterval: hourly ? 'Hour' : 'Day',
					metrics: [
						{ entity: 'SmartDeviceHealthRecord', name: 'lightIssues', metricType: 'Count', filter: { "field": "LightIntensity", "operator": "LessThan", "value": 10 } },
						{ entity: 'SmartDeviceHealthRecord', name: 'temperatureIssues', metricType: 'Count', filter: { "field": "Temperature", "operator": "GreaterThan", "value": 12 } },
						{ entity: 'SmartDeviceDoorStatus', maximumDocumentCount: 20, name:'doorOpenLessThanMin', metricType: 'Count'}
					]
				});
				break;
			case Cooler.Enums.ChartType.Purity:
				controllerName = controllerName.concat('DashBoardAPI.ashx');
				params.chartParam = Ext.encode({
					"clientId": clientId,
					"startDate": startDate,
					"endDate": endDate,
					dateInterval: hourly ? 'Hour' : 'Day',
					metrics: [
						{ entity: 'SmartDeviceDoorStatus', name: 'doorOpenOrClose', metricType: 'Count', minimumDocumentCount: 24 },
						{ entity: 'AssetPurity', name: 'purity', metricType: 'Count', filter: { "field": "PurityPercentage", "operator": "GreaterThan", "value": 80 } }]
				});
				break;
			default:
				Ext.Msg.alert('Info', 'Not Implemented yet');
				return false;
		}

		if (controllerName) {
			Ext.Ajax.request({
				url: controllerName,
				params: params,
				success: this.onSuccess,
				failure: this.onFailure,
				scope: this
			});
		}
	},
	onSuccess: function (result, request) {
		var json;
		var chartType = 'mscolumn3dlinedy';
		var response = Ext.decode(result.responseText), record, category = [];
		if (response.records.length > 0) {
			var hourly = this.hourlyField.getValue();
			switch (Number(this.chartTypeId)) {
				case Cooler.Enums.ChartType.All:
					var doorChartData = [], planogramChart = [], purityChart = [], shelfVoidChart = [];
					for (var i = 0, len = response.records.length; i < len; i++) {
						record = response.records[i];
						category.push({ label: !hourly ? new Date(record.date).format('d-M-Y\(D\)') : new Date(record.date).format('d-M H:i') });
						doorChartData.push({ value: record.doorOpenLessThan20 });
						planogramChart.push({ value: record.planogramNonCompliance });
						purityChart.push({ value: record.purityIssues });
						shelfVoidChart.push({ value: record.shelfVoid });
					};
					json = {
						"chart": {
							"showvalues": "0",
							"caption": 'Combine Chart',
							"xAxisName": 'Date/time',
							"yAxisName": '% of Cooler',
						},
						"categories": [{ "category": category }],
						"dataset": [
							{ "seriesname": "Purity Issue", "parentyaxis": "P", "renderas": "Bar", "data": purityChart },
							{ "seriesname": "Planogram Non Compliance", "parentyaxis": "P", "renderas": "Bar", "data": planogramChart },
							{ "seriesname": "Door open/close", "parentyaxis": "S", "renderas": "Line", "data": doorChartData },
							{ "seriesname": "ShelfVoid > 40%", "parentyaxis": "P", "renderas": "Bar", "data": shelfVoidChart }
						]
					};
					break;
				case Cooler.Enums.ChartType.Health:
					var doorChartData = [], lightChartData = [], temperatureChartData = [];
					for (var i = 0, len = response.records.length; i < len; i++) {
						record = response.records[i];
						category.push({ label: !hourly ? new Date(record.date).format('d-M-Y\(D\)') : new Date(record.date).format('d-M H:i') });
						lightChartData.push({ value: record.lightIssues });
						doorChartData.push({ value: record.doorOpenLessThanMin });
						temperatureChartData.push({ value: record.temperatureIssues });
					};
					json = {
						"chart": {
							"showvalues": "0",
							"caption": 'Health Chart',
							"xAxisName": 'Date/time',
							"yAxisName": '% of Cooler',
							"palette": "1"
						},
						"categories": [{ "category": category }],
						"dataset": [
							{ "seriesname": "Door open/close", "renderas": "Bar", "data": doorChartData },
							{ "seriesname": "Light Issue", "parentyaxis": "S", "renderas": "Line", "data": lightChartData },
							{ "seriesname": "Temperature Issue", "parentyaxis": "S", "renderas": "Line", "data": temperatureChartData }
						]
					};
					break;
				case Cooler.Enums.ChartType.Purity:
					var purity = [], doorOpenClose = [];
					for (var i = 0, len = response.records.length; i < len; i++) {
						record = response.records[i];
						category.push({ label: !hourly ? new Date(record.date).format('d-M-Y\(D\)') : new Date(record.date).format('d-M H:i') });
						purity.push({ value: record.purity });
						doorOpenClose.push({ value: record.doorOpenOrClose });
					};
					json = {
						"chart": {
							"showvalues": "0",
							"caption": 'Purity Chart',
							"xAxisName": 'Date/time',
							"yAxisName": '% of Cooler',
						},
						"categories": [{ "category": category }],
						"dataset": [
							{ "seriesname": "Door Open Close >= 24", "renderas": "Bar", "data": doorOpenClose },
							{ "seriesname": "Purity > 80%", "parentyaxis": "S", "renderas": "Line", "data": purity }
						]
					};
					break;
			}
			if (!Ext.isEmpty(json)) {
				new FusionCharts({
					type: chartType,
					renderAt: 'chart-container',
					dataFormat: 'json',
					width: '100%',
					scope: this,
					dataSource: json
				}).render();
			}
		}
	},
	onFailure: function (result, request) {
		Ext.Msg.alert('Alert', JSON.parse(result.responseText));
	},
	createChartDashBoard: function () {
		if (!this.panel) {
			var chartType = [
				[Cooler.Enums.ChartType.All, 'All'], [Cooler.Enums.ChartType.BIAlerts, 'BI Alerts'], [Cooler.Enums.ChartType.Health, 'Health'], [Cooler.Enums.ChartType.Planogram, 'Planogram'], [Cooler.Enums.ChartType.Purity, 'Purity'], [Cooler.Enums.ChartType.ShelfVoid, 'Shelf Void'], [Cooler.Enums.ChartType.VisitEffectiveness, 'Visit Effectiveness']
			];
			var clientCombo = DA.combo.create({ fieldLabel: 'Client', width: 100, itemId: 'clientCombo', name: 'ClientId', hiddenName: 'ClientId', controller: 'combo', listWidth: 220, baseParams: { comboType: 'Client' } });
			var chartTypeCombo = ExtHelper.CreateCombo({ fieldLabel: 'Chart Type', mode: 'local', store: chartType, width: 200, value: Cooler.Enums.ChartType.All, allowBlank: false });
			var startDateField = new Ext.form.DateField({ name: 'Start Date', fieldLabel: 'Start Date ', value: new Date().clearTime(), allowBlank: false, format: DA.Security.info.Tags.DateFormat });
			var endDateField = new Ext.form.DateField({ name: 'End Date', fieldLabel: 'End Date ', value: new Date().clearTime(), allowBlank: false, format: DA.Security.info.Tags.DateFormat });
			var hourlyField = new Ext.form.Checkbox({ name: 'hourly', fieldLabel: 'Hourly ' });
			this.clientCombo = clientCombo;
			this.chartTypeCombo = chartTypeCombo;
			this.startDateField = startDateField;
			this.endDateField = endDateField;
			this.hourlyField = hourlyField;
			var graphButton = new Ext.Button({ text: 'Graph', iconCls: 'btn-icon-graph', handler: this.updateChartPanel, scope: this });

			ExtHelper.CompareValidator({
				field: endDateField,
				compareTo: startDateField,
				operator: ">=",
				message: "End date must be equal or greater than Start date"
			});
			var col1 = {
				columnWidth: .2,
				labelWidth: 100,
				items: [
					clientCombo
				]
			};
			var col2 = {
				columnWidth: .2,
				labelWidth: 100,
				items: [
					chartTypeCombo
				]
			};
			var col3 = {
				columnWidth: .15,
				labelWidth: 60,
				items: [
					startDateField
				]
			};
			var col4 = {
				columnWidth: .15,
				labelWidth: 60,
				items: [
					endDateField
				]
			};
			var col5 = {
				columnWidth: .15,
				labelWidth: 50,
				items: [
					hourlyField
				]
			};
			this.panel = new Ext.Panel({
				title: 'Charts',
				autoScroll: true,
				width: '100%',
				items: [
					{
						xtype: 'panel',
						layout: 'column',
						border: false,
						defaults: { layout: 'form', border: false },
						items: [col1, col2, col3, col4, col5]

					},
					graphButton,
					{
						xtype: 'panel',
						autoLoad: { url: 'DashboardCharts.html', scripts: true }
					}
				]
			});
		}
		this.panel.on('afterlayout', function (a, b) {
			if (Ext.getDom('chart-container')) {
				this.updateChartPanel();
			}
		}, this)
		return this.panel;
	},

	show: function () {
		DCPLApp.AddTab(this.createChartDashBoard());
	}
});
Cooler.Chart = new Cooler.Chart();