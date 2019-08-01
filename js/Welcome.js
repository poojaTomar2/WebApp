Ext.ns("Cooler.Portlets");

Ext.override(DA.Portal.Home, {
	autoRefresh: true
});

Cooler.Portlets.Summary = function (config) {
	config.html = '<div id="Cooler-Summary">Loading...</div>';
	Cooler.Portlets.Summary.superclass.constructor.call(this, config);
};

Ext.extend(Cooler.Portlets.Summary, Ext.Panel, {
	plugins: [Ext.ux.PortletPlugin],
	title: 'Cooler Summary',
	initComponent: function () {
		Cooler.Portlets.Summary.superclass.initComponent.call(this);
		this.on('render', this.getData, this)
	},
	tpl: new Ext.Template(
		'<table>',
		'<tr><td><b>Total Coolers:</b></td><td align="right"><a href="javascript:Cooler.CoolerSummaryStatewise.ShowList({}, {extraParams: {groupBy: \'auto\'}});">{TotalCoolers}</a></td></tr>',
		'<tr><td><b>Smart Coolers:</b></td><td align="right">{SmartCoolers}</td></tr>',
		'<tr><td><b>Active Coolers:</b></td><td align="right">{ActiveCoolers}</td></tr>',
		'<tr><td><b>UnHealthy Coolers:</b></td><td align="right">{UnhealthyCoolers}</td></tr>',
		'<tr><td><b>Humid Coolers:</b></td><td align="right">{HumidCoolers}</td></tr>',
		'<tr><td><b>Temperature Issue Coolers:</b></td><td align="right">{TemperatureIssueCoolers}</td></tr>',
		'<tr><td><b>Light Issue Coolers:</b></td><td align="right">{LightIssueCoolers}</td></tr>',
		'<tr><td><b>Sound Issue Coolers:</b></td><td align="right">{SoundIssueCoolers}</td></tr>',
		'<tr><td><b>Purity Issue Coolers:</b></td><td align="right">{PurityIssueCoolers}</td></tr>',
		'<tr><td><b>Stock Below 150:</b></td><td align="right">{StockBelow150}</td></tr>',
		'<tr><td><b>Stock:</b></td><td align="right">{Stock}</td></tr>',
		'</table>'
	),
	updateContent: function (content) {
		var pnl = Ext.get('Cooler-Summary');
		pnl.update(content);
	},
	onSuccess: function (response) {
		var data = Ext.decode(response.responseText).records[0];
		this.updateContent(this.tpl.apply(data));
	},
	onFailure: function () {

	},
	getData: function () {
		//this.updateContent('Refreshing...');
		// Basic request
		Ext.Ajax.request({
			url: 'controllers/CoolerSummary.ashx',
			success: this.onSuccess,
			failure: this.onFailure,
			params: {},
			scope: this
		});
	},
	startTask: function () {
		// equivalent using TaskMgr
		//Ext.TaskMgr.start({
		//	run: this.getData,
		//	interval: 5000,
		//	scope: this
		//});
	}
});
//Ext.ns("Cooler.Portlets");
//Cooler.Portlets.pieChart = Ext.extend(DA.Portlets.ChartWithSettings, {
//	title: 'Pie Chart',
//	chartURL: 'charts/Pie2D.swf',
//	height: 100,
//	baseUrl: EH.BuildUrl('PieChart') + '?type=1',
//	fields: {},
//	createForm: function () {
//		var stateStore = new Ext.data.JsonStore({ url: 'Controllers/Combo.ashx', root: 'records', fields: ExtHelper.Record.Lookup, id: 'LookupId', baseParams: { comboType: 'State' } });
//		var stateSelect = ExtHelper.CreateCombo({ fieldLabel: 'Select State', hiddenName: 'state', displayField: 'DisplayValue', baseParams: { comboType: 'State' }, controller: 'combo', listWidth: 250 });
//		stateStore.load({
//			callback: function () {
//				ExtHelper.SetComboValue(stateSelect, this.params.state);
//			},
//			scope: this
//		});
//		return new Ext.form.FormPanel({
//			xtype: 'form',
//			items: [
//				this.fields.stateSelect = stateSelect
//			],
//			defaults: { height: 50 }
//		});
//	},
//	settingHandler: function (e, target, panel) {
//		if (!this.settingWin) {
//			this.form = this.createForm();
//			var settingWin = new Ext.Window(Ext.apply({
//				height: 150,
//				width: 500,
//				autoScroll: true,
//				title: 'Settings',
//				layout: 'fit',
//				closeAction: 'hide',
//				modal: true,
//				items: [this.form],
//				buttons: [
//					{ text: 'Apply', handler: this.onApply, scope: this }
//				]
//			}, this.winCfg));
//			this.settingWin = settingWin;
//			this.settingWin.on('show', this.loadSettings, this, { defer: 50 });
//		}
//		this.settingWin.show();
//		this.afterShow();
//	},
//});

//Cooler.Portlets.stackedChart = Ext.extend(Cooler.Portlets.pieChart, {
//	chartURL: 'charts/StackedColumn3D.swf',
//	showDateType: false
//});
//DA.Portal.register('Cooler-pieChart', Cooler.Portlets.pieChart);
//DA.Portal.register('Cooler-stackedChart', Cooler.Portlets.stackedChart);
DA.Portal.register('summary', Cooler.Portlets.Summary);

(function () {
	DA.Portal.register('Cooler-summary', Cooler.Portlets.Summary);

	DA.Portal.addPortlet({
		id: 'CoolerSummary', col: 0, title: 'Summary', auto: true, portlet: 'Cooler-summary', description: 'See summary'
	});
	//DA.Portal.addPortlet({
	//	id: 'pieChart', col: 2, title: 'Smart Coolers', portlet: 'Cooler-pieChart', description: 'See pie chart', isForAging: false,
	//	config: { title: 'Pie Chart', chartURL: 'charts/Pie2D.swf', baseUrl: EH.BuildUrl('PieChart') + '?reportType=' + Cooler.Enums.ReportTypePieChart.SmartCoolers }
	//});
	//DA.Portal.addPortlet({
	//	id: 'activePieChart', col: 2, title: 'Active Coolers', portlet: 'Cooler-pieChart', description: 'See pie chart', isForAging: false,
	//	config: { title: 'Pie Chart', chartURL: 'charts/Pie2D.swf', baseUrl: EH.BuildUrl('PieChart') + '?reportType=' + Cooler.Enums.ReportTypePieChart.ActiveCoolers }
	//});
	//DA.Portal.addPortlet({
	//	id: 'healthIssuesChart', col: 2, title: 'Health Issues', portlet: 'Cooler-stackedChart', description: 'See stacked chart',
	//	config: { title: 'Stacked Chart', baseUrl: EH.BuildUrl('StackedChart') + '?reportType=' + Cooler.Enums.ReportTypeStackedChart.HealthIssue + '&length=4&' }
	//});
	DCPLApp.initialConfig.center = {
		items: [{ xtype: 'home-portal', title: 'Analytics' }]
	};
}());