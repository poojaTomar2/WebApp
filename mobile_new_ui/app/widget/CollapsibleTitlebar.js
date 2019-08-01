Ext.define('CoolerIoTMobile.widget.CollapsibleTitlebar', {
	extend: 'Ext.Component',
	xtype: 'collapsible-titlebar',
	config: {
		baseCls: 'iot-collapsible-title',
		title: null,
		collapsed: false,
		targetEl: null,
		tpl: [
			'<div class="iot-row-icon iot-row-{[values.collapsed ? "expandable" : "expanded"]}"></div>{title}'
		]
	},

	initialize: function() {
		this.callParent(arguments);
		this.on({
			element: 'element',
			tap: this.toggleTitle,
			scope: this
		});
	},

	classes: [
		"iot-row-expandable",
		"iot-row-expanded"
	],

	toggleTitle: function () {
		this.setCollapsed(!this.getCollapsed());
	},

	updateCollapsed: function (value) {
		this.updateData({ collapsed: value, title: this.getTitle() });
		if (!this.rendered) {
			return;
		}
		var targetEl = this.getTargetEl();
		if (typeof targetEl === 'string') {
			var target = this.up().child(targetEl);
			if (target) {
				target.setHidden(value);
			}
		}
	},

	// @private
	updateTitle: function (newTitle) {
		this.updateData({ collapsed: this.getCollapsed(), title: newTitle });
	}
});