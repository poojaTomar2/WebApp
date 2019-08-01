Ext.define('Df.fusion.Settings', {
	singleton: true,

	constructor: function () {
		FusionCharts.setCurrentRenderer('javascript');
		//FusionCharts.debugMode.enabled(true);
		//FusionCharts.debugMode.outputTo(console.log);
	}

});
