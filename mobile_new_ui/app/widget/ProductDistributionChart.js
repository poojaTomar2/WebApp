Ext.define('CoolerIoTMobile.widget.ProductDistributionChart', {
	extend: 'Ext.Container',
	cls: 'background-white-container',
	xtype: 'productChart',
	config: {
		data: null,
		chartTitle: null,
		flex: 1,
		listeners: {
			destroy: function (container) {
				var chart = getChartFromId('fu-productChart');
				if (chart) {
					chart.dispose();
				}
			}
		}
	},
	updateData: function (chartCombinedData) {
		var chart = getChartFromId('fu-productChart');
		if (chart) {
			chart.dispose();
		}
		var me = this;
		chart = new FusionCharts({
			type: "mscombi2d",
			id: 'fu-productChart',
			width: "100%",
			height: "100%",
			dataFormat: "json",
			dataSource: this.getChartDataSource(chartCombinedData)
		});
		this.chart = chart;
		Ext.Function.defer(function () {
			this.chart.render(this.id);
		}, 1, this);
	},
	getChartDataSource: function (chartCombinedData) {
		var category = [],
			stockDetail = [],
			planogram = [],
			categoryLength,
			stockDetailData = chartCombinedData[0].data,
			planogramDetailData = chartCombinedData[1].data,
			record = null;
		for (var i = 0, len = stockDetailData.length; i < len; i++) {
			record = stockDetailData[i];
			var index = planogramDetailData.map(function (x) { return x.label; }).indexOf(record.label);
			category[i] = { name: record.label };
			stockDetail[i] = { value: record.value };
			if (index > -1) {
				planogram[i] = { value: planogramDetailData[index].value, color: planogramDetailData[index].color };
			}
		};
		categoryLength = category.length;
		for (var i = 0, len = planogramDetailData.length; i < len; i++) {
			record = planogramDetailData[i];
			var index = stockDetailData.map(function (x) { return x.label; }).indexOf(record.label);
			if (index < 0) {
				category[categoryLength] = { name: record.label };
				planogram[categoryLength] = { value: record.value, color: record.color };
				categoryLength++;
			}
		};
		var json = {
			"chart": {
				"showvalues": "0",
				"caption": "Line: Actual / Stock BAR: Planogram",
				"xaxisname": "Products",
				"yaxisname": "Quantity",
				"showLabels": "1",
				"showLegend": "1",
				"bgColor": "#ffffff",
				"xAxisNameFontColor": "#4296C2",
				"yAxisNameFontColor": "#4296C2",
				"divLineColor": "#CEEEFF",
				"divLineDashed": "0",
				"theme": "zune"
			},
			"categories": [{ "category": category }],
			"dataset": [
				{ "seriesname": "Actual Stock ", "renderas": "Line", "data": stockDetail },
				{ "seriesname": "Planogram", "renderas": "Bar", "data": planogram }
			]
		};
		return json;
	}
});
