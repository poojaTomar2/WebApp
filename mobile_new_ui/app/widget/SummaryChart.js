Ext.define('CoolerIoTMobile.widget.SummaryChart', {
	extend: 'Ext.Container',
	xtype: 'summaryChart',
	config: {
		data: null,
		chartTitle: null,
		flex: 1,
		listeners: {
			destroy: function (container) {
				var chart = getChartFromId('fu-summarychart');
				if (chart) {
					chart.dispose();
				}
			}
		}
	},
	updateData: function (data, chartTitle) {
		var chart = getChartFromId('fu-summarychart');
		if (chart) {
			chart.dispose();
		}
		chart = new FusionCharts({
			type: "MSCombiDY2D",
			id: 'fu-summarychart',
			width: '100%',
			height: '100%',
			dataFormat: "json",
			dataSource: this.getChartDataSource(data, chartTitle)
		});
		this.chart = chart;
		Ext.Function.defer(function () {
			this.chart.render(this.id);
		}, 1, this);
	},
	getChartDataSource: function (records, caption) {
		var category = [],
			temperature = [],
			light = [],
			door = [],
			record = null,
			healthData = records.HealthData,
			doorData = records.DoorData,
			eventTime, slotRecord;

		for (var i = 0, len = doorData.length; i < len; i++) {
			record = doorData[i];
			category.push(record.SlotDescription);
			record.temperature = '';;
			record.light = '';
		};

		for (var i = 0, len = healthData.length; i < len; i++) {
			record = healthData[i];
			eventTime = record.EventTime.substr(0, 10) + '0000000';
			var index = doorData.map(function (x) { return x.SlotDescription; }).indexOf(eventTime);
			if (index > 0) {
				slotRecord = doorData[index];
				slotRecord.temperature = !Ext.isEmpty(slotRecord.temperature) && slotRecord.temperature > record.Temperature ? slotRecord.temperature : record.Temperature;
				slotRecord.light = !Ext.isEmpty(slotRecord.light) && slotRecord.light < record.LightIntensity ? slotRecord.light : record.LightIntensity;
			}
		};

		for (var i = 0, len = category.length; i < len; i++) {
			category[i] = { name: this.chartTimeFormat(category[i]) };
			var slotRecord = doorData[i], healthRecordCount = slotRecord.healthRecordCount;
			door[i] = { value: slotRecord.DoorCount };
			temperature[i] = { value: slotRecord.temperature };
			light[i] = { value: slotRecord.light };
		}

		var json = {
			"chart": {
				"showvalues": "0",
				"caption": this.getChartTitle(),
				"xAxisName": "Hours",
				"pyAxisName": "Temperature/ Door Count",
				"syAxisName": "Light",
				"dateformat": "hh:mm",
				"labelStep": "1"
			},
			"categories": [{ "category": category }],
			"dataset": [
				{ "seriesname": "Temperature", "parentyaxis": "P", "renderas": "Line", "data": temperature },
				{ "seriesname": "Light", "parentyaxis": "S", "renderas": "Line", "data": light },
				{ "seriesname": "Door", "parentyaxis": "P", "renderas": "Bar", "data": door }
			]
		};
		return json;
	},
	chartTimeFormat: function (input) {
		var date = new Date(input.slice(0, 4), input.slice(4, 6) - 1, input.slice(6, 8), input.slice(8, 10), input.slice(10, 12), input.slice(12, 14));
		return Ext.Date.format(date, 'd-M H:i');
	}
});
