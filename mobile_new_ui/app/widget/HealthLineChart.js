Ext.define('CoolerIoTMobile.widget.HealthLineChart', {
	extend: 'Ext.Container',
	xtype: 'healthLineChart',
	config: {
		data: null,
		chartTitle: null,
		flex: 1,
		listeners: {
			destroy: function (container) {
				var chart = getChartFromId('fu-distributionchart1');
				if (chart) {
					chart.dispose();
				}
			}
		}
	},
	updateData: function (data, chartTitle) {
		var chart = getChartFromId('fu-distributionchart1');
		var caption = this.getChartTitle(), chartType = 'line';
		if (chart) {
			chart.dispose();
		}
		if (caption.indexOf('Door') > -1) {
			chartType = 'column2d';
		}
		 chart = new FusionCharts({
		 	type: chartType,
		 	id: 'fu-distributionchart1',
			width: '100%',
			height: '100%',
			dataFormat: "json",
			dataSource: {
				"chart": {
					"showvalues": "0",
					"caption": caption,
					"theme": "fint",
					"xAxisName": "Hours",
					"yAxisName": "Values",
					"dateformat": "hh:mm ",
					"paletteColors": "#A2C832",
					"outputdateformat": "hh:mn"
				},
				"data": data
            }
		});
		 this.chart = chart;
		 Ext.Function.defer(function () {
		 	this.chart.render(this.id);
		 }, 1, this);
	}
});




