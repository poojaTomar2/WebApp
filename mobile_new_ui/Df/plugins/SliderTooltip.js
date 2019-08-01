Ext.define('Df.plugins.SliderTooltip', {
	//extend: 'Object',

	xtype: 'df-slider-tooltip',

	config: {
		tpl: "{0}",
		tooltipUpdater: null,
		tipCfg: null
	},

	constructor: function(config) {
		this.initConfig(config);
	},

	init: function (slider) {
		slider.on({
			'drag': this.onDrag,
			'dragend': this.onDragEnd,
			'destroy': this.onDestroy,
			scope: this
		});
	},

	onDestroy: function() {
		Ext.destroy(this.tip);
	},

	createTooltip: function() {
		return new Ext.Panel(Ext.apply({
			floating: true,
			width: 150,
			height: 30,
			styleHtmlContent: true,
			style: "background-color: #FFF;"
		}, this.getTipCfg()));
	},

	onDrag: function (slider, slide, theThumb, ThumbValue, e, eOpts) {
		var tip = this.tip;
		if (!tip) {
			tip = this.createTooltip();
			this.tip = tip;
			Ext.Viewport.add(tip);
		}

		var tip = this.tip;
		tip.showBy(theThumb);
		tip.element.setHtml(this.updateTooltip(ThumbValue));
	},

	updateTooltip: function (value) {
		var tooltipUpdater = this.getTooltipUpdater();
		if (tooltipUpdater) {
			return tooltipUpdater(value);
		}
		return Ext.util.Format.format(this.getTpl(), value)
	},

	onDragEnd: function () {
		this.tip.hide();
	}

});