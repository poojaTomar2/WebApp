Cooler.DashBoard = Ext.extend(Object, {
	tpl: new Ext.Template(
		'<div class="dashboardMain"><div class="x-title-text">COOLER HEALTH</div>',
		'<div class="dashboard">',
		'<span><div>116788</div><p>Total Coolers</p></span>',
		'<span><div><a href="javascript:Cooler.CoolerSummaryStatewise.ShowList({}, {extraParams: {groupBy: \'auto\'}});">{TotalCoolers}</a></div><p>Tracked Coolers</p></span>',
		'<span><div>{SmartCoolers}</div><p>Smart Coolers</p></span>',
		'<span><div>{UnhealthyCoolers}</div><p>UnHealthy Coolers</p></span>',
		'<span><div>{HumidCoolers}</div><p>Humid Coolers</p></span>',
		'<span><div>{TemperatureIssueCoolers}</div><p>Temperature Issue Coolers</p></span>',
		'<span><div>{LightIssueCoolers}</div><p>Light Issue Coolers</p></span>',
		'<span><div>{SoundIssueCoolers}</div><p>Sound Issue Coolers</p></span>',
		'<span><div>{StockBelow150}</div><p>Stock Below 40%</p></span>',
		'<span><div>{TotalStock}</div><p>Shelf Availability below 70%</p></span>',
		'</div></div>'
	),
	onSuccess: function (response) {
		var data = Ext.decode(response.responseText).records[0];
		this.detailPanel.body.update(this.tpl.apply(data));
	},
	getData: function () {
		// Basic request
		Ext.Ajax.request({
			url: 'controllers/CoolerSummary.ashx',
			success: this.onSuccess,
			params: {},
			scope: this
		});
	},
	startTask: function () {
		// equivalent using TaskMgr
		Ext.TaskMgr.start({
			run: this.getData,
			interval: 5000,
			scope: this
		});
	},
	createDetailPanel: function () {
		if (!this.detailPanel) {
			this.detailPanel = new Ext.Panel({
				items: [{ xtype: 'container', region: 'center' }]
			});
		}
		//this.startTask();
		return this.detailPanel;
	},
	createDashBoard: function () {
		var detailPanel = this.createDetailPanel();
		if (!this.panel) {
			this.panel = new Ext.Panel({
				title: 'Dashboard',
				autoScroll: true,
				width: '100%',
				items: [
					detailPanel,
					{
						xtype: 'panel',
						autoLoad: { url: 'D3Charts.html', scripts: true } // your HTML file containing d3 code.
					}]
			});
		}
		return this.panel;
	},

	show: function () {
		DCPLApp.AddTab(this.createDashBoard());
	}
});
Cooler.DashBoard = new Cooler.DashBoard();