Ext.define("Df.fusion.Chart", {
	extend: 'Ext.Component',
	xtype: 'df-fusionchart',
	requires: [
		'Df.fusion.Settings'
	],

	config: {
		categories: null,
		series: null,
		store: null,
		url: null,
		baseParams: null,
		extraParams: null,
		chartUrl: null,
		title: null,
		dataSource: null,
		chartType: null,
		swfUrl: null,
		dataFormat: 'json',
		chartConfig: null,
		ignoreSameDataRefresh: true,
		itemId: null,
		width: '100%',
		height: '100%'
	},


	applyStore: function (store) {
		if (!store) {
			return store;
		}
		return Ext.getStore(store);
	},

	getChartJson: function () {
		var categories = this.getCategories();

		var returnValue = {};
		var isSingleSeries = true;

		var store = this.getStore();

		if (categories) {
			var dCategories = [];
			for (var i = 0, len = categories.length; i < len; i++) {
				var categoryInfo = categories[i];
				var field = categoryInfo.field;
				var renderer = categoryInfo.renderer || this.defaultRenderer;
				var categoryData = [];
				for (var rIndex = 0, rCount = store.getCount() ; rIndex < rCount; rIndex++) {
					var record = store.getAt(rIndex);
					categoryData.push({ label: renderer(record.get(field), record) });
				}
				dCategories.push({ category: categoryData });
			}
			returnValue.categories = dCategories;
			isSingleSeries = false;
		}

		var seriesList = this.getSeries();
		var dataset = [];
		for (var i = 0, len = seriesList.length; i < len; i++) {
			var series = seriesList[i];
			var seriesData = [];
			var field = series.field;
			var label = series.label;
			var renderer = series.renderer || this.defaultRenderer;
			for (var rIndex = 0, rCount = store.getCount() ; rIndex < rCount; rIndex++) {
				var record = store.getAt(rIndex);
				var o = { value: record.get(field) };
				if (label) {
					o.label = renderer(record.get(label), record);
				}
				seriesData.push(o);
			}
			dataset.push(Ext.copyTo({ data: seriesData }, series, ['seriesname', 'color', 'plotborder']));
		}
		returnValue.dataset = dataset;

		return Ext.applyIf(returnValue, this.getChartConfig());
	},

	defaultRenderer: function (v) {
		return v;
	},

	getDataSource: function () {
		if (this.getDataFormat() === 'json') {
			var store = this.getStore();
			if (store) {
				return this.getChartJson();
			} else {
				return this._dataSource;
			}
		}

		var src = this._dataSource;
		if (!src) {
			return this.getAjaxUrl();
		}
		return src;
	},

	getAjaxUrl: function () {
		var url = this._url;
		if (url) {
			var extraParams = this.getExtraParams();
			if (extraParams) {
				url = url + (url.indexOf("?") > -1 ? "&" : '?') + Ext.urlEncode(this.getExtraParams());
			}
		}
		return url;
	},

	lastData: null,

	onAjaxComplete: function (response, options) {
		if (this.getIgnoreSameDataRefresh()) {
			if (this.lastData === response.responseText) {
				return;
			} else {
				this.lastData = response.responseText;
			}
		}
		var data = Ext.decode(response.responseText);
		var chartConfig = this.getChartConfig();

		// if we want datastreaming url to set to auto
		if (chartConfig.chart.refreshinterval && !chartConfig.chart.datastreamurl) {
			chartConfig.chart.datastreamurl = this.getAjaxUrl() + "&Streaming=true";
		}

		var chartConfig = Ext.applyIf(this.parseJson(data, chartConfig), chartConfig);
		// Code Start
		//chartConfig.chart is of type Ext.Object.classify.objectClass while we need simple object
		var config = chartConfig.chart,
			newChartConfig = {};
		for (key in config) {
			newChartConfig[key] = config[key];
		}
		chartConfig.chart = newChartConfig;
		// Code End
		this.setDataSource(chartConfig);
		this.refresh(true);
	},

	parseJson: function (data, chartConfig) {
		var series = this.getSeries();
		if (!series) {
			return data;
		}

		var returnValue = {
			dataset: this.buildDataSet(series, data)
		};

		var categories = this.getCategories();
		if (categories) {
			returnValue.categories = this.buildCategories(categories, data);
		}
		return returnValue;
	},

	buildCategories: function (categories, data) {
		var dCategories = [];
		for (var i = 0, len = categories.length; i < len; i++) {
			var categoryInfo = categories[i];
			var field = categoryInfo.field;
			var renderer = categoryInfo.renderer || this.defaultRenderer;
			var categoryData = [];
			for (var rIndex = 0, rCount = data.length ; rIndex < rCount; rIndex++) {
				var record = data[rIndex];
				categoryData.push({ label: renderer(record[field], record) });
			}
			dCategories.push({ category: categoryData });
		}
		return dCategories;
	},

	buildDataSet: function (seriesList, data) {
		var dataset = [];
		for (var i = 0, len = seriesList.length; i < len; i++) {
			var series = seriesList[i];
			var seriesData = [];
			var field = series.field;
			var label = series.label,
				data = data.records;
			var renderer = series.renderer || this.defaultRenderer;
			var labelRenderer = series.labelRenderer || this.defaultRenderer;
			for (var rIndex = 0, rCount = data.length ; rIndex < rCount; rIndex++) {
				var record = data[rIndex];
				var o = { value: renderer(record[field], record) };
				if (label) {
					o.label = labelRenderer(record[label], record);
				}
				seriesData.push(o);
			}
			dataset.push(Ext.copyTo({ data: seriesData }, series, ['seriesname', 'color', 'plotborder']));
		}
		return dataset;
	},


	refresh: function (store) {
		if (!this.chart) {
			return;
		}
		if (!store && this.getDataFormat() === 'json') {
			var store = this.getStore();
			var params = Ext.apply({}, this.getBaseParams(), this.getExtraParams());
			if (store) {
				store.load({
					params: params,
					callback: this.refresh,
					scope: this
				});
			} else {
				var ajaxUrl = this.getUrl();
				if (ajaxUrl) {
					Ext.Ajax.request({
						url: ajaxUrl,
						params: params,
						success: this.onAjaxComplete,
						scope: this
					});
				} else if (!this.chartRendered) {
					this.chart.render(this.element.select("div").elements[1]);
				}
			}
			return;
		}
		this.chart.setChartData(this.getDataSource(), this.getDataFormat());

		if (!this.chartRendered) {
			this.chart.render(this.element.select("div").elements[1]);
		}
	},

	setExtraParam: function (key, value) {
		this.getExtraParams()[key] = value;
	},

	initialize: function () {
		this.callParent();
		this.on('painted', this.createChart);
	},

	chartRendered: false,

	createChart: function () {
		var dataFormat = this.getDataFormat();
		var el = Ext.DomHelper.append(this.element, {
			tag: 'div',
			style: 'width:100%;height:100%'
		}, true);
		if (!this.chart) {
			this.chart = new FusionCharts({
				type: this.getChartType(),
				swfUrl: this.getSwfUrl(),
				width: "100%",
				height: "100%",
				id: this.getItemId(),
				renderAt: el,
				dataFormat: dataFormat,
				dataSource: this.getDataSource()
			});
		}
		if (dataFormat === 'json') {
			this.refresh();
		} else {
			this.chartRendered = true;
			this.chart.render();
		}
	},

	destroy: function () {
		if (!this.chart)
			return;
		this.chart.dispose();
		this.chart = null;
		this.callParent();

		var store = this.getStore();
		this.setStore(null);
		if (store && (store.autoDestroy || store.getAutoDestroy())) {
			Ext.destroy(store);
		}
	}
});
