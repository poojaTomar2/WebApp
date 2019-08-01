Cooler.ChartDashBoard = Ext.extend(Object, {
	tpl: new Ext.Template(
		'<div class="dashboardMain"><div class="x-title-text">COOLER HEALTH</div>',
		'<div class="dashboard">',
		'<span style="width: 19%;"><div>{TotalCoolers}</div><p>Total Coolers</p></span>',
		'<span style="width: 19%;"><div>{SmartCoolers}</div><p>Smart Coolers</p></span>',
		'<span style="width: 19%;"><div>{UnhealthyCoolers}</div><p>UnHealthy Coolers</p></span>',
		'<span style="width: 19%;"><div>{TemperatureIssueCoolers}</div><p>Temperature Issue Coolers</p></span>',
		'<span style="width: 19%;"><div>{LightIssueCoolers}</div><p>Light Issue Coolers</p></span>',
		'</div></div>'
	),
	getData: function () {
		// Basic request
		if (!this.dataLoad) {
			Ext.Ajax.request({
				url: 'controllers/LineCharts.ashx',
				success: this.onLineChartSuccess,
				params: {
					action: 'LineChartData'
				},
				scope: this
			});
		}
		else {
			Ext.TaskMgr.stop(this.task);
		}
	},
	startTask: function () {
		//this.dataLoad = false;
		this.dataLoad = true;
		var task = {
			run: this.getData,
			interval: 5000,
			scope: this
		};
		this.task = task;
		Ext.TaskMgr.start(task);
	},
	createDetailPanel: function () {
		if (!this.detailPanel) {
			this.detailPanel = new Ext.Panel({
				items: [{ xtype: 'container', region: 'center' }]
			});
		}
		this.startTask();
		return this.detailPanel;
	},
	createDashBoard: function () {
		var detailPanel = this.createDetailPanel();
		if (!this.panel) {
			this.panel = new Ext.Panel({
				title: 'Dashboard New',
				autoScroll: true,
				items: [
					detailPanel
				]
			});
		}
		return this.panel;
	},
	onLineChartSuccess: function (response) {
		this.dataLoad = true;
		var data = Ext.decode(response.responseText);
		this.detailPanel.body.update(this.tpl.apply(data.coolerSummary[0]));
	},

	show: function () {
		DCPLApp.AddTab(this.createDashBoard());
	}
});
Cooler.ChartDashBoard = new Cooler.ChartDashBoard();