Ext.define('CoolerIoTMobile.widget.AgingChart', {
	extend: 'Ext.Container',
	xtype: 'agingChart',
	config: {
		data: null,
		chartTitle: null,
		flex: 1,
		chartHeight: null,
		chartWidth: null,
		listeners: {
			destroy: function (container) {
				var chart = getChartFromId('fu-aging-chart');
				if (chart) {
					chart.dispose();
				}
			}
		}
	},
	updateData: function (data) {
		var chart = getChartFromId('fu-aging-chart');
		if (chart) {
			chart.dispose();
		}
		var chart = new FusionCharts({
			type: "MSColumn2D",
			id: 'fu-aging-chart',
			width: "100%",
			height: "100%",
			dataFormat: "json",
			dataSource: {
				"chart": {
					"caption": this.getChartTitle(),
					"plotgradientcolor": "",
					"bgcolor": "FFFFFF",
					"showalternatehgridcolor": "0",
					"divlinecolor": "CCCCCC",
					"showvalues": "0",
					"showcanvasborder": "0",
					"canvasborderalpha": "0",
					"canvasbordercolor": "CCCCCC",
					"canvasborderthickness": "1", 
					"captionpadding": "30",
					"yaxisvaluespadding": "15",
					"legendborderalpha": "0",
					"palettecolors": "#f8bd19,#008ee4,#33bdda,#e44a00,#6baa01,#583e78",
					"showplotborder": "0",
					"showborder": "0"
				},
				"categories": [
					{
						"category": [
							{
								"label": "Outlet 1"
							},
							{
								"label": "Outlet 2"
							},
							{
								"label": "Outlet 3"
							},
							{
								"label": "Outlet 4"
							}
						]
					}
				],
				"dataset": [
					{
						"seriesname": "Missing",
						"data": [
							{
								"value": "22"
							},
							{
								"value": "24"
							},
							{
								"value": "21"
							},
							{
								"value": "30"
							}
						]
					},
					{
						"seriesname": "Purity",
						"data": [
							{
								"value": "10"
							},
							{
								"value": "11"
							},
							{
								"value": "12"
							},
							{
								"value": "15"
							}
						]
					},
					{
						"seriesname": "Temp",
						"data": [
							{
								"value": "12"
							},
							{
								"value": "11"
							},
							{
								"value": "17"
							},
							{
								"value": "15"
							}
						]
					},
					{
						"seriesname": "Humidity",
						"data": [
							{
								"value": "20"
							},
							{
								"value": "18"
							},
							{
								"value": "17"
							},
							{
								"value": "23"
							}
						]
					},
					{
						"seriesname": "Sound",
						"data": [
							{
								"value": "22"
							},
							{
								"value": "19"
							},
							{
								"value": "20"
							},
							{
								"value": "21"
							}
						]
					},
					{
						"seriesname": "Light",
						"data": [
							{
								"value": "9"
							},
							{
								"value": "20"
							},
							{
								"value": "17"
							},
							{
								"value": "23"
							}
						]
					}
				]
			}

		});
		chart.render(this.id);
	}
});




