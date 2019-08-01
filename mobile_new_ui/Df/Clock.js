Ext.define('Df.Clock', {
	extend: 'Ext.Component',
	xtype: 'clock',
	config: {
		cls: 'df-clock'
	},
	initialize: function () {
		this.callParent(arguments);
		this.startTimer();
		this.on('destroy', this.killTimer, this);
	},

	startTimer: function () {
		var self = this;
		this.task = setInterval(function () { self.updateTime(); }, 500);
		this.updateTime();
	},

	updateTime: function () {
		this.setHtml(Ext.Date.format(new Date(), "h:i:s A"));
	},

	killTimer: function () {
		if (this.task) {
			clearInterval(this.task);
			delete this.task;
		}
	}
});
