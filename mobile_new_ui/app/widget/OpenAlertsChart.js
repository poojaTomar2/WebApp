Ext.define('CoolerIoTMobile.widget.OpenAlertsChart', {
	extend: 'Ext.Container',
	xtype: 'openAlertChart',
	config: {
		data: null,
		chartTitle: null,
		flex: 1,
		listeners: {
			destroy: function (container) {
				var chart = getChartFromId('fu-distributionchart');
				if (chart) {
					chart.dispose();
				}
			}
		}
	},
	updateData: function (data) {
		var chart = getChartFromId('fu-distributionchart');
		if (chart) {
			chart.dispose();
		}
		chart = new FusionCharts({
			type: "pie2d",
			id: 'fu-distributionchart',
			width: "100%",
			height: "100%",
			dataFormat: "json",
			dataSource: {
				"chart": {
					"caption": this.getChartTitle(),
					"palette": "2",
					"animation": "1",
					"formatnumberscale": "1",
					"decimals": "0",
					"pieslicedepth": "30",
					"startingangle": "125",
					"showBorder": "0"
				},
				"data": data
			}
		});
		this.chart = chart;
		Ext.Function.defer(function () {
			this.chart.render(this.id);
		}, 200, this);
	}
});
