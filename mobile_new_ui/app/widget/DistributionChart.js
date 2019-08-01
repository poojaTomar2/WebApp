Ext.define('CoolerIoTMobile.widget.DistributionChart', {
	extend: 'Ext.Container',
	cls: 'background-white-container',
	xtype: 'distributionChart',
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
		var me = this;
		var chart = new FusionCharts({
			type: "pie2d",
			width: "100%",
			height: "100%",
			dataFormat: "json",
			dataSource: {
				"chart": {
                "bgColor": "#ffffff",
                "use3DLighting": "0",
                "pieRadius": "65",
                "placeValuesInside": "1",
                "showlabels": "0",
                "showLegend": "0",
                "theme": "zune",
                "showPlotBorder": "1",
                "plotBorderColor": "#4296C2",
                "valueFontColor": "#333333"
				},
				"data": data
                      }
		});
		chart.render(me.id);
		this.chartId = chart;
	}
	
});




