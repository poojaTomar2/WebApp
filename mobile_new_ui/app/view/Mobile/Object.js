Ext.define('CoolerIoTMobile.view.Mobile.Object', {
	extend: 'Ext.Container',
	xtype: 'mobile-objective',
	cls: 'asset-item-list-container',
	config: {
		layout: 'fit',
		title: 'Objectives',
		items: [
			{
				xtype: 'df-fusionchart',
				chartType: 'msline',
				itemId: 'lowestOutletPurityChart',
				chartConfig: {
					chart: {
						caption: 'Lowest Outlet Purity',
						useRoundEdges: '1',
						"setAdaptiveYMin": "1",
						yAxisMaxValue: 100
					},
					"trendlines": [
						{
							"line": [
								{
									"startvalue": "75",
									"color": "009933",
									"displayvalue": "Target",
									"tooltext": "This trend was calculated last year"
								}
							]
						}
					]
				},
				series: [
					{
						field: 'AvgPurity',
						label: 'Location'
					}
				]
			}
		]
	},
	initialize: function () {
		this.callParent(arguments);
		this.on({
			activate: this.onActivate,
			scope: this
		})
	},

	onActivate: function () {
		Ext.Ajax.request({
			url: Df.App.getController('LowestOutletPurityChartData'),
			scope: this,
			success: function (response, opts) {
				var obj = Ext.decode(response.responseText);
				var msData = CoolerIoTMobile.UtilChart.createMultiSeriesBySum({
					data: obj.records,
					categoryField: 'Date',
					seriesIdField: 'LocationId',
					seriesNameField: 'Location',
					valueField: 'AvgPurity'
				});

				var chart = this.down("df-fusionchart");
				if (!chart)
					return;
				chart.chart.setChartData(Ext.apply(msData, chart.getChartConfig()), "json");
			},
			failure: function (response, opts) {
				console.log('server-side failure with status code ' + response.status);
			}
		});
	}
});